import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { candidateIdIsValid, getAdminCandidate } from "@/lib/admin-candidates";
import { contactFields, supplementFields } from "@/lib/admin-fields";
import AdminHeader from "@/components/admin/admin-header";
import CandidateField from "@/components/admin/candidate-field";
import DeleteCandidate from "@/components/admin/delete-candidate";

const dateFormat = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeZone: "America/Argentina/Salta" });

export default async function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  if (!candidateIdIsValid(id)) notFound();
  const candidate = await getAdminCandidate(id);
  if (!candidate) notFound();

  return (
    <>
      <AdminHeader email={admin.email} />
      <div className="container admin-content">
        <Link className="admin-link" href="/admin" prefetch={false}>Volver a postulaciones</Link>
        <div className="admin-title admin-detail-title">
          <p className="eyebrow">Ficha de postulación</p>
          <h1>{candidate.full_name}</h1>
          <p className="admin-muted">
            Recibida el <time dateTime={candidate.created_at}>{dateFormat.format(new Date(candidate.created_at))}</time>
          </p>
        </div>

        <section className="raised-card admin-detail-card" aria-labelledby="candidate-contact">
          <h2 id="candidate-contact">Datos de contacto</h2>
          <div className="admin-fields">
            {([...contactFields, "linkedin_url", "status"] as const).map((field) => (
              <CandidateField key={field} candidateId={id} field={field} value={candidate[field]} />
            ))}
          </div>
        </section>
        <section className="raised-card admin-detail-card" aria-labelledby="candidate-answers">
          <h2 id="candidate-answers">Respuestas adicionales</h2>
          <div className="admin-fields">
            {supplementFields.map((field) => (
              <CandidateField key={field} candidateId={id} field={field} value={candidate[field]} />
            ))}
          </div>
        </section>
        <div className="admin-detail-actions"><DeleteCandidate id={id} name={candidate.full_name} returnToList /></div>
      </div>
    </>
  );
}
