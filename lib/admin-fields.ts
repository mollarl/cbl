export const contactFields = ["full_name", "email", "location", "whatsapp"] as const;
export const supplementFields = [
  "role", "community_experience", "community_type", "community_age", "participant_count", "work_mode",
  "previous_experience", "main_challenge", "motivation", "contribution", "expectations", "topics", "image_consent",
] as const;

export const candidateStatuses = {
  pending: "Pendiente",
  reviewed: "Revisada",
  accepted: "Aceptada",
  rejected: "Rechazada",
} as const;

export type CandidateStatus = keyof typeof candidateStatuses;
export type AdminField = typeof contactFields[number] | typeof supplementFields[number] | "linkedin_url" | "status";
export type CandidateValue = string | boolean | null;
export type AdminFieldConfig = {
  label: string;
  kind: "text" | "email" | "tel" | "url" | "textarea" | "consent" | "status";
  required?: boolean;
  maxLength?: number;
};

export const adminFields: Record<AdminField, AdminFieldConfig> = {
  full_name: { label: "Nombre y apellido", kind: "text", required: true, maxLength: 200 },
  email: { label: "Correo electrónico", kind: "email", required: true, maxLength: 254 },
  location: { label: "País / ciudad", kind: "text", required: true, maxLength: 200 },
  whatsapp: { label: "WhatsApp", kind: "tel", required: true, maxLength: 60 },
  linkedin_url: { label: "LinkedIn", kind: "url", maxLength: 2048 },
  status: { label: "Estado", kind: "status" },
  role: { label: "Rol actual", kind: "text", maxLength: 300 },
  community_experience: { label: "¿Cuánto tiempo lleva trabajando en Community?", kind: "textarea" },
  community_type: { label: "¿Qué tipo de comunidad gestiona actualmente?", kind: "textarea" },
  community_age: { label: "¿Hace cuánto existe esa comunidad?", kind: "textarea" },
  participant_count: { label: "¿Cuántas personas participan aproximadamente?", kind: "textarea" },
  work_mode: { label: "¿Trabaja de manera independiente o dentro de una organización?", kind: "textarea" },
  previous_experience: { label: "¿Qué experiencia previa tiene construyendo o gestionando comunidades?", kind: "textarea" },
  main_challenge: { label: "¿Cuál es su principal desafío como Community Builder?", kind: "textarea" },
  motivation: { label: "¿Qué la motivó a sumarse a Community Builders LATAM?", kind: "textarea" },
  contribution: { label: "¿Qué experiencia, conocimiento o aprendizaje le gustaría aportar?", kind: "textarea" },
  expectations: { label: "¿Qué le gustaría encontrar, aprender o llevarse de este espacio?", kind: "textarea" },
  topics: { label: "¿Qué temas le gustaría conversar con otros Community Builders?", kind: "textarea" },
  image_consent: { label: "Autorización de uso de imagen", kind: "consent" },
};

export function isAdminField(value: unknown): value is AdminField {
  return typeof value === "string" && Object.hasOwn(adminFields, value);
}

export function normalizeAdminField(field: AdminField, input: string) {
  const { kind, label, required, maxLength = 8000 } = adminFields[field];
  const value = input.trim();
  if (value.length > maxLength) throw new Error(`${label} supera el largo permitido.`);
  if (required && !value) throw new Error(`Completá ${label.toLowerCase()}.`);
  if (kind === "status" && !Object.hasOwn(candidateStatuses, value)) {
    throw new Error("Seleccioná un estado válido.");
  }
  if (kind === "consent") {
    if (value !== "true" && value !== "false") throw new Error("Seleccioná una opción válida.");
    return value === "true";
  }
  if (kind === "email") {
    if (!/^\S+@\S+\.\S+$/.test(value)) throw new Error("Ingresá un correo válido.");
    return value.toLowerCase();
  }
  if (kind === "url" && value) {
    const url = URL.canParse(value) ? new URL(value) : null;
    if (!url || !["https:", "http:"].includes(url.protocol)) throw new Error("Ingresá un enlace web válido.");
  }
  return value || null;
}
