"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction } from "./actions";
import { AuthInput } from "./AuthInput";
import { ForgotPasswordSheet } from "./ForgotPasswordSheet";

const MENSAJE_ERROR = "Correo o contraseña incorrectos. Inténtalo de nuevo.";

// JOS-61 (P8): copy y layout verbatim de sLogin() (diseño de referencia).
// Envía llamando directamente a loginAction — el token de sesión nunca sale
// del servidor (fija la cookie httpOnly ahí mismo, ver src/components/auth/actions.ts).
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [forgotOpen, setForgotOpen] = useState(false);

  const canSubmit =
    email.trim().length > 0 && password.length > 0 && status !== "loading";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    const result = await loginAction(email, password);
    if (!result.ok) {
      setStatus("error");
      return;
    }
    router.push("/inicio");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-app px-5 py-6">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600">
          <svg width="30" height="30" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect x="12" y="12" width="10" height="10" rx="2.5" fill="white" />
            <rect x="26" y="12" width="10" height="10" rx="2.5" fill="white" fillOpacity="0.7" />
            <rect x="12" y="26" width="10" height="10" rx="2.5" fill="white" fillOpacity="0.7" />
            <rect x="26" y="26" width="10" height="10" rx="2.5" fill="white" fillOpacity="0.4" />
          </svg>
        </div>
        <span className="block text-[22px] font-bold tracking-tight text-text-primary">
          Vibe CRM
        </span>
        <span className="mt-1 block text-[13px] text-text-tertiary">
          Tu negocio, siempre organizado
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[350px] rounded-xl border border-border bg-surface p-7 shadow-lg"
      >
        <div className="mb-4">
          <label className="mb-1.5 block text-[13px] font-medium text-text-secondary">
            Correo electrónico
          </label>
          <AuthInput
            type="email"
            placeholder="tu@correo.com"
            value={email}
            disabled={status === "loading"}
            error={status === "error"}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus("idle");
            }}
          />
        </div>

        <div className="mb-2">
          <label className="mb-1.5 block text-[13px] font-medium text-text-secondary">
            Contraseña
          </label>
          <AuthInput
            type={showPassword ? "text" : "password"}
            placeholder="Tu contraseña"
            value={password}
            disabled={status === "loading"}
            error={status === "error"}
            onChange={(e) => {
              setPassword(e.target.value);
              setStatus("idle");
            }}
            rightElement={
              <button
                type="button"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 text-text-tertiary"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={1.5} />
                )}
              </button>
            }
          />
        </div>

        <div className="mb-5 text-right">
          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="text-xs font-medium text-primary-600"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {status === "error" ? (
          <div
            className="mb-4 flex items-start gap-2 rounded-lg px-3 py-2.5"
            style={{
              background: "var(--color-risk-bg)",
              border: "1px solid var(--color-risk-border)",
            }}
          >
            <AlertCircle
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              style={{ color: "var(--color-error-text)" }}
              strokeWidth={1.5}
            />
            <span
              className="text-xs leading-relaxed"
              style={{ color: "var(--color-error-text)" }}
            >
              {MENSAJE_ERROR}
            </span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] text-sm font-semibold text-white disabled:cursor-not-allowed"
          style={{ background: canSubmit ? "#16A34A" : "#D1D5DB" }}
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <ForgotPasswordSheet
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </div>
  );
}
