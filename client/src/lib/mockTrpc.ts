// Hook para simular tRPC com dados mockados estáticos
import { useState, useEffect, useMemo, useCallback } from 'react';
import { mockApi } from '@/data/mockApi';

// Tipos para simular o comportamento do tRPC
interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface MutationResult<T> {
  mutateAsync: (variables?: any) => Promise<T>;
  mutate: (variables?: any) => void;
  isPending: boolean;
  error: Error | null;
}

// Hook para queries (GET)
function useQuery<T>(
  queryFn: () => Promise<T>,
  options: { enabled?: boolean; retry?: boolean; refetchOnWindowFocus?: boolean } = {}
): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (options.enabled === false) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const result = await queryFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, options.enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

// Hook para mutations (POST/PUT/DELETE)
function useMutation<T>(
  mutationFn: (variables: any) => Promise<T>,
  options: { onSuccess?: (data: T) => void; onError?: (error: Error) => void } = {}
): MutationResult<T> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = useCallback(async (variables?: any) => {
    try {
      setIsPending(true);
      setError(null);
      const result = await mutationFn(variables);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  }, [mutationFn, options]);

  const mutate = useCallback((variables?: any) => {
    mutateAsync(variables).catch(() => {
      // Error já tratado no mutateAsync
    });
  }, [mutateAsync]);

  return {
    mutateAsync,
    mutate,
    isPending,
    error,
  };
}

// Simular o utils do tRPC
class MockUtils {
  auth = {
    me: {
      setData: (key: any, data: any) => {
        // Simular cache update
        console.log('Mock: Setting auth data', data);
      },
      invalidate: async () => {
        // Simular invalidação de cache
        console.log('Mock: Invalidating auth cache');
      }
    }
  };
}

// Hook principal que simula o tRPC
export function useMockTrpc() {
  const utils = useMemo(() => new MockUtils(), []);

  return {
    // Auth
    auth: {
      me: {
        useQuery: (variables?: any, options?: any) => 
          useQuery(() => mockApi.auth.me(), options),
      },
      devLogin: {
        useMutation: (options?: any) => 
          useMutation(() => mockApi.auth.devLogin(), options),
      },
      logout: {
        useMutation: (options?: any) => 
          useMutation(() => mockApi.auth.logout(), options),
      },
    },

    // Bailarinos
    bailarinos: {
      list: {
        useQuery: (variables?: any, options?: any) => 
          useQuery(() => mockApi.bailarinos.list(), options),
      },
      getById: {
        useQuery: (id: number, options?: any) => 
          useQuery(() => mockApi.bailarinos.getById(id), options),
      },
      create: {
        useMutation: (options?: any) => 
          useMutation((data: any) => mockApi.bailarinos.create(data), options),
      },
      update: {
        useMutation: (options?: any) => 
          useMutation(({ id, data }: any) => mockApi.bailarinos.update(id, data), options),
      },
      delete: {
        useMutation: (options?: any) => 
          useMutation((id: number) => mockApi.bailarinos.delete(id), options),
      },
    },

    // Cursos
    cursos: {
      list: {
        useQuery: (variables?: any, options?: any) => 
          useQuery(() => mockApi.cursos.list(), options),
      },
      getById: {
        useQuery: (id: number, options?: any) => 
          useQuery(() => mockApi.cursos.getById(id), options),
      },
      create: {
        useMutation: (options?: any) => 
          useMutation((data: any) => mockApi.cursos.create(data), options),
      },
    },

    // Matrículas
    matriculas: {
      list: {
        useQuery: (variables?: any, options?: any) => 
          useQuery(() => mockApi.matriculas.list(), options),
      },
    },

    // Mensalidades
    mensalidades: {
      list: {
        useQuery: (variables?: any, options?: any) => 
          useQuery(() => mockApi.mensalidades.list(), options),
      },
    },

    // Agendamentos
    agendamentos: {
      list: {
        useQuery: (variables?: any, options?: any) => 
          useQuery(() => mockApi.agendamentos.list(), options),
      },
      create: {
        useMutation: (options?: any) => 
          useMutation((data: any) => mockApi.agendamentos.create(data), options),
      },
      update: {
        useMutation: (options?: any) => 
          useMutation(({ id, data }: any) => mockApi.agendamentos.update(id, data), options),
      },
    },

    // Depoimentos
    depoimentos: {
      list: {
        useQuery: (aprovadosOnly?: boolean, options?: any) => 
          useQuery(() => mockApi.depoimentos.list(aprovadosOnly), options),
      },
      create: {
        useMutation: (options?: any) => 
          useMutation((data: any) => mockApi.depoimentos.create(data), options),
      },
      update: {
        useMutation: (options?: any) => 
          useMutation(({ id, data }: any) => mockApi.depoimentos.update(id, data), options),
      },
    },

    // Eventos
    eventos: {
      list: {
        useQuery: (variables?: any, options?: any) => 
          useQuery(() => mockApi.eventos.list(), options),
      },
      getById: {
        useQuery: (id: number, options?: any) => 
          useQuery(() => mockApi.eventos.getById(id), options),
      },
    },

    // Estatísticas
    statistics: {
      dashboard: {
        useQuery: (variables?: any, options?: any) => 
          useQuery(() => mockApi.statistics.dashboard(), options),
      },
    },

    // Utils
    useUtils: () => utils,
  };
}

// Re-exportar para compatibilidade
export const trpc = {
  useUtils: () => new MockUtils(),
};