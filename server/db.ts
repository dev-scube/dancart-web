import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { InsertUser, users, bailarinos, cursos, matriculas, mensalidades, InsertBailarino, InsertCurso, InsertMatricula, InsertMensalidade } from "../drizzle/schema";
import { ENV } from './_core/env';
import { Pool } from 'pg';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: Pool | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _pool = new Pool({ connectionString: process.env.DATABASE_URL });
      _db = drizzle(_pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Bailarinos
export async function getAllBailarinos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(bailarinos).orderBy(desc(bailarinos.createdAt));
}

export async function getBailarinoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bailarinos).where(eq(bailarinos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBailarino(data: InsertBailarino) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bailarinos).values(data);
  const [inserted] = await db.select({ id: bailarinos.id }).from(bailarinos).orderBy(desc(bailarinos.id)).limit(1);
  return inserted?.id || 0;
}

export async function updateBailarino(id: number, data: Partial<InsertBailarino>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bailarinos).set(data).where(eq(bailarinos.id, id));
}

export async function deleteBailarino(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(bailarinos).where(eq(bailarinos.id, id));
}

// Cursos
export async function getAllCursos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cursos).orderBy(desc(cursos.createdAt));
}

export async function getCursoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cursos).where(eq(cursos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCurso(data: InsertCurso) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(cursos).values(data);
  const [inserted] = await db.select({ id: cursos.id }).from(cursos).orderBy(desc(cursos.id)).limit(1);
  return inserted?.id || 0;
}

export async function updateCurso(id: number, data: Partial<InsertCurso>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(cursos).set(data).where(eq(cursos.id, id));
}

export async function deleteCurso(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cursos).where(eq(cursos.id, id));
}

// Matrículas
export async function getAllMatriculas() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(matriculas).orderBy(desc(matriculas.createdAt));
}

export async function getMatriculaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(matriculas).where(eq(matriculas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getMatriculasByBailarinoId(bailarinoId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(matriculas).where(eq(matriculas.bailarinoId, bailarinoId));
}

export async function getMatriculasByCursoId(cursoId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(matriculas).where(eq(matriculas.cursoId, cursoId));
}

export async function createMatricula(data: InsertMatricula) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(matriculas).values(data);
  const [inserted] = await db.select({ id: matriculas.id }).from(matriculas).orderBy(desc(matriculas.id)).limit(1);
  return inserted?.id || 0;
}

export async function updateMatricula(id: number, data: Partial<InsertMatricula>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(matriculas).set(data).where(eq(matriculas.id, id));
}

export async function deleteMatricula(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(matriculas).where(eq(matriculas.id, id));
}

// Mensalidades
export async function getAllMensalidades() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(mensalidades).orderBy(desc(mensalidades.mesReferencia));
}

export async function getMensalidadeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(mensalidades).where(eq(mensalidades.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getMensalidadesByMatriculaId(matriculaId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(mensalidades).where(eq(mensalidades.matriculaId, matriculaId)).orderBy(desc(mensalidades.mesReferencia));
}

export async function createMensalidade(data: InsertMensalidade) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(mensalidades).values(data);
  const [inserted] = await db.select({ id: mensalidades.id }).from(mensalidades).orderBy(desc(mensalidades.id)).limit(1);
  return inserted?.id || 0;
}

export async function updateMensalidade(id: number, data: Partial<InsertMensalidade>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(mensalidades).set(data).where(eq(mensalidades.id, id));
}

export async function deleteMensalidade(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(mensalidades).where(eq(mensalidades.id, id));
}

// Dashboard Analytics
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return null;

  const [totalBailarinos] = await db.select({ count: sql<number>`count(*)` }).from(bailarinos).where(eq(bailarinos.ativo, true));
  const [totalCursos] = await db.select({ count: sql<number>`count(*)` }).from(cursos).where(eq(cursos.ativo, true));
  const [totalMatriculasAtivas] = await db.select({ count: sql<number>`count(*)` }).from(matriculas).where(eq(matriculas.status, "ativa"));
  
  const [receitaMensal] = await db.select({ 
    total: sql<number>`sum(${mensalidades.valorPago})` 
  }).from(mensalidades).where(
    and(
      eq(mensalidades.status, "paga"),
      gte(mensalidades.dataPagamento, sql`CURRENT_DATE - INTERVAL '30 days'`)
    )
  );

  const [inadimplencia] = await db.select({ 
    count: sql<number>`count(*)` 
  }).from(mensalidades).where(eq(mensalidades.status, "atrasada"));

  return {
    totalBailarinos: Number(totalBailarinos?.count) || 0,
    totalCursos: Number(totalCursos?.count) || 0,
    totalMatriculasAtivas: Number(totalMatriculasAtivas?.count) || 0,
    receitaMensal: Number(receitaMensal?.total) || 0,
    inadimplencia: Number(inadimplencia?.count) || 0,
  };
}

export async function getMatriculasPorCurso() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      cursoNome: cursos.nome,
      totalMatriculas: sql<number>`count(${matriculas.id})`,
    })
    .from(matriculas)
    .innerJoin(cursos, eq(matriculas.cursoId, cursos.id))
    .where(eq(matriculas.status, "ativa"))
    .groupBy(cursos.id, cursos.nome);
}
