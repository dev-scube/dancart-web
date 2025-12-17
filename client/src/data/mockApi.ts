// API Mockada para funcionar estaticamente no GitHub Pages
import {
  mockBailarinos,
  mockCursos, 
  mockMatriculas,
  mockMensalidades,
  mockAgendamentos,
  mockDepoimentos,
  mockEventos,
  mockAdmin,
  simulateApiDelay
} from './mockData';

// Estado global mockado (simula localStorage para persistência básica)
let isAuthenticated = false;
let currentUser: any = null;

// Utilitário para formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);
};

// Simular autenticação
export const mockAuth = {
  me: async () => {
    await simulateApiDelay();
    // Verificar se tem sessão no localStorage
    const savedAuth = localStorage.getItem('dancart-mock-auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      isAuthenticated = authData.isAuthenticated;
      currentUser = authData.user;
    }
    
    return isAuthenticated ? currentUser : null;
  },
  
  devLogin: async () => {
    await simulateApiDelay();
    isAuthenticated = true;
    currentUser = mockAdmin;
    
    // Salvar no localStorage
    localStorage.setItem('dancart-mock-auth', JSON.stringify({
      isAuthenticated: true,
      user: currentUser
    }));
    
    return currentUser;
  },
  
  logout: async () => {
    await simulateApiDelay();
    isAuthenticated = false;
    currentUser = null;
    
    // Limpar localStorage
    localStorage.removeItem('dancart-mock-auth');
    
    return { success: true };
  }
};

// Mock para bailarinos
export const mockBailarinosApi = {
  list: async () => {
    await simulateApiDelay();
    return mockBailarinos;
  },
  
  getById: async (id: number) => {
    await simulateApiDelay();
    const bailarino = mockBailarinos.find(b => b.id === id);
    if (!bailarino) throw new Error('Bailarino não encontrado');
    return bailarino;
  },
  
  create: async (data: any) => {
    await simulateApiDelay();
    // Simular criação (apenas retorna dados com ID)
    const newBailarino = {
      ...data,
      id: Math.max(...mockBailarinos.map(b => b.id)) + 1,
    };
    mockBailarinos.push(newBailarino);
    return newBailarino;
  },
  
  update: async (id: number, data: any) => {
    await simulateApiDelay();
    const index = mockBailarinos.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Bailarino não encontrado');
    
    mockBailarinos[index] = { ...mockBailarinos[index], ...data };
    return mockBailarinos[index];
  },
  
  delete: async (id: number) => {
    await simulateApiDelay();
    const index = mockBailarinos.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Bailarino não encontrado');
    
    mockBailarinos.splice(index, 1);
    return { success: true };
  }
};

// Mock para cursos
export const mockCursosApi = {
  list: async () => {
    await simulateApiDelay();
    return mockCursos;
  },
  
  getById: async (id: number) => {
    await simulateApiDelay();
    const curso = mockCursos.find(c => c.id === id);
    if (!curso) throw new Error('Curso não encontrado');
    return curso;
  },
  
  create: async (data: any) => {
    await simulateApiDelay();
    const newCurso = {
      ...data,
      id: Math.max(...mockCursos.map(c => c.id)) + 1,
      vagasOcupadas: 0,
      status: 'ativo'
    };
    mockCursos.push(newCurso);
    return newCurso;
  }
};

// Mock para matrículas
export const mockMatriculasApi = {
  list: async () => {
    await simulateApiDelay();
    return mockMatriculas.map(matricula => {
      const bailarino = mockBailarinos.find(b => b.id === matricula.bailarinoId);
      const curso = mockCursos.find(c => c.id === matricula.cursoId);
      
      return {
        ...matricula,
        bailarino: bailarino?.nome || 'Não encontrado',
        curso: curso?.nome || 'Não encontrado',
        valorMensalFormatted: formatCurrency(matricula.valorMensalComDesconto)
      };
    });
  }
};

// Mock para mensalidades
export const mockMensalidadesApi = {
  list: async () => {
    await simulateApiDelay();
    return mockMensalidades.map(mensalidade => {
      const matricula = mockMatriculas.find(m => m.id === mensalidade.matriculaId);
      const bailarino = matricula ? mockBailarinos.find(b => b.id === matricula.bailarinoId) : null;
      
      return {
        ...mensalidade,
        bailarino: bailarino?.nome || 'Não encontrado',
        valorFormatted: formatCurrency(mensalidade.valorOriginal),
        valorPagoFormatted: mensalidade.valorPago ? formatCurrency(mensalidade.valorPago) : null
      };
    });
  }
};

// Mock para agendamentos
export const mockAgendamentosApi = {
  list: async () => {
    await simulateApiDelay();
    return mockAgendamentos;
  },
  
  create: async (data: any) => {
    await simulateApiDelay();
    const newAgendamento = {
      ...data,
      id: Math.max(...mockAgendamentos.map(a => a.id)) + 1,
      status: 'pendente',
      createdAt: new Date().toISOString()
    };
    mockAgendamentos.push(newAgendamento);
    return newAgendamento;
  },
  
  update: async (id: number, data: any) => {
    await simulateApiDelay();
    const index = mockAgendamentos.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Agendamento não encontrado');
    
    mockAgendamentos[index] = { ...mockAgendamentos[index], ...data };
    return mockAgendamentos[index];
  }
};

// Mock para depoimentos
export const mockDepoimentosApi = {
  list: async (aprovadosOnly: boolean = false) => {
    await simulateApiDelay();
    return aprovadosOnly 
      ? mockDepoimentos.filter(d => d.aprovado)
      : mockDepoimentos;
  },
  
  create: async (data: any) => {
    await simulateApiDelay();
    const newDepoimento = {
      ...data,
      id: Math.max(...mockDepoimentos.map(d => d.id)) + 1,
      aprovado: false,
      createdAt: new Date().toISOString()
    };
    mockDepoimentos.push(newDepoimento);
    return newDepoimento;
  },
  
  update: async (id: number, data: any) => {
    await simulateApiDelay();
    const index = mockDepoimentos.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Depoimento não encontrado');
    
    mockDepoimentos[index] = { ...mockDepoimentos[index], ...data };
    return mockDepoimentos[index];
  }
};

// Mock para eventos
export const mockEventosApi = {
  list: async () => {
    await simulateApiDelay();
    return mockEventos.map(evento => ({
      ...evento,
      valorInscricaoFormatted: evento.valorInscricao > 0 
        ? formatCurrency(evento.valorInscricao)
        : 'Gratuito'
    }));
  },
  
  getById: async (id: number) => {
    await simulateApiDelay();
    const evento = mockEventos.find(e => e.id === id);
    if (!evento) throw new Error('Evento não encontrado');
    
    return {
      ...evento,
      valorInscricaoFormatted: evento.valorInscricao > 0 
        ? formatCurrency(evento.valorInscricao)
        : 'Gratuito'
    };
  }
};

// Mock para estatísticas do dashboard
export const mockStatisticsApi = {
  dashboard: async () => {
    await simulateApiDelay();
    
    const totalBailarinos = mockBailarinos.length;
    const totalCursos = mockCursos.filter(c => c.status === 'ativo').length;
    const totalMatriculas = mockMatriculas.filter(m => m.status === 'ativa').length;
    const mensalidadesPendentes = mockMensalidades.filter(m => m.status === 'pendente').length;
    const agendamentosPendentes = mockAgendamentos.filter(a => a.status === 'pendente').length;
    
    const receitaMensal = mockMensalidades
      .filter(m => m.status === 'paga' && m.mesReferencia.startsWith('2025-01'))
      .reduce((total, m) => total + (m.valorPago || 0), 0);
    
    return {
      totalBailarinos,
      totalCursos,
      totalMatriculas,
      mensalidadesPendentes,
      agendamentosPendentes,
      receitaMensal,
      receitaMensalFormatted: formatCurrency(receitaMensal)
    };
  }
};

// API principal que substitui o tRPC
export const mockApi = {
  auth: mockAuth,
  bailarinos: mockBailarinosApi,
  cursos: mockCursosApi,
  matriculas: mockMatriculasApi,
  mensalidades: mockMensalidadesApi,
  agendamentos: mockAgendamentosApi,
  depoimentos: mockDepoimentosApi,
  eventos: mockEventosApi,
  statistics: mockStatisticsApi,
};