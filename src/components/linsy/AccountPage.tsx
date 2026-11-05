import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, ArrowRight, Heart, Store } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { backend, linsyAuth, useLinsySession } from "@/lib/linsy-backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectionNotice } from "./ConnectionNotice";

export function AccountPage({ mode }: { mode: "login" | "register" | "recover" }) {
  const [visible, setVisible] = useState(false);
  const [kind, setKind] = useState("cliente");
  const register = mode === "register";
  const recover = mode === "recover";
  const { session } = useLinsySession();
  const [resetToken, setResetToken] = useState("");
  useEffect(
    () => setResetToken(new URLSearchParams(window.location.search).get("token") ?? ""),
    [],
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const reset = recover && !!resetToken;
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const needsVerification =
    !recover && (verificationEmail !== null || (session && !session.user.emailVerified));

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("verification-email") ?? "").trim();
    const otp = String(form.get("otp") ?? "").trim();
    const resend = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "resend";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFailed(true);
      setMessage("Ingresa el correo que usaste para registrarte.");
      return;
    }
    setBusy(true);
    setFailed(false);
    setMessage("");
    try {
      const path = resend ? "send-verification-otp" : "verify-email";
      const result = await fetch(`/api/auth/email-otp/${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(resend ? { email, type: "email-verification" } : { email, otp }),
      });
      if (!result.ok) {
        setFailed(true);
        setMessage(
          resend
            ? "No pudimos enviar otro código. Inténtalo en unos minutos."
            : "El código no se pudo verificar. Revisa que sea el más reciente o solicita otro.",
        );
      } else if (resend) {
        setMessage("Revisa tu correo e ingresa el código más reciente.");
      } else {
        window.location.assign("/ingresar");
      }
    } catch {
      setFailed(true);
      setMessage("No pudimos conectar con Linsy. Inténtalo nuevamente.");
    } finally {
      setBusy(false);
    }
  }

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
        const { error } = await linsyAuth.resetPassword({
          newPassword: password,
          token: resetToken,
        });
        if (error) throw error;
        window.location.assign("/ingresar");
      } else if (recover) {
        const { error } = await linsyAuth.requestPasswordReset({
          email,
          redirectTo: new URL("/recuperar-contrasena", window.location.origin).href,
        });
        if (error) throw error;
        setMessage("Si el correo está registrado, recibirás un enlace para recuperar el acceso.");
      } else if (register) {
        const callbackURL = new URL("/ingresar", window.location.origin).href;
        const { data, error } = await linsyAuth.signUp.email({
          email,
          password,
          name: String(form.get("nombre") ?? ""),
          callbackURL,
        });
        if (error) throw error;
        if (data?.user.emailVerified)
          window.location.assign(kind === "profesional" ? "/mi-negocio" : "/explorar");
        else setVerificationEmail(email);
      } else {
        const { error } = await linsyAuth.signIn.email({ email, password });
        if (error?.code === "EMAIL_NOT_VERIFIED") {
          setVerificationEmail(email);
          return;
        }
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

  async function signInWithGoogle() {
    if (!backend || busy) return;
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      const callbackURL = new URL(
        register && kind === "cliente" ? "/explorar" : "/mi-negocio",
        window.location.origin,
      ).href;
      const { error } = await linsyAuth.signIn.social({ provider: "google", callbackURL });
      if (error) throw error;
    } catch {
      setFailed(true);
      setMessage("No pudimos continuar con Google. Inténtalo nuevamente.");
      setBusy(false);
    }
  }

  const title = register
    ? "Crea tu cuenta"
    : recover
      ? "Recupera tu acceso"
      : "Qué bueno verte de nuevo";
  return (
    <div className="container-linsy grid items-start gap-6 py-8 lg:grid-cols-2 lg:gap-12 lg:py-16">
      <section className="editorial-account-intro rounded-[2rem] px-6 py-8 sm:px-9 sm:py-11">
        <p className="mb-3 text-sm font-semibold text-primary">Tu espacio en Linsy</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-4 text-muted-foreground">
          {recover
            ? "Vuelve a encontrarte con tus favoritos y tu negocio."
            : "Belleza, cuidado y talento local. Todo en un mismo lugar."}
        </p>
        <div className="mt-9 hidden space-y-6 lg:block">
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
      <section
        className="w-full space-y-6 rounded-[2rem] border bg-card p-5 shadow-soft sm:p-8"
        aria-label={title}
      >
        {!backend && <ConnectionNotice account />}
        {backend && !recover && !register && !needsVerification && !session && (
          <Button
            variant="outline"
            onClick={() => {
              setVerificationEmail("");
              setMessage("");
            }}
          >
            Tengo un código de verificación
          </Button>
        )}
        {needsVerification ? (
          <form onSubmit={verify} className="space-y-4">
            <h2 className="text-xl font-semibold">Verifica tu correo</h2>
            <p>Ingresa el código de seis dígitos que te envió Linsy.</p>
            <label className="block space-y-1">
              <span>Correo electrónico</span>
              <Input
                type="email"
                name="verification-email"
                defaultValue={verificationEmail ?? session?.user.email ?? ""}
                autoComplete="email"
                required
              />
            </label>
            <label className="block space-y-1">
              <span>Código de verificación</span>
              <Input
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy}>
                Verificar correo
              </Button>
              <Button type="submit" value="resend" formNoValidate variant="outline" disabled={busy}>
                Reenviar código
              </Button>
              {!session && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setVerificationEmail(null);
                    setMessage("");
                  }}
                >
                  Volver
                </Button>
              )}
            </div>
          </form>
        ) : session && !reset && !recover ? (
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
                const result = await linsyAuth.signOut();
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
            {!recover && !reset && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="lg"
                  disabled={!backend || busy || session === undefined}
                  onClick={signInWithGoogle}
                >
                  <span aria-hidden className="font-bold text-base text-[#4285f4]">
                    G
                  </span>
                  Continuar con Google
                </Button>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  o con tu correo
                  <span className="h-px flex-1 bg-border" />
                </div>
              </>
            )}
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
        {(register || recover) && (
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to="/ingresar" className="font-semibold text-primary">
              Inicia sesión
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
