import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as dbExt from "./db-extended";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie("dev-admin");
      return {
        success: true,
      } as const;
    }),
    devLogin: publicProcedure.mutation(({ ctx }) => {
      if (process.env.NODE_ENV !== "development") {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Dev login only available in development mode' });
      }
      ctx.res.cookie("dev-admin", "true", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      });
      return { success: true };
    }),
  }),

  // Bailarinos management
  bailarinos: router({
    list: publicProcedure.query(async () => {
      return await db.getAllBailarinos();
    }),
    
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getBailarinoById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        nome: z.string(),
        dataNascimento: z.string(),
        cpf: z.string().optional(),
        rg: z.string().optional(),
        telefone: z.string().optional(),
        email: z.string().email().optional(),
        endereco: z.string().optional(),
        cidade: z.string().optional(),
        estado: z.string().optional(),
        cep: z.string().optional(),
        nomeResponsavel: z.string().optional(),
        telefoneResponsavel: z.string().optional(),
        emailResponsavel: z.string().email().optional(),
        tipoSanguineo: z.string().optional(),
        alergiasRestricoes: z.string().optional(),
        contatoEmergencia: z.string().optional(),
        telefoneEmergencia: z.string().optional(),
        fotoUrl: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createBailarino({
          ...input,
          dataNascimento: new Date(input.dataNascimento),
        });
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          nome: z.string().optional(),
          dataNascimento: z.string().optional(),
          cpf: z.string().optional(),
          rg: z.string().optional(),
          telefone: z.string().optional(),
          email: z.string().email().optional(),
          endereco: z.string().optional(),
          cidade: z.string().optional(),
          estado: z.string().optional(),
          cep: z.string().optional(),
          nomeResponsavel: z.string().optional(),
          telefoneResponsavel: z.string().optional(),
          emailResponsavel: z.string().email().optional(),
          tipoSanguineo: z.string().optional(),
          alergiasRestricoes: z.string().optional(),
          contatoEmergencia: z.string().optional(),
          telefoneEmergencia: z.string().optional(),
          fotoUrl: z.string().optional(),
          ativo: z.boolean().optional(),
          observacoes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const updateData: any = { ...input.data };
        if (input.data.dataNascimento) {
          updateData.dataNascimento = new Date(input.data.dataNascimento);
        }
        await db.updateBailarino(input.id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteBailarino(input.id);
        return { success: true };
      }),
    
    getByEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        const bailarinos = await db.getAllBailarinos();
        return bailarinos.find((b) => b.email === input.email);
      }),
  }),

  // Cursos management
  cursos: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCursos();
    }),
    
    listPublic: publicProcedure.query(async () => {
      const cursos = await db.getAllCursos();
      return cursos.filter(c => c.ativo);
    }),
    
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCursoById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        nome: z.string(),
        descricao: z.string().optional(),
        modalidade: z.string(),
        nivel: z.enum(["iniciante", "intermediario", "avancado"]),
        faixaEtaria: z.string().optional(),
        diasSemana: z.string().optional(),
        horario: z.string().optional(),
        duracaoAula: z.number().optional(),
        valorMensal: z.number(),
        vagasTotal: z.number(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createCurso(input);
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          nome: z.string().optional(),
          descricao: z.string().optional(),
          modalidade: z.string().optional(),
          nivel: z.enum(["iniciante", "intermediario", "avancado"]).optional(),
          faixaEtaria: z.string().optional(),
          diasSemana: z.string().optional(),
          horario: z.string().optional(),
          duracaoAula: z.number().optional(),
          valorMensal: z.number().optional(),
          vagasTotal: z.number().optional(),
          vagasOcupadas: z.number().optional(),
          ativo: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateCurso(input.id, input.data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCurso(input.id);
        return { success: true };
      }),
  }),

  // Matriculas management
  matriculas: router({
    list: publicProcedure.query(async () => {
      return await db.getAllMatriculas();
    }),
    
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMatriculaById(input.id);
      }),
    
    getByBailarinoId: publicProcedure
      .input(z.object({ bailarinoId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMatriculasByBailarinoId(input.bailarinoId);
      }),
    
    getByCursoId: adminProcedure
      .input(z.object({ cursoId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMatriculasByCursoId(input.cursoId);
      }),
    
    create: adminProcedure
      .input(z.object({
        bailarinoId: z.number(),
        cursoId: z.number(),
        dataInicio: z.string(),
        dataFim: z.string().optional(),
        tipoBolsa: z.enum(["nenhuma", "parcial", "integral"]),
        percentualBolsa: z.number().min(0).max(100),
        valorMensalComDesconto: z.number(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createMatricula({
          ...input,
          dataInicio: new Date(input.dataInicio),
          dataFim: input.dataFim ? new Date(input.dataFim) : undefined,
        });
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          dataInicio: z.string().optional(),
          dataFim: z.string().optional(),
          tipoBolsa: z.enum(["nenhuma", "parcial", "integral"]).optional(),
          percentualBolsa: z.number().min(0).max(100).optional(),
          valorMensalComDesconto: z.number().optional(),
          status: z.enum(["ativa", "cancelada", "concluida", "suspensa"]).optional(),
          motivoCancelamento: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const updateData: any = { ...input.data };
        if (input.data.dataInicio) {
          updateData.dataInicio = new Date(input.data.dataInicio);
        }
        if (input.data.dataFim) {
          updateData.dataFim = new Date(input.data.dataFim);
        }
        await db.updateMatricula(input.id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMatricula(input.id);
        return { success: true };
      }),
  }),

  // Mensalidades management
  mensalidades: router({
    list: adminProcedure.query(async () => {
      return await db.getAllMensalidades();
    }),
    
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMensalidadeById(input.id);
      }),
    
    getByMatriculaId: adminProcedure
      .input(z.object({ matriculaId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMensalidadesByMatriculaId(input.matriculaId);
      }),
    
    create: adminProcedure
      .input(z.object({
        matriculaId: z.number(),
        mesReferencia: z.string(),
        valorOriginal: z.number(),
        dataVencimento: z.string(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createMensalidade({
          ...input,
          mesReferencia: new Date(input.mesReferencia),
          dataVencimento: new Date(input.dataVencimento),
        });
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          valorPago: z.number().optional(),
          dataPagamento: z.string().optional(),
          status: z.enum(["pendente", "paga", "atrasada", "cancelada"]).optional(),
          formaPagamento: z.string().optional(),
          observacoes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const updateData: any = { ...input.data };
        if (input.data.dataPagamento) {
          updateData.dataPagamento = new Date(input.data.dataPagamento);
        }
        await db.updateMensalidade(input.id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMensalidade(input.id);
        return { success: true };
      }),
    
    getByMatriculaIds: publicProcedure
      .input(z.object({ matriculaIds: z.array(z.number()) }))
      .query(async ({ input }) => {
        const allMensalidades = await db.getAllMensalidades();
        return allMensalidades.filter((m) => input.matriculaIds.includes(m.matriculaId));
      }),
  }),

  // Dashboard
  dashboard: router({
    stats: publicProcedure.query(async () => {
      return await db.getDashboardStats();
    }),
    
    matriculasPorCurso: publicProcedure.query(async () => {
      return await db.getMatriculasPorCurso();
    }),
  }),

  // Agendamentos
  agendamentos: router({
    list: publicProcedure.query(async () => {
      return await dbExt.getAllAgendamentos();
    }),
    
    pendentes: publicProcedure.query(async () => {
      return await dbExt.getAgendamentosPendentes();
    }),
    
    create: publicProcedure
      .input(z.object({
        nome: z.string(),
        email: z.string().email(),
        telefone: z.string().optional(),
        modalidade: z.string(),
        dataPreferencia: z.string(),
        horarioPreferencia: z.string().optional(),
        idade: z.number().optional(),
        mensagem: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await dbExt.createAgendamento({
          ...input,
          dataPreferencia: new Date(input.dataPreferencia),
        });
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          status: z.enum(["pendente", "confirmado", "realizado", "cancelado"]).optional(),
          dataConfirmacao: z.string().optional(),
          observacoes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const updateData: any = { ...input.data };
        if (input.data.dataConfirmacao) {
          updateData.dataConfirmacao = new Date(input.data.dataConfirmacao);
        }
        await dbExt.updateAgendamento(input.id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await dbExt.deleteAgendamento(input.id);
        return { success: true };
      }),
  }),

  // Depoimentos
  depoimentos: router({
    list: publicProcedure.query(async () => {
      return await dbExt.getAllDepoimentos();
    }),
    
    aprovados: publicProcedure.query(async () => {
      return await dbExt.getDepoimentosAprovados();
    }),
    
    create: publicProcedure
      .input(z.object({
        nome: z.string(),
        fotoUrl: z.string().optional(),
        modalidade: z.string().optional(),
        avaliacao: z.number().min(1).max(5),
        depoimento: z.string(),
      }))
      .mutation(async ({ input }) => {
        const id = await dbExt.createDepoimento(input);
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          aprovado: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await dbExt.updateDepoimento(input.id, input.data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await dbExt.deleteDepoimento(input.id);
        return { success: true };
      }),
  }),

  // Eventos
  eventos: router({
    list: adminProcedure.query(async () => {
      return await dbExt.getAllEventos();
    }),
    
    ativos: publicProcedure.query(async () => {
      return await dbExt.getEventosAtivos();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await dbExt.getEventoById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        titulo: z.string(),
        descricao: z.string().optional(),
        tipo: z.enum(["festival", "competicao", "apresentacao", "workshop"]),
        dataEvento: z.string(),
        local: z.string().optional(),
        endereco: z.string().optional(),
        valorInscricao: z.number(),
        vagasTotal: z.number().optional(),
        imagemUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await dbExt.createEvento({
          ...input,
          dataEvento: new Date(input.dataEvento),
          valorInscricao: input.valorInscricao * 100,
        });
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          titulo: z.string().optional(),
          descricao: z.string().optional(),
          tipo: z.enum(["festival", "competicao", "apresentacao", "workshop"]).optional(),
          dataEvento: z.string().optional(),
          local: z.string().optional(),
          endereco: z.string().optional(),
          valorInscricao: z.number().optional(),
          vagasTotal: z.number().optional(),
          imagemUrl: z.string().optional(),
          inscricoesAbertas: z.boolean().optional(),
          ativo: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const updateData: any = { ...input.data };
        if (input.data.dataEvento) {
          updateData.dataEvento = new Date(input.data.dataEvento);
        }
        if (input.data.valorInscricao !== undefined) {
          updateData.valorInscricao = input.data.valorInscricao * 100;
        }
        await dbExt.updateEvento(input.id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await dbExt.deleteEvento(input.id);
        return { success: true };
      }),
  }),

  // Inscrições em Eventos
  inscricoesEventos: router({
    list: adminProcedure.query(async () => {
      return await dbExt.getAllInscricoesEventos();
    }),
    
    getByEventoId: adminProcedure
      .input(z.object({ eventoId: z.number() }))
      .query(async ({ input }) => {
        return await dbExt.getInscricoesByEventoId(input.eventoId);
      }),
    
    create: publicProcedure
      .input(z.object({
        eventoId: z.number(),
        nomeParticipante: z.string(),
        emailParticipante: z.string().email(),
        telefoneParticipante: z.string().optional(),
        bailarinoId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const evento = await dbExt.getEventoById(input.eventoId);
        if (!evento) throw new TRPCError({ code: 'NOT_FOUND', message: 'Evento não encontrado' });
        
        const id = await dbExt.createInscricaoEvento({
          ...input,
          valorPago: evento.valorInscricao,
        });
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          statusPagamento: z.enum(["pendente", "pago", "cancelado"]).optional(),
          dataPagamento: z.string().optional(),
          presente: z.boolean().optional(),
          certificadoEmitido: z.boolean().optional(),
          observacoes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const updateData: any = { ...input.data };
        if (input.data.dataPagamento) {
          updateData.dataPagamento = new Date(input.data.dataPagamento);
        }
        await dbExt.updateInscricaoEvento(input.id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await dbExt.deleteInscricaoEvento(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
