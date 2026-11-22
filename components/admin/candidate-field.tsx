"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { editField } from "@/app/admin/actions";
import { adminFields, candidateStatuses, type AdminField, type CandidateStatus, type CandidateValue } from "@/lib/admin-fields";
import CandidateStatusChip from "./candidate-status";

export default function CandidateField({ candidateId, field, value }: {
  candidateId: string;
  field: AdminField;
  value: CandidateValue;
}) {
  const { label, kind, maxLength = 8000, required } = adminFields[field];
  const inputId = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [result, action, pending] = useActionState(editField, {});

  useEffect(() => {
    if (result.ok) setEditing(false);
  }, [result]);

  function startEditing() {
    setDraft(String(value ?? (kind === "consent" ? false : "")));
    setEditing(true);
  }

  function displayValue() {
    if (kind === "consent") return value === true ? "Sí" : "No";
    return value || "Sin respuesta";
  }

  return (
    <div className="admin-field">
      <div className="admin-field-label">
        <label htmlFor={editing ? inputId : undefined}>{label}</label>
        {!editing && (
          <button
            className="admin-edit-button" type="button" onClick={startEditing}
            aria-label={`Editar ${label}`} title={`Editar ${label}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="m16 4 4 4M4 20l5-1L20 8a2.8 2.8 0 0 0-4-4L5 15z" />
            </svg>
          </button>
        )}
      </div>
      {editing ? (
        <form className="admin-inline-form" action={action}>
          <input type="hidden" name="candidateId" value={candidateId} />
          <input type="hidden" name="field" value={field} />
          {kind === "textarea" ? (
            <textarea id={inputId} name="value" rows={4} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={maxLength} autoFocus />
          ) : kind === "consent" || kind === "status" ? (
            <select id={inputId} name="value" value={draft} onChange={(event) => setDraft(event.target.value)} autoFocus>
              {kind === "consent" ? (
                <><option value="false">No</option><option value="true">Sí</option></>
              ) : Object.entries(candidateStatuses).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
            </select>
          ) : (
            <input
              id={inputId} name="value" type={kind} value={draft} onChange={(event) => setDraft(event.target.value)}
              maxLength={maxLength} required={required} autoFocus
            />
          )}
          {result.error && <p className="admin-error" role="alert">{result.error}</p>}
          <div className="admin-inline-actions">
            <button className="admin-small-button" type="submit" disabled={pending}>{pending ? "Guardando…" : "Guardar"}</button>
            <button className="admin-text-button" type="button" disabled={pending} onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </form>
      ) : kind === "status" ? (
        <CandidateStatusChip status={value as CandidateStatus} />
      ) : <p className="admin-field-value">{displayValue()}</p>}
    </div>
  );
}
