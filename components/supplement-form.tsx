"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  ["role", "Rol actual"],
  ["communityExperience", "¿Cuánto tiempo llevás trabajando en Community?"],
  ["communityType", "¿Qué tipo de comunidad gestionás actualmente?"],
  ["communityAge", "¿Hace cuánto existe esa comunidad?"],
  ["participantCount", "¿Cuántas personas participan aproximadamente?"],
  ["workMode", "¿Trabajás de manera independiente o dentro de una organización?"],
  ["previousExperience", "¿Qué experiencia previa tenés trabajando en construcción o gestión de comunidades?", true],
  ["mainChallenge", "¿Cuál es hoy tu principal desafío como Community Builder?", true],
  ["motivation", "¿Qué te motivó a sumarte a Community Builders LATAM?", true],
  ["contribution", "¿Qué experiencia, conocimiento o aprendizaje te gustaría aportar y compartir con otros Community Builders?", true],
  ["expectations", "¿Qué te gustaría encontrar, aprender o llevarte de este espacio?", true],
  ["topics", "¿Qué temas te gustaría conversar con otros Community Builders?", true],
] as const;

export default function SupplementForm({
  candidateId,
  onComplete,
}: {
  candidateId: string;
  onComplete?: () => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function finish() {
    if (onComplete) onComplete();
    else router.push("/gracias");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const payload = { ...Object.fromEntries(fields), imageConsent: fields.has("imageConsent") };
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/candidates/${encodeURIComponent(candidateId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: { error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No pudimos guardar tus respuestas.");
      finish();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "No pudimos guardar tus respuestas.");
      setSaving(false);
    }
  }

  return (
    <form className="join-form" onSubmit={submit} aria-labelledby="supplement-title">
      <h3 id="supplement-title" data-step-heading tabIndex={-1}>Contanos sobre tu recorrido</h3>
      <p className="form-intro">Tus datos de contacto ya están guardados. Podés responder las preguntas que quieras o finalizar ahora.</p>
      <div className="form-grid">
        {questions.map(([name, question, multiline]) => (
          <label key={name}>
            <span>{question}</span>
            {multiline ? <textarea name={name} rows={3} /> : <input name={name} />}
          </label>
        ))}
      </div>
      <div className="consent-box">
        <label className="consent-label">
          <input type="checkbox" name="imageConsent" />
          <span>Al completar este formulario y participar de las actividades de la comunidad, acepto el uso de mi imagen con estos fines.</span>
        </label>
        <a className="terms-link" href="/terminos#uso-de-imagen" target="_blank" rel="noopener">
          Términos y condiciones
        </a>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="skip-button" onClick={finish} disabled={saving}>Finalizar sin responder</button>
        <button className="button button-mustard" type="submit" disabled={saving}>
          {saving ? "Guardando…" : "Guardar y finalizar"}
        </button>
      </div>
    </form>
  );
}
