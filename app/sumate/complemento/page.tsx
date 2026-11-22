import Link from "next/link";
import { redirect } from "next/navigation";
import SupplementForm from "@/components/supplement-form";

export const metadata = {
  title: "Tu recorrido | Community Builders LATAM",
  robots: { index: false },
};

export default async function SupplementPage({
  searchParams,
}: {
  searchParams: Promise<{ candidate?: string | string[] }>;
}) {
  const { candidate } = await searchParams;
  if (typeof candidate !== "string" || !candidate) redirect("/#formulario");

  return (
    <main className="container legacy-page">
      <Link href="/">Volver a la landing</Link>
      <div className="raised-card join-card">
        <h1>Tu postulación</h1>
        <SupplementForm candidateId={candidate} />
      </div>
    </main>
  );
}
