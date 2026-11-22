import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones | Community Builders LATAM",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <main className="container terms-page">
      <Link className="terms-link" href="/">Ir a la landing</Link>
      <article className="raised-card terms-card">
        <p className="eyebrow">Community Builders LATAM</p>
        <h1>Términos y condiciones</h1>
        <p className="terms-lede">Condiciones de postulación, tratamiento de datos y autorización de uso de imagen.</p>

        <section aria-labelledby="terms-application">
          <h2 id="terms-application">Postulación a la comunidad</h2>
          <p>El formulario registra tu interés en sumarte a Community Builders LATAM. El equipo revisa las postulaciones y confirma el ingreso por correo electrónico o WhatsApp.</p>
        </section>

        <section aria-labelledby="terms-data">
          <h2 id="terms-data">Datos personales</h2>
          <p>Al confirmar el primer paso, se guardan tu nombre, ubicación, correo y número de WhatsApp en la base de postulaciones. LinkedIn y las preguntas adicionales son opcionales. Los datos de contacto requeridos permiten registrar la postulación y comunicarnos con vos sobre ella.</p>
          <p>El equipo de Community Builders LATAM usa tus datos para revisar la postulación y gestionar el ingreso. El acceso se limita al equipo que revisa postulaciones y, para el alojamiento y almacenamiento, a los proveedores técnicos que prestan esos servicios.</p>
          <p><strong>Responsable de los datos, domicilio y plazo de conservación:</strong> FALTA DEFINIR.</p>
          <p>Podés solicitar el acceso, la actualización, la corrección o la eliminación de tus datos escribiendo a <a className="terms-link" href="mailto:communitybuilderslt@gmail.com">communitybuilderslt@gmail.com</a>.</p>
        </section>

        <section id="uso-de-imagen" aria-labelledby="terms-image">
          <h2 id="terms-image">Uso de imagen</h2>
          <p>Durante los encuentros, eventos y actividades de Community Builders LATAM podrán tomarse fotografías o videos. Si marcás la casilla de autorización, permitís que Community Builders LATAM capte y difunda imágenes en las que aparezcas para comunicar las actividades de la comunidad.</p>
          <p>La autorización se limita al sitio web, redes sociales, newsletters y otros canales institucionales de la comunidad. Comprende los ajustes de formato necesarios para la publicación, como recortes o cambios de tamaño, con respeto por el contexto de la imagen.</p>
          <p>Dar esta autorización es opcional. Podés dejar la casilla sin marcar y seguir con tu postulación. Si ya autorizaste el uso, podés revocarlo para futuras publicaciones y solicitar el retiro de materiales en los canales que la comunidad controla escribiendo a <a className="terms-link" href="mailto:communitybuilderslt@gmail.com">communitybuilderslt@gmail.com</a>.</p>
        </section>
      </article>
    </main>
  );
}
