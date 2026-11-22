"use client";

import { useActionState, useState } from "react";
import { logIn } from "@/app/admin/actions";

export default function LoginForm() {
  const [activate, setActivate] = useState(false);
  const [email, setEmail] = useState("");
  const [result, action, pending] = useActionState(logIn, {});

  return (
    <div className="raised-card admin-login">
      <p className="eyebrow">Acceso privado</p>
      <h1>{activate ? "Activá tu cuenta" : "Panel de postulaciones"}</h1>
      <form className="admin-login-form" action={action}>
        <label>
          Correo electrónico
          <input
            name="email" type="email" autoComplete="username" value={email}
            onChange={(event) => setEmail(event.target.value)} maxLength={254} required
          />
        </label>
        {activate && (
          <label>
            Código de activación
            <input name="activationCode" autoComplete="one-time-code" autoCapitalize="off" spellCheck={false} maxLength={48} required />
          </label>
        )}
        <label>
          {activate ? "Elegí tu contraseña" : "Contraseña"}
          <input
            name="password" type="password" autoComplete={activate ? "new-password" : "current-password"}
            minLength={activate ? 12 : undefined} maxLength={128} required
          />
        </label>
        {activate && <p className="admin-muted">Usá al menos 12 caracteres. El código se utiliza una sola vez.</p>}
        {result.error && <p className="admin-error" role="alert">{result.error}</p>}
        <button className="button button-mustard" type="submit" disabled={pending}>
          {pending ? "Comprobando…" : activate ? "Activar e ingresar" : "Iniciar sesión"}
        </button>
      </form>
      <button type="button" className="admin-text-button" disabled={pending} onClick={() => setActivate(!activate)}>
        {activate ? "Ya tengo contraseña" : "Tengo un código de activación"}
      </button>
    </div>
  );
}
