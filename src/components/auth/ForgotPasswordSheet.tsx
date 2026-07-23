"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { solicitarResetAction } from "./actions";
import { AuthInput } from "./AuthInput";

// JOS-61: mismo esqueleto <dialog>/showModal/backdrop/dialog-card-anim que
// RecordatorioSheet.tsx. Copy verbatim de sheetForgotPw() (diseño de
// referencia). solicitarResetAction es un no-op real server-side (decisión
// del usuario, 2026-07-23) — éxito y error transicionan igual a "enviado",
// para no filtrar si el email existe o no.
export function ForgotPasswordSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setEmail("");
      setEnviando(false);
      setEnviado(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function requestClose() {
    if (enviando) return;
    onClose();
  }

  async function handleSubmit() {
    if (!email.trim() || enviando) return;
    setEnviando(true);
    await solicitarResetAction(email.trim());
    setEnviando(false);
    setEnviado(true);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Recuperar contraseña"
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      className="m-0 hidden h-screen max-h-none w-screen max-w-none items-end justify-center bg-transparent p-0 open:flex backdrop:bg-black/50 md:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="dialog-card-anim w-full rounded-t-xl border border-border bg-surface pb-8 shadow-lg md:w-[420px] md:rounded-lg"
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="text-[17px] font-bold text-text-primary">
            Recuperar contraseña
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            disabled={enviando}
            onClick={requestClose}
            className="flex h-8 w-8 items-center justify-center text-text-tertiary disabled:opacity-40"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        {!enviado ? (
          <div className="px-5">
            <p className="mb-4 text-sm leading-relaxed text-text-tertiary">
              Introduce tu correo y te enviaremos un enlace para restablecer tu
              contraseña.
            </p>
            <label className="mb-1.5 block text-[13px] font-medium text-text-secondary">
              Correo electrónico
            </label>
            <AuthInput
              type="email"
              placeholder="tu@correo.com"
              value={email}
              disabled={enviando}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              disabled={!email.trim() || enviando}
              onClick={handleSubmit}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-[10px] text-sm font-semibold text-white disabled:cursor-not-allowed"
              style={{ background: email.trim() ? "#16A34A" : "#D1D5DB" }}
            >
              {enviando ? "Enviando…" : "Enviar enlace"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center px-5 pb-2 pt-2 text-center">
            <div className="mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary-50">
              <CheckCircle2
                className="h-[26px] w-[26px] text-primary-600"
                strokeWidth={1.5}
              />
            </div>
            <span className="mb-2 block text-base font-bold text-text-primary">
              Correo enviado
            </span>
            <span className="mb-5 block text-sm leading-relaxed text-text-tertiary">
              Revisa tu bandeja de entrada y sigue las instrucciones para
              restablecer tu contraseña.
            </span>
            <button
              type="button"
              onClick={requestClose}
              className="h-11 w-full rounded-[10px] bg-primary-600 text-sm font-semibold text-white"
            >
              Volver al inicio de sesión
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
