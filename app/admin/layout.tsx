import type { Metadata } from "next";
import "./admin.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata: Metadata = {
  title: "Panel de postulaciones | Community Builders LATAM",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="admin-page">{children}</main>;
}
