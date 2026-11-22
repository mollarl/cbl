-- Aplicar si la tabla ya existe con LinkedIn obligatorio.
ALTER TABLE candidates ALTER COLUMN linkedin_url DROP NOT NULL;
