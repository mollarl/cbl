"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdmin, signInAdmin, signOutAdmin } from "@/lib/admin-auth";
import { candidateIdIsValid, deleteAdminCandidate, setAdminCandidateField } from "@/lib/admin-candidates";
import { isAdminField, normalizeAdminField } from "@/lib/admin-fields";

type FormResult = { ok?: boolean; error?: string };

export async function logIn(_state: FormResult, form: FormData): Promise<FormResult> {
  const email = form.get("email");
  const password = form.get("password");
  const enteredCode = form.get("activationCode");
  const code = typeof enteredCode === "string" ? enteredCode.trim().toLowerCase() : "";
  if (typeof email !== "string" || email.length > 254 || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return { error: "Ingresá un correo válido." };
  }
  if (typeof password !== "string" || !password || password.length > 128) {
    return { error: "Ingresá una contraseña de hasta 128 caracteres." };
  }
  if (code && (!/^[a-f0-9]{48}$/.test(code) || password.length < 12)) {
    return { error: "Para activar la cuenta, ingresá el código y elegí una contraseña de al menos 12 caracteres." };
  }

  try {
    if (!(await signInAdmin(email.trim().toLowerCase(), password, code))) {
      return { error: "No pudimos iniciar sesión con esos datos. Si es tu primer ingreso, verificá tu código de activación." };
    }
  } catch {
    return { error: "El acceso al panel no está disponible en este momento." };
  }
  redirect("/admin");
}

export async function logOut() {
  await signOutAdmin();
  redirect("/admin");
}

export async function editField(_state: FormResult, form: FormData): Promise<FormResult> {
  if (!(await getAdmin())) return { error: "Volvé a iniciar sesión para guardar." };
  const id = form.get("candidateId");
  const field = form.get("field");
  const raw = form.get("value");
  if (!candidateIdIsValid(id) || !isAdminField(field) || typeof raw !== "string") {
    return { error: "Revisá qué dato querés editar." };
  }

  let value;
  try {
    value = normalizeAdminField(field, raw);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Revisá el valor ingresado." };
  }

  try {
    if (!(await setAdminCandidateField(id, field, value))) return { error: "La postulación ya no está disponible." };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "23505") {
      return { error: "Ya existe una postulación con ese correo." };
    }
    return { error: "No se pudo guardar el cambio. Intentá de nuevo." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
  return { ok: true };
}

export async function removeCandidate(_state: FormResult, form: FormData): Promise<FormResult> {
  if (!(await getAdmin())) return { error: "Volvé a iniciar sesión para eliminar." };
  const id = form.get("candidateId");
  if (!candidateIdIsValid(id) || form.get("confirm") !== "yes") {
    return { error: "Confirmá qué postulación querés eliminar." };
  }
  try {
    if (!(await deleteAdminCandidate(id))) return { error: "La postulación ya no está disponible." };
  } catch {
    return { error: "No se pudo eliminar la postulación. Intentá de nuevo." };
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
  if (form.get("returnToList") === "yes") redirect("/admin");
  return { ok: true };
}
