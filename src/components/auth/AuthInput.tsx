"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";

// JOS-61: foco/error reales por estado local — el spec del Design System
// (2px de borde + anillo en foco) no coincide con getInputClassName
// (ClientFormFields.tsx), que no crece el borde en foco. Login es una
// pantalla fundacional: no debe depender de components/clientes/.
export function AuthInput({
  error,
  rightElement,
  className,
  onFocus,
  onBlur,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  rightElement?: ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? "#B91C1C" : focused ? "#16A34A" : "#E5E7EB";
  const borderWidth = focused || error ? "1.5px" : "1px";

  return (
    <div className="relative">
      <input
        {...props}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          border: `${borderWidth} solid ${borderColor}`,
          boxShadow: focused ? "0 0 0 3px #BBF7D0" : "none",
        }}
        className={`w-full rounded-lg bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-[border-color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:bg-bg-app disabled:text-text-tertiary disabled:opacity-65 ${rightElement ? "pr-10" : ""} ${className ?? ""}`}
      />
      {rightElement}
    </div>
  );
}
