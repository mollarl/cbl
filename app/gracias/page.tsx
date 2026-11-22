import Link from "next/link";

export const metadata = { title: "Gracias | Community Builders LATAM", description: "Gracias por tu interés en Community Builders LATAM." };

export default function ThanksPage() {
  return <main className="thanks-page"><img src="/brand/logo-horizontal.png" alt="Community Builders LATAM" className="thanks-logo" /><div className="thanks-content"><p className="eyebrow"><span className="dash" /> Registro recibido</p><h1>Gracias por abrir esta puerta.</h1><p>Ya guardamos tus datos. Vamos a revisar las respuestas y contactarte para seguir construyendo la comunidad.</p><Link className="button button-dark" href="/">Volver a la landing ↖</Link></div><div className="thanks-orbit" aria-hidden="true"><img src="/brand/seal.png" alt="" /></div></main>;
}
