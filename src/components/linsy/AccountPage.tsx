import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, ArrowRight, Heart, Store } from "lucide-react";
import { useState, type FormEvent } from "react";
import { backend, useLinsySession } from "@/lib/linsy-backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectionNotice } from "./ConnectionNotice";

export function AccountPage({ mode }: { mode: "login" | "register" | "recover" }) {
  const [visible, setVisible] = useState(false);
  const [kind, setKind] = useState("cliente");
  const register = mode === "register";
  const recover = mode === "recover";
  const { session, recovering } = useLinsySession();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const reset = recover && recovering;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!backend || busy) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      if (reset) {
        const { error } = await backend.auth.updateUser({ password });
        if (error) throw error;
        window.location.assign("/mi-negocio");
      } else if (recover) {
        const { error } = await backend.auth.resetPasswordForEmail(email, {
          redirectTo: new URL("/recuperar-contrasena", window.location.origin).href,
        });
        if (error) throw error;
        setMessage("Si el correo está registrado, recibirás un enlace para recuperar el acceso.");
      } else if (register) {
        const { data, error } = await backend.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: String(form.get("nombre") ?? ""), account_type: kind },
            emailRedirectTo: new URL("/ingresar", window.location.origin).href,
          },
        });
        if (error) throw error;
        if (data.session)
          window.location.assign(kind === "profesional" ? "/mi-negocio" : "/explorar");
        else setMessage("Revisa tu correo para confirmar la cuenta.");
      } else {
        const { error } = await backend.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.assign("/mi-negocio");
      }
    } catch {
      setFailed(true);
      setMessage(
        register || recover
          ? "No pudimos completar la solicitud. Revisa los datos e inténtalo de nuevo."
          : "No pudimos iniciar sesión. Revisa tu correo, contraseña y confirmación de cuenta.",
      );
    } finally {
      setBusy(false);
    }
  }

  const title = register
    ? "Crea tu cuenta"
    : recover
      ? "Recupera tu acceso"
      : "Qué bueno verte de nuevo";
  return (
    <div className="container-linsy grid gap-12 py-12 lg:grid-cols-[1fr_1fr] lg:py-20">
      <section className="max-w-lg">
        <p className="mb-3 text-sm font-semibold text-primary">Tu espacio en Linsy</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-4 text-muted-foreground">
          {recover
            ? "Vuelve a encontrarte con tus favoritos y tu negocio."
            : "Belleza, cuidado y talento local. Todo en un mismo lugar."}
        </p>
        <div className="mt-10 space-y-6">
          <div className="flex gap-4">
            <Heart className="h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-sans text-base font-semibold">Tus favoritos, a mano</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Un lugar para los profesionales que te encantan.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Store className="h-6 w-6 shrink-0 text-menta-ink" />
            <div>
              <h2 className="font-sans text-base font-semibold">Una vitrina para tu talento</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tu trabajo, tus servicios y tu identidad.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full max-w-lg space-y-6 lg:justify-self-end" aria-label={title}>
        {!backend && <ConnectionNotice account />}
        {session && !reset && !recover ? (
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/mi-negocio">Mi cuenta</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/explorar">Explorar</Link>
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const result = await backend?.auth.signOut();
                if (result?.error) {
                  setFailed(true);
                  setMessage("No pudimos cerrar tu sesión.");
                }
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={submit}>
            {register && (
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">Quiero participar como</legend>
                <div className="grid grid-cols-2 gap-3">
                  {["cliente", "profesional"].map((value) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${kind === value ? "border-primary bg-rosa text-rosa-ink" : "border-input"}`}
                    >
                      <input
                        type="radio"
                        name="tipo"
                        value={value}
                        checked={kind === value}
                        onChange={() => setKind(value)}
                        className="accent-primary"
                      />
                      {value === "cliente" ? "Cliente" : "Profesional"}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            {register && (
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm font-semibold">
                  Tu nombre
                </label>
                <Input
                  id="nombre"
                  name="nombre"
                  required={!!backend}
                  maxLength={100}
                  autoComplete={backend ? "name" : "off"}
                  placeholder="Nombre y apellido"
                />
              </div>
            )}
            {!reset && (
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required={!!backend}
                  autoComplete={backend ? "email" : "off"}
                  placeholder="tu@correo.cl"
                />
              </div>
            )}
            {(!recover || reset) && (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold">
                  {reset ? "Nueva contraseña" : backend ? "Contraseña" : "Contraseña de prueba"}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    required={!!backend}
                    minLength={register || reset ? 8 : undefined}
                    type={visible ? "text" : "password"}
                    autoComplete={
                      backend ? (register || reset ? "new-password" : "current-password") : "off"
                    }
                    className="pr-12"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-9"
                    aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
            )}
            {!register && !recover && (
              <Link
                to="/recuperar-contrasena"
                className="block text-sm font-medium text-primary hover:underline"
              >
                Olvidé mi contraseña
              </Link>
            )}
            {register && (
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input type="checkbox" required={!!backend} className="mt-1 accent-primary" />
                <span>
                  Acepto los{" "}
                  <Link to="/terminos" className="text-primary underline">
                    términos
                  </Link>{" "}
                  y la{" "}
                  <Link to="/privacidad" className="text-primary underline">
                    política de privacidad
                  </Link>
                  .
                </span>
              </label>
            )}
            <Button
              disabled={!backend || busy || session === undefined}
              className="w-full"
              size="lg"
            >
              {recover ? <Mail /> : <ArrowRight />}
              {busy
                ? "Procesando…"
                : reset
                  ? "Guardar contraseña"
                  : register
                    ? "Crear cuenta"
                    : recover
                      ? "Enviar enlace"
                      : "Iniciar sesión"}
            </Button>
          </form>
        )}
        {message && <p role={failed ? "alert" : "status"}>{message}</p>}
        <p className="text-center text-sm text-muted-foreground">
          {register || recover ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <Link to="/ingresar" className="font-semibold text-primary">
                Inicia sesión
              </Link>
            </>
          ) : (
            <>
              ¿Primera vez aquí?{" "}
              <Link to="/registrarse" className="font-semibold text-primary">
                Crea tu cuenta
              </Link>
            </>
          )}
        </p>
      </section>
    </div>
  );
}
