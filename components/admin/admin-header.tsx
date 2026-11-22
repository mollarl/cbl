import Link from "next/link";
import { logOut } from "@/app/admin/actions";

export default function AdminHeader({ email }: { email?: string }) {
  return (
    <header className="container admin-header">
      <Link className="brand-mark" href="/" aria-label="Volver a Community Builders LATAM">
        <img src="/brand/logo-horizontal.png" alt="" width={176} height={23} />
      </Link>
      {email && (
        <div className="admin-session">
          <span>{email}</span>
          <form action={logOut}><button className="admin-text-button" type="submit">Cerrar sesión</button></form>
        </div>
      )}
    </header>
  );
}
