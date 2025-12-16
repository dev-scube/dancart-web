import { pgTable, serial, varchar, text, timestamp, boolean, date, integer, pgEnum } from "drizzle-orm/pg-core";

// Define enums first
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const nivelEnum = pgEnum("nivel", ["iniciante", "intermediario", "avancado"]);
export const tipoBolsaEnum = pgEnum("tipoBolsa", ["nenhuma", "parcial", "integral"]);
export const matriculaStatusEnum = pgEnum("matriculaStatus", ["ativa", "cancelada", "concluida", "suspensa"]);
export const mensalidadeStatusEnum = pgEnum("mensalidadeStatus", ["pendente", "paga", "atrasada", "cancelada"]);
export const agendamentoStatusEnum = pgEnum("agendamentoStatus", ["pendente", "confirmado", "realizado", "cancelado"]);
export const eventoTipoEnum = pgEnum("eventoTipo", ["festival", "competicao", "apresentacao", "workshop"]);
export const statusPagamentoEnum = pgEnum("statusPagamento", ["pendente", "pago", "cancelado"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Bailarinos (dancers) table
 */
export const bailarinos = pgTable("bailarinos", {
  id: serial("id").primaryKey(),
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Bailarino = typeof bailarinos.$inferSelect;
export type InsertBailarino = typeof bailarinos.$inferInsert;

/**
 * Cursos (courses) table
 */
export const cursos = pgTable("cursos", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  modalidade: varchar("modalidade", { length: 100 }).notNull(), // Ballet, Jazz, Contemporâneo, etc
  nivel: nivelEnum("nivel").notNull(),
  faixaEtaria: varchar("faixaEtaria", { length: 50 }), // Ex: "4-10 anos"
  
  // Horários
  diasSemana: varchar("diasSemana", { length: 100 }), // Ex: "Segunda, Quarta, Sexta"
  horario: varchar("horario", { length: 50 }), // Ex: "14:00 - 15:30"
  duracaoAula: integer("duracaoAula"), // Em minutos
  
  // Valores
  valorMensal: integer("valorMensal").notNull(), // Em centavos
  vagasTotal: integer("vagasTotal").notNull(),
  vagasOcupadas: integer("vagasOcupadas").default(0).notNull(),
  
  // Status
  ativo: boolean("ativo").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Curso = typeof cursos.$inferSelect;
export type InsertCurso = typeof cursos.$inferInsert;

/**
 * Matrículas (enrollments) table
 */
export const matriculas = pgTable("matriculas", {
  id: serial("id").primaryKey(),
  bailarinoId: integer("bailarinoId").notNull(),
  cursoId: integer("cursoId").notNull(),
  
  dataMatricula: timestamp("dataMatricula").defaultNow().notNull(),
  dataInicio: date("dataInicio").notNull(),
  dataFim: date("dataFim"),
  
  // Bolsa
  tipoBolsa: tipoBolsaEnum("tipoBolsa").default("nenhuma").notNull(),
  percentualBolsa: integer("percentualBolsa").default(0).notNull(), // 0-100
  valorMensalComDesconto: integer("valorMensalComDesconto").notNull(), // Em centavos
  
  // Status
  status: matriculaStatusEnum("status").default("ativa").notNull(),
  motivoCancelamento: text("motivoCancelamento"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Matricula = typeof matriculas.$inferSelect;
export type InsertMatricula = typeof matriculas.$inferInsert;

/**
 * Mensalidades (monthly payments) table
 */
export const mensalidades = pgTable("mensalidades", {
  id: serial("id").primaryKey(),
  matriculaId: integer("matriculaId").notNull(),
  
  mesReferencia: date("mesReferencia").notNull(), // Primeiro dia do mês
  valorOriginal: integer("valorOriginal").notNull(), // Em centavos
  valorPago: integer("valorPago").default(0).notNull(), // Em centavos
  
  dataVencimento: date("dataVencimento").notNull(),
  dataPagamento: timestamp("dataPagamento"),
  
  status: mensalidadeStatusEnum("status").default("pendente").notNull(),
  formaPagamento: varchar("formaPagamento", { length: 50 }), // Dinheiro, PIX, Cartão, etc
  
  observacoes: text("observacoes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Mensalidade = typeof mensalidades.$inferSelect;
export type InsertMensalidade = typeof mensalidades.$inferInsert;

/**
 * Agendamentos de aulas experimentais
 */
export const agendamentos = pgTable("agendamentos", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  modalidade: varchar("modalidade", { length: 100 }).notNull(),
  dataPreferencia: date("dataPreferencia").notNull(),
  horarioPreferencia: varchar("horarioPreferencia", { length: 50 }),
  idade: integer("idade"),
  mensagem: text("mensagem"),
  status: agendamentoStatusEnum("status").default("pendente").notNull(),
  dataConfirmacao: timestamp("dataConfirmacao"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Agendamento = typeof agendamentos.$inferSelect;
export type InsertAgendamento = typeof agendamentos.$inferInsert;

/**
 * Depoimentos
 */
export const depoimentos = pgTable("depoimentos", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  fotoUrl: text("fotoUrl"),
  modalidade: varchar("modalidade", { length: 100 }),
  avaliacao: integer("avaliacao").notNull(), // 1-5 estrelas
  depoimento: text("depoimento").notNull(),
  aprovado: boolean("aprovado").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Depoimento = typeof depoimentos.$inferSelect;
export type InsertDepoimento = typeof depoimentos.$inferInsert;

/**
 * Eventos
 */
export const eventos = pgTable("eventos", {
  id: serial("id").primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  tipo: eventoTipoEnum("tipo").notNull(),
  dataEvento: timestamp("dataEvento").notNull(),
  local: varchar("local", { length: 255 }),
  endereco: text("endereco"),
  valorInscricao: integer("valorInscricao").default(0).notNull(), // em centavos
  vagasTotal: integer("vagasTotal"),
  vagasOcupadas: integer("vagasOcupadas").default(0).notNull(),
  imagemUrl: text("imagemUrl"),
  inscricoesAbertas: boolean("inscricoesAbertas").default(true).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Evento = typeof eventos.$inferSelect;
export type InsertEvento = typeof eventos.$inferInsert;

/**
 * Inscrições em eventos
 */
export const inscricoesEventos = pgTable("inscricoesEventos", {
  id: serial("id").primaryKey(),
  eventoId: integer("eventoId").notNull(),
  bailarinoId: integer("bailarinoId"),
  nomeParticipante: varchar("nomeParticipante", { length: 255 }).notNull(),
  emailParticipante: varchar("emailParticipante", { length: 320 }).notNull(),
  telefoneParticipante: varchar("telefoneParticipante", { length: 20 }),
  valorPago: integer("valorPago").default(0).notNull(),
  statusPagamento: statusPagamentoEnum("statusPagamento").default("pendente").notNull(),
  dataPagamento: timestamp("dataPagamento"),
  presente: boolean("presente").default(false).notNull(),
  certificadoEmitido: boolean("certificadoEmitido").default(false).notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type InscricaoEvento = typeof inscricoesEventos.$inferSelect;
export type InsertInscricaoEvento = typeof inscricoesEventos.$inferInsert;
