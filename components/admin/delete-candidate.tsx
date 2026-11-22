"use client";

import { useActionState, useRef } from "react";
import { removeCandidate } from "@/app/admin/actions";

export default function DeleteCandidate({ id, name, returnToList = false }: {
  id: string;
  name: string;
  returnToList?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [result, action, pending] = useActionState(removeCandidate, {});

  return (
    <>
      <button
        className="admin-text-button admin-danger"
        type="button"
        aria-label={`Eliminar la postulación de ${name}`}
        onClick={() => dialog.current?.showModal()}
      >Eliminar</button>
      <dialog
        ref={dialog}
        className="raised-card admin-dialog"
        aria-labelledby={`delete-${id}`}
        onCancel={(event) => { if (pending) event.preventDefault(); }}
      >
        <h2 id={`delete-${id}`}>Eliminar postulación</h2>
        <p>Se eliminará definitivamente la postulación de <strong>{name}</strong> y todas sus respuestas.</p>
        <form action={action}>
          <input type="hidden" name="candidateId" value={id} />
          <input type="hidden" name="confirm" value="yes" />
          {returnToList && <input type="hidden" name="returnToList" value="yes" />}
          {result.error && <p className="admin-error" role="alert">{result.error}</p>}
          <div className="admin-inline-actions">
            <button className="admin-text-button" type="button" disabled={pending} onClick={() => dialog.current?.close()} autoFocus>Cancelar</button>
            <button className="admin-small-button admin-confirm-delete" type="submit" disabled={pending}>
              {pending ? "Eliminando…" : "Eliminar definitivamente"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
