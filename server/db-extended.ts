import { eq, desc, and, gte, lte } from "drizzle-orm";
import { getDb } from "./db";
import {
  agendamentos,
  depoimentos,
  eventos,
  inscricoesEventos,
  type Agendamento,
  type InsertAgendamento,
  type Depoimento,
  type InsertDepoimento,
  type Evento,
  type InsertEvento,
  type InscricaoEvento,
  type InsertInscricaoEvento,
} from "../drizzle/schema";

// ============= AGENDAMENTOS =============

export async function getAllAgendamentos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(agendamentos).orderBy(desc(agendamentos.dataPreferencia));
}

export async function getAgendamentoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(agendamentos).where(eq(agendamentos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAgendamento(data: InsertAgendamento) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(agendamentos).values(data);
  const [inserted] = await db.select({ id: agendamentos.id }).from(agendamentos).orderBy(desc(agendamentos.id)).limit(1);
  return inserted?.id || 0;
}

export async function updateAgendamento(id: number, data: Partial<InsertAgendamento>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(agendamentos).set(data).where(eq(agendamentos.id, id));
}

export async function deleteAgendamento(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(agendamentos).where(eq(agendamentos.id, id));
}

export async function getAgendamentosPendentes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(agendamentos).where(eq(agendamentos.status, "pendente")).orderBy(desc(agendamentos.dataPreferencia));
}

// ============= DEPOIMENTOS =============

export async function getAllDepoimentos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(depoimentos).orderBy(desc(depoimentos.createdAt));
}

export async function getDepoimentosAprovados() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(depoimentos).where(eq(depoimentos.aprovado, true)).orderBy(desc(depoimentos.createdAt));
}

export async function getDepoimentoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(depoimentos).where(eq(depoimentos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDepoimento(data: InsertDepoimento) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(depoimentos).values(data);
  const [inserted] = await db.select({ id: depoimentos.id }).from(depoimentos).orderBy(desc(depoimentos.id)).limit(1);
  return inserted?.id || 0;
}

export async function updateDepoimento(id: number, data: Partial<InsertDepoimento>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(depoimentos).set(data).where(eq(depoimentos.id, id));
}

export async function deleteDepoimento(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(depoimentos).where(eq(depoimentos.id, id));
}

// ============= EVENTOS =============

export async function getAllEventos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(eventos).orderBy(desc(eventos.dataEvento));
}

export async function getEventosAtivos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(eventos).where(eq(eventos.ativo, true)).orderBy(desc(eventos.dataEvento));
}

export async function getEventoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(eventos).where(eq(eventos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEvento(data: InsertEvento) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(eventos).values(data);
  const [inserted] = await db.select({ id: eventos.id }).from(eventos).orderBy(desc(eventos.id)).limit(1);
  return inserted?.id || 0;
}

export async function updateEvento(id: number, data: Partial<InsertEvento>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(eventos).set(data).where(eq(eventos.id, id));
}

export async function deleteEvento(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(eventos).where(eq(eventos.id, id));
}

// ============= INSCRIÇÕES EM EVENTOS =============

export async function getAllInscricoesEventos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(inscricoesEventos).orderBy(desc(inscricoesEventos.createdAt));
}

export async function getInscricoesByEventoId(eventoId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(inscricoesEventos).where(eq(inscricoesEventos.eventoId, eventoId));
}

export async function getInscricaoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(inscricoesEventos).where(eq(inscricoesEventos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createInscricaoEvento(data: InsertInscricaoEvento) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(inscricoesEventos).values(data);
  const [inserted] = await db.select({ id: inscricoesEventos.id }).from(inscricoesEventos).orderBy(desc(inscricoesEventos.id)).limit(1);
  return inserted?.id || 0;
}

export async function updateInscricaoEvento(id: number, data: Partial<InsertInscricaoEvento>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inscricoesEventos).set(data).where(eq(inscricoesEventos.id, id));
}

export async function deleteInscricaoEvento(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(inscricoesEventos).where(eq(inscricoesEventos.id, id));
}
