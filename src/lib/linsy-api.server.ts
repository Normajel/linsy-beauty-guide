import { management } from "./linsy-management.server";
import { handleAuthProxyRequest, handleAuthRequest, parseSessionData } from "@neon/auth/server";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import { normalizeText } from "./catalog";

const idSchema = z.string().uuid();
const draftSchema = z
  .object({
    expected: idSchema.nullable(),
    status: z.enum(["draft", "pending"]),
    name: z.string().trim().min(1).max(100),
    description: z.string().max(2000),
    category: z.string().max(60),
    commune: z.string().max(60),
    modality: z.enum(["local", "domicilio", "casa"]),
    whatsapp: z.string().regex(/^(569[0-9]{8})?$/),
    services: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(100),
          price: z.number().int().min(0).max(999999999).nullable(),
        }),
      )
      .max(20),
    photos: z.array(idSchema).max(6),
  })
  .refine((draft) => draft.status === "draft" || (draft.whatsapp && draft.services.length));
const maxPhoto = 3 * 1024 * 1024;
const authMethods: Record<string, string> = {
  "get-session": "GET",
  "email-otp/verify-email": "POST",
  "email-otp/send-verification-otp": "POST",
  "verify-email": "GET",
  "reset-password": "POST",
  "sign-in/social": "POST",
  "sign-in/email": "POST",
  "sign-up/email": "POST",
  "sign-out": "POST",
  "request-password-reset": "POST",
  "send-verification-email": "POST",
};
const response = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "cache-control": "no-store" } });
const fail = (code: string, status: number) => response({ code }, status);

export async function linsyApi(request: Request) {
  const url = new URL(request.url);
  const method = request.method;
  if (method !== "GET" && (method !== "POST" || request.headers.get("origin") !== url.origin))
    return fail("forbidden", 403);
  const baseUrl = process.env["NEON_AUTH_BASE_URL"];
  const cookieSecret = process.env["NEON_AUTH_COOKIE_SECRET"];
  if (url.pathname.startsWith("/api/auth/")) {
    const path = url.pathname.slice("/api/auth/".length);
    if (!Object.hasOwn(authMethods, path) || authMethods[path] !== method)
      return fail("not_found", 404);
    if (!baseUrl || !cookieSecret) return fail("unconfigured", 503);
    const result = await handleAuthProxyRequest({
      request,
      path,
      baseUrl,
      cookieSecret,
      sameSite: "lax",
    });
    const headers = new Headers(result.headers);
    headers.set("cache-control", "no-store");
    return new Response(result.body, { status: result.status, headers });
  }

  const database = process.env["DATABASE_URL"];
  if (!database) return fail("unconfigured", 503);
  const sql = neon(database);
  const path = url.pathname.slice("/api/linsy/".length);
  const fields =
    "id,business_id,status,name,description,category,commune,modality,whatsapp,services,photos,review_reason";
  async function identity() {
    if (!baseUrl || !cookieSecret || !request.headers.has("cookie")) return null;
    const headers = new Headers({ origin: url.origin, cookie: request.headers.get("cookie")! });
    const session = await handleAuthRequest(
      baseUrl,
      new Request(new URL("/api/auth/get-session?disableCookieCache=true", url), { headers }),
      "get-session",
    );
    if (!session.ok) return null;
    const { user } = parseSessionData(await session.json());
    return user?.emailVerified ? user.id : null;
  }
  try {
    if (method === "GET" && path === "directory") {
      const q = normalizeText((url.searchParams.get("q") ?? "").slice(0, 80))
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
      const category = url.searchParams.get("category") ?? "";
      const commune = url.searchParams.get("commune") ?? "";
      const page = z.coerce
        .number()
        .int()
        .min(1)
        .max(10000)
        .catch(1)
        .parse(url.searchParams.get("page"));
      const [result] = await sql`with matches as (
        select business_id,name,description,category,commune,modality,photos[1] as cover_photo from linsy.business_revisions
        where status='approved' and (${category}='' or category=${category}) and (${commune}='' or commune=${commune})
          and not exists (select 1 from unnest(string_to_array(${q}, ' ')) term where strpos(search_text,term)=0)
      ), page as (
        select * from matches order by name,business_id limit 12 offset ${(page - 1) * 12}
      ) select (select count(*)::int from matches) as count,
        coalesce((select jsonb_agg(page order by name,business_id) from page),'[]'::jsonb) as rows`;
      return response(result);
    }
    if (method === "GET" && path.startsWith("profile/")) {
      const id = idSchema.parse(path.slice(8));
      const [profile] = await sql.query(
        `select ${fields} from linsy.business_revisions where business_id=$1 and status='approved'`,
        [id],
      );
      return response(profile ?? null);
    }
    if (method === "GET" && path.startsWith("photos/")) {
      const id = idSchema.parse(path.slice(7));
      const actor = await identity();
      const [photo] =
        await sql`select p.mime, encode(p.bytes,'base64') as data from linsy.business_photos p
        where p.id=${id} and (p.owner_id=${actor} or exists (
          select 1 from linsy.business_revisions r where r.photos @> array[p.id::text]
            and (r.status='approved' or (r.status='pending' and exists (
              select 1 from linsy.user_roles where user_id=${actor} and role='admin'
            )))
        ))`;
      if (!photo) return fail("not_found", 404);
      const bytes = Uint8Array.from(atob(photo["data"] as string), (char) => char.charCodeAt(0));
      return new Response(bytes, {
        headers: {
          "content-type": photo["mime"] as string,
          "cache-control": "private, no-store",
          "x-content-type-options": "nosniff",
        },
      });
    }

    const actor = await identity();
    if (!actor) return fail("email_verification_required", 403);
    if (path === "management" || path.startsWith("management/"))
      return await management(sql, actor, path, request, response);
    if (method === "GET" && path === "workspace") {
      const [role] = await sql`select role from linsy.user_roles where user_id=${actor}`;
      const [business] = await sql`select id from linsy.businesses where owner_id=${actor}`;
      const rows = business
        ? await sql.query(
            `select ${fields} from linsy.business_revisions where business_id=$1 and status<>'archived'`,
            [business["id"]],
          )
        : [];
      return response({
        role: role?.["role"] ?? "professional",
        id: business?.["id"],
        approved: rows.find((row) => row["status"] === "approved"),
        working: rows.find((row) => row["status"] !== "approved"),
      });
    }
    if (method === "GET" && path === "moderation") {
      const [admin] =
        await sql`select 1 from linsy.user_roles where user_id=${actor} and role='admin'`;
      if (!admin) return response(null);
      const [queue, reports] = await sql.transaction([
        sql.query(
          `select ${fields} from linsy.business_revisions where status='pending' order by name`,
        ),
        sql`select id,business_id,reason,created_at from linsy.reports order by created_at desc`,
      ]);
      return response({ queue, reports });
    }
    if (method === "POST" && path === "draft") {
      const data = draftSchema.parse(await request.json());
      await sql`select linsy.save_revision(${actor}, ${data.expected}, ${JSON.stringify(data)}::jsonb)`;
      return response(true);
    }
    if (method === "POST" && path === "review") {
      const { revision, approve, reason } = z
        .object({
          revision: idSchema,
          approve: z.boolean(),
          reason: z.string().trim().max(500),
        })
        .refine((data) => data.approve || data.reason.length > 0)
        .parse(await request.json());
      await sql`select linsy.review_revision(${actor},${revision},${approve},${reason})`;
      return response(true);
    }
    if (method === "POST" && path === "report") {
      const { business, reason } = z
        .object({ business: idSchema, reason: z.string().trim().min(10).max(500) })
        .parse(await request.json());
      const [report] = await sql`insert into linsy.reports (business_id,reporter_id,reason)
        select business_id,${actor},${reason} from linsy.business_revisions where business_id=${business} and status='approved'
        on conflict (business_id,reporter_id) do nothing returning id`;
      return report ? response(true) : fail("already_reported_or_unavailable", 409);
    }
    if (method === "POST" && path === "photos") {
      const mime = request.headers.get("content-type");
      if (Number(request.headers.get("content-length")) > maxPhoto)
        return fail("photo_too_large", 413);
      const data = new Uint8Array(await request.arrayBuffer());
      if (data.length > maxPhoto) return fail("photo_too_large", 413);
      const starts = (...signature: number[]) =>
        signature.every((value, index) => data[index] === value);
      const valid =
        (mime === "image/jpeg" && starts(255, 216, 255)) ||
        (mime === "image/png" && starts(137, 80, 78, 71, 13, 10, 26, 10)) ||
        (mime === "image/webp" &&
          starts(82, 73, 70, 70) &&
          String.fromCharCode(...data.slice(8, 12)) === "WEBP");
      if (!valid) return fail("invalid_photo", 400);
      const bytes = Buffer.from(data).toString("base64");
      const [, rows] = await sql.transaction([
        sql`select pg_advisory_xact_lock(hashtextextended(${actor},77255))`,
        sql`insert into linsy.business_photos (owner_id,mime,bytes)
          select ${actor},${mime},decode(${bytes},'base64')
          where (select count(*) from linsy.business_photos where owner_id=${actor}) < 60 returning id`,
      ]);
      return rows?.[0] ? response(rows[0]["id"]) : fail("photo_quota", 409);
    }
    if (method === "POST" && path === "photos/discard") {
      const ids = z
        .array(idSchema)
        .max(6)
        .parse(await request.json());
      await sql.transaction([
        sql`select pg_advisory_xact_lock(hashtextextended(${actor},77255))`,
        sql`delete from linsy.business_photos p where p.owner_id=${actor} and p.id=any(${ids}::uuid[])
          and not exists (select 1 from linsy.business_revisions r where r.photos @> array[p.id::text])`,
      ]);
      return response(true);
    }
    return fail("not_found", 404);
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError)
      return fail("invalid_data", 400);
    if (error instanceof Error) {
      if (error.message === "launch_quota_full" || error.message === "launch_already_assigned")
        return fail(error.message, 409);
      if (error.message === "invalid_payment_dates") return fail("invalid_payment_dates", 400);
      if (error.message === "subscription_unavailable")
        return fail("subscription_unavailable", 409);
      if (error.message === "forbidden") return fail("forbidden", 403);
      if (error.message === "revision_conflict") return fail("revision_conflict", 409);
      if (error.message === "invalid_photo") return fail("invalid_photo", 400);
    }
    console.error("Linsy API:", path.split("/")[0], (error as { code?: string })?.code ?? "error");
    return fail("backend_error", 500);
  }
}
