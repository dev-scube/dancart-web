import "dotenv/config";
import * as db from "../server/db";
import * as dbExtended from "../server/db-extended";

console.log("🌱 Iniciando seed de dados mock...");

async function seed() {
  try {
    // Garantir que o banco de dados está conectado
    const database = await db.getDb();
    if (!database) {
      throw new Error("Não foi possível conectar ao banco de dados. Verifique DATABASE_URL no arquivo .env");
    }
    
    // Criar usuário admin para testes
    console.log("👨‍💼 Criando usuário admin...");
    try {
      await db.upsertUser({
        openId: "admin-dev",
        name: "Admin DançArt",
        email: "admin@dancart.com",
        loginMethod: "dev",
        role: "admin",
      });
    } catch (error) {
      console.log("⚠️  Usuário admin já existe ou erro ao criar:", error);
    }
    
    // Criar bailarinos
    console.log("👤 Criando bailarinos...");
    const bailarinoIds = [];
    
    const bailarinosData = [
      {
        nome: "Aluno Exemplo",
        dataNascimento: new Date("2010-05-15"),
        email: "aluno@exemplo.com",
        telefone: "(31) 98765-0000",
        endereco: "Rua Exemplo, 100",
        cidade: "Ouro Branco",
        estado: "MG",
        cep: "36420-000",
        nomeResponsavel: "Responsável Exemplo",
        telefoneResponsavel: "(31) 98765-0001",
        emailResponsavel: "responsavel@exemplo.com",
        tipoSanguineo: "A+",
      },
      {
        nome: "Ana Silva",
        dataNascimento: new Date("2010-05-15"),
        email: "ana.silva@email.com",
        telefone: "(31) 98765-4321",
        endereco: "Rua das Flores, 123",
        cidade: "Ouro Branco",
        estado: "MG",
        cep: "36420-000",
        nomeResponsavel: "Maria Silva",
        telefoneResponsavel: "(31) 98765-4322",
        emailResponsavel: "maria.silva@email.com",
        tipoSanguineo: "O+",
      },
      {
        nome: "Pedro Santos",
        dataNascimento: new Date("2012-08-20"),
        email: "pedro.santos@email.com",
        telefone: "(31) 98765-1234",
        endereco: "Av. Principal, 456",
        cidade: "Ouro Branco",
        estado: "MG",
        cep: "36420-000",
        nomeResponsavel: "João Santos",
        telefoneResponsavel: "(31) 98765-1235",
        tipoSanguineo: "A+",
      },
      {
        nome: "Julia Oliveira",
        dataNascimento: new Date("2008-03-10"),
        email: "julia.oliveira@email.com",
        telefone: "(31) 98765-5678",
        endereco: "Rua do Comércio, 789",
        cidade: "Ouro Branco",
        estado: "MG",
        cep: "36420-000",
        tipoSanguineo: "B+",
      },
      {
        nome: "Lucas Ferreira",
        dataNascimento: new Date("2011-11-25"),
        email: "lucas.ferreira@email.com",
        telefone: "(31) 98765-9012",
        endereco: "Praça Central, 321",
        cidade: "Ouro Branco",
        estado: "MG",
        cep: "36420-000",
        nomeResponsavel: "Carla Ferreira",
        telefoneResponsavel: "(31) 98765-9013",
        tipoSanguineo: "AB+",
      },
      {
        nome: "Beatriz Costa",
        dataNascimento: new Date("2009-07-18"),
        email: "beatriz.costa@email.com",
        telefone: "(31) 98765-3456",
        endereco: "Rua Nova, 654",
        cidade: "Ouro Branco",
        estado: "MG",
        cep: "36420-000",
        tipoSanguineo: "O-",
      },
    ];

    for (const bailarino of bailarinosData) {
      const id = await db.createBailarino(bailarino);
      bailarinoIds.push(id);
    }

    // Criar cursos
    console.log("📚 Criando cursos...");
    const cursoIds = [];
    
    const cursosData = [
      {
        nome: "Ballet Clássico Infantil",
        descricao: "Curso de ballet clássico para crianças de 6 a 10 anos",
        modalidade: "Ballet",
        nivel: "iniciante",
        faixaEtaria: "6-10 anos",
        valorMensal: 15000,
        diasSemana: "Segunda e Quarta",
        horario: "14:00 - 15:30",
        vagasTotal: 20,
        vagasOcupadas: 5,
        professorNome: "Profª. Mariana Costa",
      },
      {
        nome: "Jazz Juvenil",
        descricao: "Aulas de jazz para jovens de 11 a 16 anos",
        modalidade: "Jazz",
        nivel: "intermediario",
        faixaEtaria: "11-16 anos",
        valorMensal: 18000,
        diasSemana: "Terça e Quinta",
        horario: "16:00 - 17:30",
        vagasTotal: 15,
        vagasOcupadas: 3,
        professorNome: "Prof. Carlos Mendes",
      },
      {
        nome: "Dança Contemporânea",
        descricao: "Expressão corporal e técnicas contemporâneas",
        modalidade: "Contemporâneo",
        nivel: "avancado",
        faixaEtaria: "14+ anos",
        valorMensal: 20000,
        diasSemana: "Segunda e Sexta",
        horario: "18:00 - 19:30",
        vagasTotal: 12,
        vagasOcupadas: 2,
        professorNome: "Profª. Ana Paula",
      },
      {
        nome: "Hip Hop Kids",
        descricao: "Hip hop e street dance para crianças",
        modalidade: "Hip Hop",
        nivel: "iniciante",
        faixaEtaria: "8-12 anos",
        valorMensal: 16000,
        diasSemana: "Quarta e Sexta",
        horario: "15:00 - 16:30",
        vagasTotal: 18,
        vagasOcupadas: 0,
        professorNome: "Prof. Ricardo Lima",
      },
    ];

    for (const curso of cursosData) {
      const id = await db.createCurso(curso);
      cursoIds.push(id);
    }

    // Criar matrículas
    console.log("📝 Criando matrículas...");
    const matriculaIds = [];
    
    const matriculasData = [
      { bailarinoId: bailarinoIds[0], cursoId: cursoIds[0], tipoBolsa: "parcial" as const, percentualBolsa: 25, valorMensalComDesconto: 11250 },
      { bailarinoId: bailarinoIds[0], cursoId: cursoIds[2], tipoBolsa: "nenhuma" as const, percentualBolsa: 0, valorMensalComDesconto: 20000 },
      { bailarinoId: bailarinoIds[1], cursoId: cursoIds[0], tipoBolsa: "nenhuma" as const, percentualBolsa: 0, valorMensalComDesconto: 15000 },
      { bailarinoId: bailarinoIds[2], cursoId: cursoIds[1], tipoBolsa: "parcial" as const, percentualBolsa: 30, valorMensalComDesconto: 12600 },
      { bailarinoId: bailarinoIds[3], cursoId: cursoIds[2], tipoBolsa: "nenhuma" as const, percentualBolsa: 0, valorMensalComDesconto: 20000 },
      { bailarinoId: bailarinoIds[4], cursoId: cursoIds[0], tipoBolsa: "integral" as const, percentualBolsa: 100, valorMensalComDesconto: 0 },
      { bailarinoId: bailarinoIds[5], cursoId: cursoIds[1], tipoBolsa: "parcial" as const, percentualBolsa: 50, valorMensalComDesconto: 9000 },
    ];

    for (const matricula of matriculasData) {
      const id = await db.createMatricula({
        ...matricula,
        dataInicio: new Date("2025-01-01"),
      });
      matriculaIds.push(id);
    }

    // Criar mensalidades
    console.log("💰 Criando mensalidades...");
    const meses = [
      new Date("2024-11-01"), 
      new Date("2024-12-01"), 
      new Date("2025-01-01"), 
      new Date("2025-02-01"), 
      new Date("2025-03-01")
    ];
    
    for (let i = 0; i < matriculaIds.length; i++) {
      const matriculaId = matriculaIds[i];
      const matricula = matriculasData[i];
      
      for (let j = 0; j < meses.length; j++) {
        const mesRef = meses[j];
        const vencimento = new Date(mesRef);
        vencimento.setDate(10);
        
        const mensalidadeId = await db.createMensalidade({
          matriculaId,
          mesReferencia: mesRef,
          valorOriginal: matricula.valorMensalComDesconto,
          dataVencimento: vencimento,
        });
        
        // Marcar mensalidades antigas como pagas para o aluno exemplo (primeiras 2 matrículas)
        if (i < 2 && j < 3) {
          const dataPagamento = new Date(vencimento);
          dataPagamento.setDate(vencimento.getDate() - 2); // Pago 2 dias antes do vencimento
          
          await db.updateMensalidade(mensalidadeId, {
            status: "paga",
            dataPagamento,
            valorPago: matricula.valorMensalComDesconto,
            metodoPagamento: j % 2 === 0 ? "Cartão de Crédito" : "PIX",
          });
        }
        // Marcar uma mensalidade como atrasada
        else if (i < 2 && j === 3) {
          await db.updateMensalidade(mensalidadeId, {
            status: "atrasada",
          });
        }
      }
    }

    // Criar agendamentos
    console.log("📅 Criando agendamentos...");
    const agendamentosData = [
      {
        nome: "Camila Rodrigues",
        email: "camila.rodrigues@email.com",
        telefone: "(31) 99876-5432",
        modalidade: "Ballet",
        dataPreferencia: new Date("2025-01-15"),
        horarioPreferencia: "14:00",
        status: "confirmado" as const,
      },
      {
        nome: "Rafael Alves",
        email: "rafael.alves@email.com",
        telefone: "(31) 99876-1234",
        modalidade: "Hip Hop",
        dataPreferencia: new Date("2025-01-18"),
        horarioPreferencia: "16:00",
        status: "pendente" as const,
      },
      {
        nome: "Larissa Martins",
        email: "larissa.martins@email.com",
        telefone: "(31) 99876-9876",
        modalidade: "Jazz",
        dataPreferencia: new Date("2025-01-20"),
        horarioPreferencia: "15:00",
        status: "pendente" as const,
      },
    ];

    for (const agendamento of agendamentosData) {
      await dbExtended.createAgendamento(agendamento);
    }

    // Criar depoimentos
    console.log("💬 Criando depoimentos...");
    const depoimentosData = [
      {
        nome: "Mariana Silva",
        modalidade: "Ballet",
        avaliacao: 5,
        depoimento: "A DançArt transformou a vida da minha filha! Ela ama as aulas de ballet e evoluiu muito em poucos meses. Professores excelentes!",
        aprovado: true,
      },
      {
        nome: "Roberto Santos",
        modalidade: "Hip Hop",
        avaliacao: 5,
        depoimento: "Meu filho está muito mais confiante e disciplinado depois que começou as aulas de hip hop. Recomendo muito!",
        aprovado: true,
      },
      {
        nome: "Patricia Costa",
        modalidade: "Jazz",
        avaliacao: 4,
        depoimento: "Ótima escola, ambiente acolhedor e professores dedicados. Estou muito satisfeita com o desenvolvimento da minha filha.",
        aprovado: true,
      },
    ];

    for (const depoimento of depoimentosData) {
      await dbExtended.createDepoimento(depoimento);
    }

    // Criar eventos
    console.log("🎭 Criando eventos...");
    const eventosData = [
      {
        titulo: "Festival de Dança DançArt 2025",
        descricao: "Grande festival anual com apresentações de todas as turmas e convidados especiais",
        tipo: "festival" as const,
        dataEvento: new Date("2025-03-15T19:00:00"),
        local: "Teatro Municipal de Ouro Branco",
        valorInscricao: 0,
        vagasTotal: 200,
        vagasOcupadas: 45,
        inscricoesAbertas: true,
      },
      {
        titulo: "Competição Regional de Ballet",
        descricao: "Competição de ballet clássico para alunos de todas as idades",
        tipo: "competicao" as const,
        dataEvento: new Date("2025-04-20T14:00:00"),
        local: "Centro Cultural",
        valorInscricao: 5000,
        vagasTotal: 50,
        vagasOcupadas: 12,
        inscricoesAbertas: true,
      },
      {
        titulo: "Workshop de Hip Hop com DJ Malboro",
        descricao: "Workshop especial com o renomado dançarino e coreógrafo DJ Malboro",
        tipo: "workshop" as const,
        dataEvento: new Date("2025-02-28T15:00:00"),
        local: "Estúdio DançArt",
        valorInscricao: 8000,
        vagasTotal: 30,
        vagasOcupadas: 28,
        inscricoesAbertas: true,
      },
    ];

    for (const evento of eventosData) {
      await dbExtended.createEvento(evento);
    }

    console.log("✅ Seed de dados mock concluído com sucesso!");
    console.log(`
📊 Resumo:
- ${bailarinosData.length} bailarinos
- ${cursosData.length} cursos
- ${matriculasData.length} matrículas
- ${matriculasData.length * meses.length} mensalidades
- ${agendamentosData.length} agendamentos
- ${depoimentosData.length} depoimentos
- ${eventosData.length} eventos
`);
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  }
}

seed();
