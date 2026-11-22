-- Consultas de referencia para administrar postulaciones.

-- Alta inicial: datos básicos (se ejecuta desde /api/candidates).
INSERT INTO candidates (full_name, email, location, linkedin_url, whatsapp)
VALUES ($1, $2, $3, NULLIF($4, ''), $5)
RETURNING id, created_at, updated_at;

-- Complemento opcional (se ejecuta desde /api/candidates/[id]).
UPDATE candidates
SET role = COALESCE(NULLIF($2, ''), role),
    community_experience = COALESCE(NULLIF($3, ''), community_experience),
    community_type = COALESCE(NULLIF($4, ''), community_type),
    community_age = COALESCE(NULLIF($5, ''), community_age),
    participant_count = COALESCE(NULLIF($6, ''), participant_count),
    work_mode = COALESCE(NULLIF($7, ''), work_mode),
    previous_experience = COALESCE(NULLIF($8, ''), previous_experience),
    main_challenge = COALESCE(NULLIF($9, ''), main_challenge),
    motivation = COALESCE(NULLIF($10, ''), motivation),
    contribution = COALESCE(NULLIF($11, ''), contribution),
    expectations = COALESCE(NULLIF($12, ''), expectations),
    topics = COALESCE(NULLIF($13, ''), topics),
    image_consent = $14,
    updated_at = NOW()
WHERE id = $1::uuid;

-- Bandeja de revisión.
SELECT id, full_name, email, location, linkedin_url, whatsapp, status, image_consent, created_at
FROM candidates
ORDER BY created_at DESC;

-- Cambiar estado de una postulación.
UPDATE candidates SET status = $2, updated_at = NOW() WHERE id = $1::uuid;
