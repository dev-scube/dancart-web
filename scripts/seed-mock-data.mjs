import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, "../.data/sqlite.db");

const db = new Database(dbPath);

console.log("🌱 Iniciando seed de dados mock...");

// Limpar dados existentes
console.log("🧹 Limpando dados existentes...");
db.exec(`
  DELETE FROM inscricoesEventos;
  DELETE FROM eventos;
  DELETE FROM depoimentos;
  DELETE FROM agendamentos;
  DELETE FROM mensalidades;
  DELETE FROM matriculas;
  DELETE FROM cursos;
  DELETE FROM bailarinos;
`);

// Inserir bailarinos
console.log("👤 Criando bailarinos...");
const bailarinos = [
  {
    nome: "Ana Silva",
    dataNascimento: "2010-05-15",
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
    dataNascimento: "2012-08-20",
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
    dataNascimento: "2008-03-10",
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
    dataNascimento: "2011-11-25",
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
    dataNascimento: "2009-07-18",
    email: "beatriz.costa@email.com",
    telefone: "(31) 98765-3456",
    endereco: "Rua Nova, 654",
    cidade: "Ouro Branco",
    estado: "MG",
    cep: "36420-000",
    tipoSanguineo: "O-",
  },
];

const bailarinoIds = [];
for (const bailarino of bailarinos) {
  const result = db.prepare(`
    INSERT INTO bailarinos (
      nome, dataNascimento, cpf, rg, telefone, email, endereco, cidade, estado, cep,
      nomeResponsavel, telefoneResponsavel, emailResponsavel, tipoSanguineo,
      alergiasRestricoes, contatoEmergencia, telefoneEmergencia, fotoUrl, observacoes, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    bailarino.nome,
    bailarino.dataNascimento,
    bailarino.cpf || null,
    bailarino.rg || null,
    bailarino.telefone,
    bailarino.email,
    bailarino.endereco,
    bailarino.cidade,
    bailarino.estado,
    bailarino.cep,
    bailarino.nomeResponsavel || null,
    bailarino.telefoneResponsavel || null,
    bailarino.emailResponsavel || null,
    bailarino.tipoSanguineo,
    bailarino.alergiasRestricoes || null,
    bailarino.contatoEmergencia || null,
    bailarino.telefoneEmergencia || null,
    bailarino.fotoUrl || null,
    bailarino.observacoes || null
  );
  bailarinoIds.push(result.lastInsertRowid);
}

// Inserir cursos
console.log("📚 Criando cursos...");
const cursos = [
  {
    nome: "Ballet Clássico Infantil",
    descricao: "Curso de ballet clássico para crianças de 6 a 10 anos",
    modalidade: "Ballet",
    nivel: "Iniciante",
    faixaEtaria: "6-10 anos",
    valorMensal: 15000, // R$ 150,00
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
    nivel: "Intermediário",
    faixaEtaria: "11-16 anos",
    valorMensal: 18000, // R$ 180,00
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
    nivel: "Todos os níveis",
    faixaEtaria: "14+ anos",
    valorMensal: 20000, // R$ 200,00
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
    nivel: "Iniciante",
    faixaEtaria: "8-12 anos",
    valorMensal: 16000, // R$ 160,00
    diasSemana: "Quarta e Sexta",
    horario: "15:00 - 16:30",
    vagasTotal: 18,
    vagasOcupadas: 0,
    professorNome: "Prof. Ricardo Lima",
  },
];

const cursoIds = [];
for (const curso of cursos) {
  const result = db.prepare(`
    INSERT INTO cursos (
      nome, descricao, modalidade, nivel, faixaEtaria, valorMensal, diasSemana,
      horario, vagasTotal, vagasOcupadas, professorNome, professorContato,
      dataInicio, dataFim, status, observacoes, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    curso.nome,
    curso.descricao,
    curso.modalidade,
    curso.nivel,
    curso.faixaEtaria,
    curso.valorMensal,
    curso.diasSemana,
    curso.horario,
    curso.vagasTotal,
    curso.vagasOcupadas,
    curso.professorNome,
    curso.professorContato || null,
    curso.dataInicio || null,
    curso.dataFim || null,
    curso.status || "ativo",
    curso.observacoes || null
  );
  cursoIds.push(result.lastInsertRowid);
}

// Inserir matrículas
console.log("📝 Criando matrículas...");
const matriculas = [
  { bailarinoId: bailarinoIds[0], cursoId: cursoIds[0], tipoBolsa: "nenhuma", percentualBolsa: 0, valorMensalComDesconto: 15000 },
  { bailarinoId: bailarinoIds[1], cursoId: cursoIds[1], tipoBolsa: "parcial", percentualBolsa: 30, valorMensalComDesconto: 12600 },
  { bailarinoId: bailarinoIds[2], cursoId: cursoIds[2], tipoBolsa: "nenhuma", percentualBolsa: 0, valorMensalComDesconto: 20000 },
  { bailarinoId: bailarinoIds[3], cursoId: cursoIds[0], tipoBolsa: "integral", percentualBolsa: 100, valorMensalComDesconto: 0 },
  { bailarinoId: bailarinoIds[4], cursoId: cursoIds[1], tipoBolsa: "parcial", percentualBolsa: 50, valorMensalComDesconto: 9000 },
];

const matriculaIds = [];
for (const matricula of matriculas) {
  const result = db.prepare(`
    INSERT INTO matriculas (
      bailarinoId, cursoId, dataInicio, dataFim, tipoBolsa, percentualBolsa,
      valorMensalComDesconto, status, motivoCancelamento, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    matricula.bailarinoId,
    matricula.cursoId,
    "2025-01-01",
    null,
    matricula.tipoBolsa,
    matricula.percentualBolsa,
    matricula.valorMensalComDesconto,
    "ativa",
    null
  );
  matriculaIds.push(result.lastInsertRowid);
}

// Inserir mensalidades
console.log("💰 Criando mensalidades...");
const meses = ["2025-01-01", "2025-02-01", "2025-03-01"];
for (const matriculaId of matriculaIds) {
  const matricula = matriculas[matriculaIds.indexOf(matriculaId)];
  
  for (let i = 0; i < meses.length; i++) {
    const mesRef = meses[i];
    const vencimento = new Date(mesRef);
    vencimento.setDate(10); // Vencimento dia 10
    
    let status = "pendente";
    let dataPagamento = null;
    let valorPago = null;
    
    if (i === 0) { // Primeiro mês pago
      status = "paga";
      dataPagamento = new Date(mesRef);
      dataPagamento.setDate(8);
      valorPago = matricula.valorMensalComDesconto;
    } else if (i === 1 && Math.random() > 0.5) { // Segundo mês 50% chance de pago
      status = "paga";
      dataPagamento = new Date(mesRef);
      dataPagamento.setDate(9);
      valorPago = matricula.valorMensalComDesconto;
    }
    
    db.prepare(`
      INSERT INTO mensalidades (
        matriculaId, mesReferencia, valorOriginal, valorPago, dataVencimento,
        dataPagamento, status, formaPagamento, observacoes, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      matriculaId,
      mesRef,
      matricula.valorMensalComDesconto,
      valorPago,
      vencimento.toISOString(),
      dataPagamento ? dataPagamento.toISOString() : null,
      status,
      status === "paga" ? "Pix" : null,
      null
    );
  }
}

// Inserir agendamentos
console.log("📅 Criando agendamentos...");
const agendamentos = [
  {
    nome: "Camila Rodrigues",
    email: "camila.rodrigues@email.com",
    telefone: "(31) 99876-5432",
    modalidade: "Ballet",
    dataPreferencia: "2025-01-15",
    horarioPreferencia: "14:00",
    status: "confirmado",
  },
  {
    nome: "Rafael Alves",
    email: "rafael.alves@email.com",
    telefone: "(31) 99876-1234",
    modalidade: "Hip Hop",
    dataPreferencia: "2025-01-18",
    horarioPreferencia: "16:00",
    status: "pendente",
  },
  {
    nome: "Larissa Martins",
    email: "larissa.martins@email.com",
    telefone: "(31) 99876-9876",
    modalidade: "Jazz",
    dataPreferencia: "2025-01-20",
    horarioPreferencia: "15:00",
    status: "pendente",
  },
];

for (const agendamento of agendamentos) {
  db.prepare(`
    INSERT INTO agendamentos (
      nome, email, telefone, modalidade, dataPreferencia, horarioPreferencia,
      status, dataConfirmacao, observacoes, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    agendamento.nome,
    agendamento.email,
    agendamento.telefone,
    agendamento.modalidade,
    agendamento.dataPreferencia,
    agendamento.horarioPreferencia,
    agendamento.status,
    agendamento.status === "confirmado" ? new Date().toISOString() : null,
    null
  );
}

// Inserir depoimentos
console.log("💬 Criando depoimentos...");
const depoimentos = [
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
  {
    nome: "Fernando Lima",
    modalidade: "Contemporâneo",
    avaliacao: 5,
    depoimento: "A DançArt é incrível! As aulas de dança contemporânea me ajudaram muito na expressão corporal e autoconhecimento.",
    aprovado: false,
  },
];

for (const depoimento of depoimentos) {
  db.prepare(`
    INSERT INTO depoimentos (
      nome, modalidade, avaliacao, depoimento, fotoUrl, aprovado, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    depoimento.nome,
    depoimento.modalidade,
    depoimento.avaliacao,
    depoimento.depoimento,
    null,
    depoimento.aprovado ? 1 : 0
  );
}

// Inserir eventos
console.log("🎭 Criando eventos...");
const eventos = [
  {
    titulo: "Festival de Dança DançArt 2025",
    descricao: "Grande festival anual com apresentações de todas as turmas e convidados especiais",
    tipo: "festival",
    dataEvento: "2025-03-15T19:00:00",
    local: "Teatro Municipal de Ouro Branco",
    valorInscricao: 0,
    vagasTotal: 200,
    vagasOcupadas: 45,
    inscricoesAbertas: true,
  },
  {
    titulo: "Competição Regional de Ballet",
    descricao: "Competição de ballet clássico para alunos de todas as idades",
    tipo: "competicao",
    dataEvento: "2025-04-20T14:00:00",
    local: "Centro Cultural",
    valorInscricao: 5000, // R$ 50,00
    vagasTotal: 50,
    vagasOcupadas: 12,
    inscricoesAbertas: true,
  },
  {
    titulo: "Workshop de Hip Hop com DJ Malboro",
    descricao: "Workshop especial com o renomado dançarino e coreógrafo DJ Malboro",
    tipo: "workshop",
    dataEvento: "2025-02-28T15:00:00",
    local: "Estúdio DançArt",
    valorInscricao: 8000, // R$ 80,00
    vagasTotal: 30,
    vagasOcupadas: 28,
    inscricoesAbertas: true,
  },
  {
    titulo: "Apresentação de Fim de Ano 2024",
    descricao: "Apresentação especial de encerramento do ano letivo",
    tipo: "apresentacao",
    dataEvento: "2024-12-15T18:00:00",
    local: "Auditório da Escola",
    valorInscricao: 0,
    vagasTotal: null,
    vagasOcupadas: 0,
    inscricoesAbertas: false,
  },
];

for (const evento of eventos) {
  db.prepare(`
    INSERT INTO eventos (
      titulo, descricao, tipo, dataEvento, local, valorInscricao, vagasTotal,
      vagasOcupadas, inscricoesAbertas, imagemUrl, observacoes, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    evento.titulo,
    evento.descricao,
    evento.tipo,
    evento.dataEvento,
    evento.local,
    evento.valorInscricao,
    evento.vagasTotal,
    evento.vagasOcupadas,
    evento.inscricoesAbertas ? 1 : 0,
    null,
    null
  );
}

console.log("✅ Seed de dados mock concluído com sucesso!");
console.log(`
📊 Resumo:
- ${bailarinos.length} bailarinos
- ${cursos.length} cursos
- ${matriculas.length} matrículas
- ${matriculas.length * meses.length} mensalidades
- ${agendamentos.length} agendamentos
- ${depoimentos.length} depoimentos
- ${eventos.length} eventos
`);

db.close();
