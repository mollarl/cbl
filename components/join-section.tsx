"use client";

import { useEffect, useRef, useState } from "react";
import ApplicationForm from "./application-form";
import SupplementForm from "./supplement-form";

type Stage = { step: "intro" | "contact" | "done" } | { step: "supplement"; candidateId: string };

export default function JoinSection() {
  const [stage, setStage] = useState<Stage>({ step: "intro" });
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function openFromAnchor() {
      if (window.location.hash !== "#formulario") return;
      setStage((current) => current.step === "intro" ? { step: "contact" } : current);
    }

    openFromAnchor();
    window.addEventListener("hashchange", openFromAnchor);
    return () => window.removeEventListener("hashchange", openFromAnchor);
  }, []);

  useEffect(() => {
    if (stage.step !== "intro") {
      const heading = panel.current?.querySelector<HTMLElement>("[data-step-heading]");
      heading?.focus({ preventScroll: true });
      // The browser handles smooth scrolling through CSS, including reduced motion.
      heading?.scrollIntoView({ block: "start" });
    }
  }, [stage.step]);

  return (
    <section className="chapter join-section" id="sumate" aria-labelledby="join-title">
      <div className="container">
        <div className="raised-card join-card" id="formulario" data-enter={stage.step === "intro" ? "bottom" : undefined}>
          <div className="join-summary">
            <div className="join-copy">
              <p className="eyebrow">Cómo sumarse</p>
              <h2 id="join-title">¿Querés ser parte?</h2>
              <p>Si trabajás creando, desarrollando o gestionando comunidades, completá el formulario. Revisamos cada respuesta para cuidar el propósito y la calidad del espacio.</p>
            </div>
            {stage.step === "intro" && (
              <button
                className="button button-mustard join-trigger"
                type="button"
                aria-controls="join-panel"
                aria-expanded={false}
                onClick={() => setStage({ step: "contact" })}
              >
                Completar formulario <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
          <div id="join-panel" ref={panel} hidden={stage.step === "intro"}>
            {stage.step === "contact" && (
              <ApplicationForm onSaved={(candidateId) => setStage({ step: "supplement", candidateId })} />
            )}
            {stage.step === "supplement" && (
              <SupplementForm candidateId={stage.candidateId} onComplete={() => setStage({ step: "done" })} />
            )}
            {stage.step === "done" && (
              <div className="join-form join-success" role="status">
                <h3 data-step-heading tabIndex={-1}>Recibimos tu postulación</h3>
                <p>Gracias por tu interés en Community Builders LATAM. Vamos a revisar tu registro para ponernos en contacto.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
