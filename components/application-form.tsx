"use client";

import { type FormEvent, useState } from "react";

const fields = [
  { name: "fullName", label: "Nombre y apellido", type: "text", autoComplete: "name" },
  { name: "location", label: "País / ciudad", type: "text" },
  { name: "linkedinUrl", label: "LinkedIn", type: "url", placeholder: "https://www.linkedin.com/in/…" },
  { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email" },
  { name: "whatsapp", label: "Número de WhatsApp", type: "tel", autoComplete: "tel", placeholder: "Código de país + número" },
];

export default function ApplicationForm({ onSaved }: { onSaved: (candidateId: string) => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: { error?: string; candidate?: { id: string } } = await response.json();
      if (!response.ok || !data.candidate?.id) {
        throw new Error(data.error ?? "No pudimos guardar tu registro.");
      }
      onSaved(data.candidate.id);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "No pudimos guardar tu registro.");
      setSaving(false);
    }
  }

  return (
    <form className="join-form" onSubmit={submit} aria-labelledby="application-title">
      <h3 id="application-title" data-step-heading tabIndex={-1}>Tus datos de contacto</h3>
      <p className="form-intro">
        Al confirmar, guardamos tus datos para revisar la postulación y contactarte.{" "}
        <a className="terms-link" href="/terminos" target="_blank" rel="noopener">Términos y condiciones</a>
      </p>
      <div className="form-grid">
        {fields.map(({ name, label, type, autoComplete, placeholder }) => {
          const required = name !== "linkedinUrl";
          return (
            <label className={name === "whatsapp" ? "full-width" : undefined} key={name}>
              <span>{label} {required ? <span aria-hidden="true">*</span> : "(opcional)"}</span>
              <input required={required} name={name} type={type} autoComplete={autoComplete} placeholder={placeholder} />
            </label>
          );
        })}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <span>* Campos requeridos</span>
        <button className="button button-mustard" type="submit" disabled={saving}>
          {saving ? "Guardando…" : "Confirmar y continuar"}
        </button>
      </div>
    </form>
  );
}
