"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * P8 · Login / Acceso — JOS-61.
 * Diseño de referencia: design/uploads/CRM Login para negocios digitales/Login · Acceso.dc.html
 * TODO: layout split-screen de escritorio con el panel de features, y la
 * animación de "sacudida" en error — de momento solo la lógica funcional.
 */
export default function LoginPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn("password", { email, password, flow: "signIn" });
      router.push("/inicio");
    } catch {
      setError("El correo electrónico o la contraseña no son correctos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[400px] flex-col gap-4 rounded-xl border border-border bg-surface p-8 shadow-modal"
      >
        <div>
          <h1 className="text-heading-md">Vibe CRM</h1>
          <p className="text-body-sm text-ink-secondary">Introduce tus datos para acceder</p>
        </div>

        <Input
          id="login-email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <Input
          id="login-password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        {error && <p className="text-caption text-error-text">{error}</p>}

        <Button type="submit" size="lg" disabled={loading || !email || !password} className="mt-2">
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
