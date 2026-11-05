import type { NeonQueryFunction } from "@neondatabase/serverless";
import { z } from "zod";

const date = z.string().date();
const money = z.number().int().min(1).max(1_000_000_000);
const id = z.string().uuid();
const todayChile = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(new Date());

export async function management(
  sql: NeonQueryFunction<false, false>,
  actor: string,
  path: string,
  request: Request,
  response: (data: unknown, status?: number) => Response,
) {
  const [admin] = await sql`select 1 from linsy.user_roles where user_id=${actor} and role='admin'`;
  if (!admin) return response({ code: "forbidden" }, 403);

  if (request.method === "GET" && path === "management") {
    const [subscriptions, payments, businesses] = await sql.transaction([
      sql`select s.id,s.business_name,s.contact_name,s.contact_email,c.name as commune,s.plan,s.price_clp,
        s.starts_on::text,s.cancelled_at,max(p.next_renewal)::text as next_renewal
        from linsy.subscriptions s join linsy.communes c on c.slug=s.commune
        left join linsy.subscription_payments p on p.subscription_id=s.id
        group by s.id,c.name order by s.created_at desc,s.id`,
      sql`select p.id,p.subscription_id,s.business_name,p.amount_clp,p.paid_on::text,
        p.next_renewal::text,p.method,p.reference
        from linsy.subscription_payments p join linsy.subscriptions s on s.id=p.subscription_id
        order by p.paid_on desc,p.created_at desc,p.id`,
      sql`select b.id, r.name, c.name as commune, g.slot, g.starts_on::text, g.ends_on::text
        from linsy.businesses b
        join lateral (
          select name, commune from linsy.business_revisions
          where business_id=b.id and status<>'archived'
          order by (status='approved') desc limit 1
        ) r on true
        join linsy.communes c on c.slug=r.commune
        left join linsy.launch_grants g on g.business_id=b.id
        order by r.name,b.id`,
    ]);
    return response({ subscriptions, payments, businesses, today: todayChile() });
  }
  if (request.method === "POST" && path === "management/launch-grants") {
    const input = z
      .object({ business: id, startsOn: date, endsOn: date })
      .refine((value) => value.endsOn >= value.startsOn)
      .parse(await request.json());
    const [assigned] = await sql`select linsy.assign_launch_grant(${actor},${input.business},
      ${input.startsOn},${input.endsOn}) as slot`;
    return response(assigned);
  }
  if (request.method === "POST" && path === "management/subscriptions") {
    const input = z
      .object({
        id,
        name: z.string().trim().min(1).max(120),
        contact: z.string().trim().min(1).max(120),
        email: z.string().trim().email().max(254),
        commune: z.string().max(60),
        plan: z.string().trim().min(1).max(100),
        price: money,
        startsOn: date,
      })
      .parse(await request.json());
    await sql`insert into linsy.subscriptions (id,business_name,contact_name,contact_email,commune,plan,price_clp,starts_on,created_by)
      values (${input.id},${input.name},${input.contact},${input.email},${input.commune},${input.plan},${input.price},${input.startsOn},${actor})
      on conflict (id) do nothing`;
    return response(true);
  }
  if (request.method === "POST" && path === "management/payments") {
    const input = z
      .object({
        subscription: id,
        amount: money,
        paidOn: date,
        nextRenewal: date,
        method: z.enum(["transferencia", "efectivo", "otro"]),
        reference: z.string().trim().max(160),
      })
      .parse(await request.json());
    await sql`select linsy.record_subscription_payment(${actor},${input.subscription},${input.amount},${input.paidOn},
      ${input.nextRenewal},${input.method},${input.reference})`;
    return response(true);
  }
  if (request.method === "POST" && path === "management/cancel") {
    const { subscription } = z.object({ subscription: id }).parse(await request.json());
    await sql`update linsy.subscriptions set cancelled_at=now(),cancelled_by=${actor}
      where id=${subscription} and cancelled_at is null`;
    return response(true);
  }
  return response({ code: "not_found" }, 404);
}
