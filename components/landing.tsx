import JoinSection from "./join-section";

const pillars = [
  ["Encuentro", "Conectar con pares que comparten desafíos y están construyendo comunidad desde distintos sectores."],
  ["Aprendizaje", "Intercambiar recursos, herramientas, metodologías, casos y experiencias aplicadas."],
  ["Profesionalización", "Dar claridad, lenguaje, herramientas y reconocimiento a una práctica que ya transforma organizaciones."],
  ["Referencia regional", "Reunir voces, prácticas y conocimiento propio de Latinoamérica para construir una mirada situada."],
];

const topics = [
  "Impacto", "Emprendimiento", "Marcas", "Educación", "Membresías", "Tech",
  "Innovación", "Ecosistemas", "Organizaciones", "Comunidades profesionales",
];

const activities = [
  ["Encuentros online", "Conversaciones sobre desafíos comunes y decisiones reales de la práctica.", "acogemos"],
  ["Recursos compartidos", "Herramientas, lecturas, frameworks y aprendizajes listos para usar.", "compartimos"],
  ["Casos de la región", "Experiencias concretas de personas construyendo comunidades en LATAM.", "construimos"],
  ["Conversaciones entre pares", "Un espacio para preguntar, pensar, acompañarnos y celebrar avances.", "celebramos"],
];

const cardDirections = ["left", "top", "bottom", "right"] as const;

const founders = [
  {
    name: "Pi",
    photo: "pia",
    linkedin: "mariapiadelafuente",
    bio: [
      "Desde hace más de seis años trabajo diseñando estrategias de comunidad y experiencias que conectan a las personas entre sí y con las organizaciones de las que forman parte.",
      "A lo largo de mi carrera trabajé en coworkings, empresas de educación y organizaciones digitales, liderando proyectos de comunidad, eventos y engagement. En ese recorrido coordiné más de 100 experiencias nacionales e internacionales, con la participación de más de 3.000 asistentes, y desarrollé iniciativas que fortalecieron el sentido de pertenencia, promovieron conexiones que derivaron en nuevas oportunidades de negocio y contribuyeron a construir comunidades más activas y participativas.",
      "Lo que más disfruto de mi trabajo es diseñar espacios donde las personas realmente quieran estar, conectar y volver. Me entusiasma crear experiencias que no terminen cuando finaliza un evento, sino que den lugar a relaciones, colaboraciones y oportunidades que continúen en el tiempo.",
    ],
    facts: [
      "Me gustan tanto los planes con gente que alguna vez convertí una juntada entre desconocidos en un proyecto.",
      "Definitivamente, dormir la siesta.",
      "Mate, amigos, deportes y hobbies.",
    ],
  },
  {
    name: "Fer",
    photo: "fer",
    linkedin: "mafernandac",
    bio: [
      "Construyo espacios donde la colaboración sucede de forma genuina.",
      "A lo largo de mi recorrido trabajando en comunidades y experiencias en América Latina, diseñé y lideré comunidades desde cero y coordiné eventos y experiencias que reunieron a líderes, emprendedores, organizaciones, gobiernos y distintos stakeholders de la región.",
      "Trabajar en estos contextos me enseñó que un encuentro no genera valor por sí solo: necesita intención, diseño y una articulación real entre personas, equipos y contexto. Gran parte de mi trabajo consiste justamente en conectar esos puntos, alinear intereses diversos y llevar las ideas a la práctica, siempre poniendo la experiencia en primer plano.",
      "Trabajo en la intersección entre comunidad, experiencias y ecosystem building. Me interesa especialmente diseñar espacios —físicos y relacionales— que faciliten conexiones genuinas, colaboración y nuevas oportunidades.",
    ],
    facts: ["FALTA DEFINIR", "FALTA DEFINIR", "FALTA DEFINIR"],
  },
];

export default function Landing() {
  return (
    <>
      <header className="site-header container">
        <a className="brand-mark" href="#inicio" aria-label="Community Builders LATAM, inicio">
          <img src="/brand/logo-horizontal.png" alt="" width={176} height={23} />
        </a>
        <nav className="site-nav" aria-label="Navegación principal">
          <a href="#proposito">Propósito</a>
          <a href="#pilares">Pilares</a>
          <a href="#comunidad">La comunidad</a>
          <a className="nav-cta" href="#formulario">Quiero sumarme</a>
        </nav>
      </header>

      <main>
        <section className="hero container" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">Comunidad profesional · Latinoamérica</p>
            <h1>
              <span>Impulsamos</span>{" "}
              <span>el <em>community</em></span>{" "}
              <span><em>building</em> en</span>{" "}
              <span>LATAM.</span>
            </h1>
            <p className="hero-lede">El espacio de encuentro, desarrollo y referencia para quienes construyen comunidades como práctica profesional en la región.</p>
            <a className="button button-orange" href="#formulario">Quiero sumarme <span aria-hidden="true">→</span></a>
            <p className="hero-note">Para personas que crean, desarrollan o gestionan comunidades como parte de su trabajo.</p>
          </div>
          <div className="raised-card hero-photo">
            <img
              src="/people/portada.webp"
              width={1600}
              height={1117}
              alt="Foto grupal en un encuentro de Community Builders LATAM"
              fetchPriority="high"
            />
          </div>
        </section>

        <section className="chapter purpose-section" id="proposito" aria-labelledby="purpose-title">
          <div className="container split purpose-layout">
            <p className="display purpose-statement" data-enter="left">
              Quienes construimos <em>comunidad</em> también necesitamos comunidad.
            </p>
            <div data-enter="right">
              <p className="eyebrow">Por qué existe</p>
              <h2 id="purpose-title">Una disciplina en crecimiento, pero todavía dispersa.</h2>
              <p className="chapter-lede">En Latinoamérica hay cada vez más personas diseñando, activando y sosteniendo comunidades. Sin embargo, todavía faltan espacios de referencia donde compartir metodologías, aprender de casos reales y construir lenguaje común.</p>
              <ul className="tag-list purpose-tags">
                {["Desafíos reales", "Mirada regional", "Aprendizaje entre pares"].map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="chapter definition-section" id="comunidad" aria-labelledby="definition-title">
          <div className="container split definition-layout">
            <div data-enter="top">
              <p className="eyebrow">Qué es</p>
              <h2 id="definition-title">Un punto de encuentro y desarrollo profesional.</h2>
              <p className="chapter-lede definition-lede">Community Builders LATAM reúne a quienes trabajan creando, desarrollando y gestionando comunidades en la región. Conectamos experiencias, producimos conocimiento y fortalecemos el community building como disciplina.</p>
            </div>
            <p className="raised-card mission-card" data-enter="right">Queremos convertirnos en la referencia regional para quienes hacen del community building una práctica profesional.</p>
          </div>
        </section>

        <section className="chapter pillars-section" id="pilares" aria-labelledby="pillars-title">
          <div className="container">
            <p className="eyebrow">Nuestros pilares</p>
            <h2 className="wide-title" id="pillars-title">Encontrarnos, aprender y hacer crecer la disciplina.</h2>
            <ol className="pillars-grid">
              {pillars.map(([title, body], index) => (
                <li className="raised-card pillar-card" data-enter={cardDirections[index]} key={title}>
                  <span className="pillar-number" aria-hidden="true">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="chapter audience-section" aria-labelledby="audience-title">
          <div className="container split audience-layout">
            <div data-enter="left">
              <p className="eyebrow">Para quién es</p>
              <h2 id="audience-title">Para quienes hacen comunidad de verdad.</h2>
              <p className="audience-lede">Personas que trabajan activamente creando, desarrollando, gestionando, activando o sosteniendo comunidades.</p>
              <p className="audience-note">Cuidamos el foco: no es un espacio de community management de redes sociales ni de interés general. Buscamos conversaciones entre pares que comparten una práctica profesional.</p>
            </div>
            <ul className="tag-list audience-tags">
              {topics.map((topic, index) => (
                <li data-enter={cardDirections[index % cardDirections.length]} key={topic}>{topic}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="chapter inside-section" id="adentro" aria-labelledby="inside-title">
          <div className="container">
            <p className="eyebrow">Qué pasa adentro</p>
            <h2 id="inside-title">Empezamos simple.<br />Construimos con intención.</h2>
            <div className="activity-list">
              {activities.map(([title, body, icon], index) => (
                <article className="activity" data-enter={index % 2 === 0 ? "left" : "right"} key={title}>
                  <img src={`/icons/${icon}.png`} width={76} height={76} loading="lazy" alt="" />
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="inside-note" data-enter="bottom">A futuro: talleres, formación, eventos y encuentros presenciales en distintos puntos de Latinoamérica.</p>
          </div>
        </section>

        <section className="chapter people-section" id="somos" aria-labelledby="people-title">
          <div className="container">
            <p className="eyebrow">La comunidad</p>
            <h2 id="people-title">¿Quiénes somos?</h2>
            <div className="people-grid">
              {founders.map(({ name, photo, linkedin, bio, facts }, index) => (
                <article className="raised-card person-card" data-enter={index === 0 ? "left" : "right"} key={name}>
                  <div className="person-heading">
                    <img src={`/people/${photo}.jpeg`} alt={name} width={120} height={120} loading="lazy" />
                    <div>
                      <h3>{name}</h3>
                      <a href={`https://www.linkedin.com/in/${linkedin}/`} aria-label={`LinkedIn de ${name}`}>LinkedIn</a>
                    </div>
                  </div>
                  {bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  <dl className="person-facts">
                    {["Dato random", "Guilty pleasure", "Fuera del trabajo"].map((label, index) => (
                      <div key={label}><dt>{label}</dt><dd>{facts[index]}</dd></div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
            <img className="together-photo" data-enter="bottom" src="/people/together.jpeg" alt="Pi y Fer juntas" width={720} height={1280} loading="lazy" />
          </div>
        </section>

        <JoinSection />
      </main>

      <footer className="site-footer">
        <div className="container">
          <nav className="footer-links" aria-label="Enlaces del pie de página">
            <a href="https://www.linkedin.com/company/community-builders-latam">LinkedIn</a>
            <a href="#formulario">Formulario</a>
            <a href="mailto:communitybuilderslt@gmail.com">Contacto</a>
          </nav>
          <div className="footer-bottom">
            <p>Una comunidad para quienes hacen comunidad.</p>
            <p>Community Builders LATAM · 2026</p>
          </div>
        </div>
      </footer>
    </>
  );
}
