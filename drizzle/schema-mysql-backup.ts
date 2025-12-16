import { pgTable, serial, varchar, text, timestamp, boolean, date, integer, pgEnum } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Bailarinos (dancers) table
 */
export const bailarinos = mysqlTable("bailarinos", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  dataNascimento: date("dataNascimento").notNull(),
  cpf: varchar("cpf", { length: 14 }),
  rg: varchar("rg", { length: 20 }),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  endereco: text("endereco"),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  cep: varchar("cep", { length: 10 }),
  
  // Responsável (para menores de idade)
  nomeResponsavel: varchar("nomeResponsavel", { length: 255 }),
  telefoneResponsavel: varchar("telefoneResponsavel", { length: 20 }),
  emailResponsavel: varchar("emailResponsavel", { length: 320 }),
  
  // Informações de saúde
  tipoSanguineo: varchar("tipoSanguineo", { length: 5 }),
  alergiasRestricoes: text("alergiasRestricoes"),
  contatoEmergencia: varchar("contatoEmergencia", { length: 255 }),
  telefoneEmergencia: varchar("telefoneEmergencia", { length: 20 }),
  
  // Foto
  fotoUrl: text("fotoUrl"),
  
  // Status
  ativo: boolean("ativo").default(true).notNull(),
  observacoes: text("observacoes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Bailarino = typeof bailarinos.$inferSelect;
export type InsertBailarino = typeof bailarinos.$inferInsert;

/**
 * Cursos (courses) table
 */
export const cursos = mysqlTable("cursos", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  modalidade: varchar("modalidade", { length: 100 }).notNull(), // Ballet, Jazz, Contemporâneo, etc
  nivel: mysqlEnum("nivel", ["iniciante", "intermediario", "avancado"]).notNull(),
  faixaEtaria: varchar("faixaEtaria", { length: 50 }), // Ex: "4-10 anos"
  
  // Horários
  diasSemana: varchar("diasSemana", { length: 100 }), // Ex: "Segunda, Quarta, Sexta"
  horario: varchar("horario", { length: 50 }), // Ex: "14:00 - 15:30"
  duracaoAula: int("duracaoAula"), // Em minutos
  
  // Valores
  valorMensal: int("valorMensal").notNull(), // Em centavos
  vagasTotal: int("vagasTotal").notNull(),
  vagasOcupadas: int("vagasOcupadas").default(0).notNull(),
  
  // Status
  ativo: boolean("ativo").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Curso = typeof cursos.$inferSelect;
export type InsertCurso = typeof cursos.$inferInsert;

/**
 * Matrículas (enrollments) table
 */
export const matriculas = mysqlTable("matriculas", {
  id: int("id").autoincrement().primaryKey(),
  bailarinoId: int("bailarinoId").notNull(),
  cursoId: int("cursoId").notNull(),
  
  dataMatricula: timestamp("dataMatricula").defaultNow().notNull(),
  dataInicio: date("dataInicio").notNull(),
  dataFim: date("dataFim"),
  
  // Bolsa
  tipoBolsa: mysqlEnum("tipoBolsa", ["nenhuma", "parcial", "integral"]).default("nenhuma").notNull(),
  percentualBolsa: int("percentualBolsa").default(0).notNull(), // 0-100
  valorMensalComDesconto: int("valorMensalComDesconto").notNull(), // Em centavos
  
  // Status
  status: mysqlEnum("status", ["ativa", "cancelada", "concluida", "suspensa"]).default("ativa").notNull(),
  motivoCancelamento: text("motivoCancelamento"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Matricula = typeof matriculas.$inferSelect;
export type InsertMatricula = typeof matriculas.$inferInsert;

/**
 * Mensalidades (monthly payments) table
 */
export const mensalidades = mysqlTable("mensalidades", {
  id: int("id").autoincrement().primaryKey(),
  matriculaId: int("matriculaId").notNull(),
  
  mesReferencia: date("mesReferencia").notNull(), // Primeiro dia do mês
  valorOriginal: int("valorOriginal").notNull(), // Em centavos
  valorPago: int("valorPago").default(0).notNull(), // Em centavos
  
  dataVencimento: date("dataVencimento").notNull(),
  dataPagamento: timestamp("dataPagamento"),
  
  status: mysqlEnum("status", ["pendente", "paga", "atrasada", "cancelada"]).default("pendente").notNull(),
  formaPagamento: varchar("formaPagamento", { length: 50 }), // Dinheiro, PIX, Cartão, etc
  
  observacoes: text("observacoes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Mensalidade = typeof mensalidades.$inferSelect;
export type InsertMensalidade = typeof mensalidades.$inferInsert;

/**
 * Agendamentos de aulas experimentais
 */
export const agendamentos = mysqlTable("agendamentos", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  modalidade: varchar("modalidade", { length: 100 }).notNull(),
  dataPreferencia: date("dataPreferencia").notNull(),
  horarioPreferencia: varchar("horarioPreferencia", { length: 50 }),
  idade: int("idade"),
  mensagem: text("mensagem"),
  status: mysqlEnum("status", ["pendente", "confirmado", "realizado", "cancelado"]).default("pendente").notNull(),
  dataConfirmacao: timestamp("dataConfirmacao"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agendamento = typeof agendamentos.$inferSelect;
export type InsertAgendamento = typeof agendamentos.$inferInsert;

/**
 * Depoimentos
 */
export const depoimentos = mysqlTable("depoimentos", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  fotoUrl: text("fotoUrl"),
  modalidade: varchar("modalidade", { length: 100 }),
  avaliacao: int("avaliacao").notNull(), // 1-5 estrelas
  depoimento: text("depoimento").notNull(),
  aprovado: boolean("aprovado").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Depoimento = typeof depoimentos.$inferSelect;
export type InsertDepoimento = typeof depoimentos.$inferInsert;

/**
 * Eventos
 */
export const eventos = mysqlTable("eventos", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  tipo: mysqlEnum("tipo", ["festival", "competicao", "apresentacao", "workshop"]).notNull(),
  dataEvento: timestamp("dataEvento").notNull(),
  local: varchar("local", { length: 255 }),
  endereco: text("endereco"),
  valorInscricao: int("valorInscricao").default(0).notNull(), // em centavos
  vagasTotal: int("vagasTotal"),
  vagasOcupadas: int("vagasOcupadas").default(0).notNull(),
  imagemUrl: text("imagemUrl"),
  inscricoesAbertas: boolean("inscricoesAbertas").default(true).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Evento = typeof eventos.$inferSelect;
export type InsertEvento = typeof eventos.$inferInsert;

/**
 * Inscrições em eventos
 */
export const inscricoesEventos = mysqlTable("inscricoesEventos", {
  id: int("id").autoincrement().primaryKey(),
  eventoId: int("eventoId").notNull(),
  bailarinoId: int("bailarinoId"),
  nomeParticipante: varchar("nomeParticipante", { length: 255 }).notNull(),
  emailParticipante: varchar("emailParticipante", { length: 320 }).notNull(),
  telefoneParticipante: varchar("telefoneParticipante", { length: 20 }),
  valorPago: int("valorPago").default(0).notNull(),
  statusPagamento: mysqlEnum("statusPagamento", ["pendente", "pago", "cancelado"]).default("pendente").notNull(),
  dataPagamento: timestamp("dataPagamento"),
  presente: boolean("presente").default(false).notNull(),
  certificadoEmitido: boolean("certificadoEmitido").default(false).notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InscricaoEvento = typeof inscricoesEventos.$inferSelect;
export type InsertInscricaoEvento = typeof inscricoesEventos.$inferInsert;