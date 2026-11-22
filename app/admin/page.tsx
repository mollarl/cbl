import Link from "next/link";
import { getAdmin } from "@/lib/admin-auth";
import { listAdminCandidates, pageSize } from "@/lib/admin-candidates";
import { contactFields } from "@/lib/admin-fields";
import AdminHeader from "@/components/admin/admin-header";
import LoginForm from "@/components/admin/login-form";
import CandidateField from "@/components/admin/candidate-field";
import CandidateStatusChip from "@/components/admin/candidate-status";
import DeleteCandidate from "@/components/admin/delete-candidate";

function pageHref(page: number, search: string) {
  const query = new URLSearchParams();
  if (search) query.set("q", search);
  if (page > 1) query.set("page", String(page));
  const encoded = query.toString();
  return encoded ? `/admin?${encoded}` : "/admin";
}

export default async function AdminPage({ searchParams }: {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
}) {
  const admin = await getAdmin();
  if (!admin) {
    return (
      <>
        <AdminHeader />
        <section className="container admin-login-section"><LoginForm /></section>
      </>
    );
  }

  const query = await searchParams;
  const search = typeof query.q === "string" ? query.q.trim().slice(0, 120) : "";
  const requestedPage = Number(query.page);
  const safePage = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, 2147483647)
    : 1;
  const { total, page, candidates } = await listAdminCandidates(search, safePage);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;

  return (
    <>
      <AdminHeader email={admin.email} />
      <div className="container admin-content">
        <div className="admin-title">
          <p className="eyebrow">Administración</p>
          <h1>Postulaciones</h1>
        </div>
        <form className="admin-search" method="get" action="/admin" role="search">
          <label htmlFor="admin-search">Buscar postulaciones</label>
          <div>
            <input
              id="admin-search" name="q" type="search" defaultValue={search} key={search}
              maxLength={120} placeholder="Nombre, correo, ciudad o respuestas"
            />
            <button className="button button-mustard" type="submit">Buscar</button>
            {search && <Link className="admin-link" href="/admin" prefetch={false}>Limpiar</Link>}
          </div>
        </form>

        {total ? (
          <>
            <p className="admin-results">Mostrando {start}–{start + candidates.length - 1} de {total} postulaciones</p>
            <ul className="admin-candidates">
              {candidates.map((candidate) => (
                <li className="raised-card admin-candidate-card" key={candidate.id}>
                  <div className="admin-card-status">
                    <CandidateStatusChip status={candidate.status} />
                  </div>
                  <div className="admin-fields">
                    {contactFields.map((field) => (
                      <CandidateField key={field} candidateId={candidate.id} field={field} value={candidate[field]} />
                    ))}
                  </div>
                  <div className="admin-card-footer">
                    <Link className="admin-link" href={`/admin/${candidate.id}`} prefetch={false}>Ver ficha completa</Link>
                    <DeleteCandidate id={candidate.id} name={candidate.full_name} />
                  </div>
                </li>
              ))}
            </ul>
            <nav className="admin-pagination" aria-label="Paginación de postulaciones">
              {page > 1 && <Link className="admin-small-button" href={pageHref(page - 1, search)} prefetch={false}>Anterior</Link>}
              <span>Página {page} de {totalPages}</span>
              {page < totalPages && <Link className="admin-small-button" href={pageHref(page + 1, search)} prefetch={false}>Siguiente</Link>}
            </nav>
          </>
        ) : (
          <p className="raised-card admin-empty">
            {search ? "No hay postulaciones que coincidan con la búsqueda." : "Todavía no hay postulaciones."}
          </p>
        )}
      </div>
    </>
  );
}
