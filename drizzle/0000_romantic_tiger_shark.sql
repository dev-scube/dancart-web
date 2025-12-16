CREATE TYPE "public"."agendamentoStatus" AS ENUM('pendente', 'confirmado', 'realizado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."eventoTipo" AS ENUM('festival', 'competicao', 'apresentacao', 'workshop');--> statement-breakpoint
CREATE TYPE "public"."matriculaStatus" AS ENUM('ativa', 'cancelada', 'concluida', 'suspensa');--> statement-breakpoint
CREATE TYPE "public"."mensalidadeStatus" AS ENUM('pendente', 'paga', 'atrasada', 'cancelada');--> statement-breakpoint
CREATE TYPE "public"."nivel" AS ENUM('iniciante', 'intermediario', 'avancado');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."statusPagamento" AS ENUM('pendente', 'pago', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."tipoBolsa" AS ENUM('nenhuma', 'parcial', 'integral');--> statement-breakpoint
CREATE TABLE "agendamentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"telefone" varchar(20),
	"modalidade" varchar(100) NOT NULL,
	"dataPreferencia" date NOT NULL,
	"horarioPreferencia" varchar(50),
	"idade" integer,
	"mensagem" text,
	"status" "agendamentoStatus" DEFAULT 'pendente' NOT NULL,
	"dataConfirmacao" timestamp,
	"observacoes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bailarinos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"dataNascimento" date NOT NULL,
	"cpf" varchar(14),
	"rg" varchar(20),
	"telefone" varchar(20),
	"email" varchar(320),
	"endereco" text,
	"cidade" varchar(100),
	"estado" varchar(2),
	"cep" varchar(10),
	"nomeResponsavel" varchar(255),
	"telefoneResponsavel" varchar(20),
	"emailResponsavel" varchar(320),
	"tipoSanguineo" varchar(5),
	"alergiasRestricoes" text,
	"contatoEmergencia" varchar(255),
	"telefoneEmergencia" varchar(20),
	"fotoUrl" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"observacoes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cursos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"descricao" text,
	"modalidade" varchar(100) NOT NULL,
	"nivel" "nivel" NOT NULL,
	"faixaEtaria" varchar(50),
	"diasSemana" varchar(100),
	"horario" varchar(50),
	"duracaoAula" integer,
	"valorMensal" integer NOT NULL,
	"vagasTotal" integer NOT NULL,
	"vagasOcupadas" integer DEFAULT 0 NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "depoimentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"fotoUrl" text,
	"modalidade" varchar(100),
	"avaliacao" integer NOT NULL,
	"depoimento" text NOT NULL,
	"aprovado" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" varchar(255) NOT NULL,
	"descricao" text,
	"tipo" "eventoTipo" NOT NULL,
	"dataEvento" timestamp NOT NULL,
	"local" varchar(255),
	"endereco" text,
	"valorInscricao" integer DEFAULT 0 NOT NULL,
	"vagasTotal" integer,
	"vagasOcupadas" integer DEFAULT 0 NOT NULL,
	"imagemUrl" text,
	"inscricoesAbertas" boolean DEFAULT true NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inscricoesEventos" (
	"id" serial PRIMARY KEY NOT NULL,
	"eventoId" integer NOT NULL,
	"bailarinoId" integer,
	"nomeParticipante" varchar(255) NOT NULL,
	"emailParticipante" varchar(320) NOT NULL,
	"telefoneParticipante" varchar(20),
	"valorPago" integer DEFAULT 0 NOT NULL,
	"statusPagamento" "statusPagamento" DEFAULT 'pendente' NOT NULL,
	"dataPagamento" timestamp,
	"presente" boolean DEFAULT false NOT NULL,
	"certificadoEmitido" boolean DEFAULT false NOT NULL,
	"observacoes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matriculas" (
	"id" serial PRIMARY KEY NOT NULL,
	"bailarinoId" integer NOT NULL,
	"cursoId" integer NOT NULL,
	"dataMatricula" timestamp DEFAULT now() NOT NULL,
	"dataInicio" date NOT NULL,
	"dataFim" date,
	"tipoBolsa" "tipoBolsa" DEFAULT 'nenhuma' NOT NULL,
	"percentualBolsa" integer DEFAULT 0 NOT NULL,
	"valorMensalComDesconto" integer NOT NULL,
	"status" "matriculaStatus" DEFAULT 'ativa' NOT NULL,
	"motivoCancelamento" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mensalidades" (
	"id" serial PRIMARY KEY NOT NULL,
	"matriculaId" integer NOT NULL,
	"mesReferencia" date NOT NULL,
	"valorOriginal" integer NOT NULL,
	"valorPago" integer DEFAULT 0 NOT NULL,
	"dataVencimento" date NOT NULL,
	"dataPagamento" timestamp,
	"status" "mensalidadeStatus" DEFAULT 'pendente' NOT NULL,
	"formaPagamento" varchar(50),
	"observacoes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
