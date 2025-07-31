import { useState, useEffect, useCallback } from 'react';
import { AnimeFavorito, UseFavoritosResult, EstatisticasFavoritos } from '../types';
import { apiService } from '../services/api';

/**
 * Hook principal para gerenciar favoritos do usuário.
 */
export function useFavoritos(): UseFavoritosResult {
  const [favoritos, setFavoritos] = useState<AnimeFavorito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar todos os favoritos do backend
  const carregarFavoritos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const lista = await apiService.listarFavoritos();
      setFavoritos(lista);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar favoritos';
      setError(msg);
      console.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarFavorito = useCallback(
    async (animeId: number, nota: number = 0, comentario: string = '') => {
      try {
        const novo = await apiService.adicionarFavorito(animeId, nota, comentario);
        setFavoritos(prev => [novo, ...prev]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao adicionar favorito';
        setError(msg);
        throw new Error(msg);
      }
    },
    []
  );

  const removerFavorito = useCallback(
    async (animeId: number) => {
      try {
        await apiService.removerFavorito(animeId);
        setFavoritos(prev => prev.filter(f => f.animeId !== animeId));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao remover favorito';
        setError(msg);
        throw new Error(msg);
      }
    },
    []
  );

  const atualizarFavorito = useCallback(
    async (animeId: number, dados: { nota?: number; comentario?: string }) => {
      try {
        const atualizado = await apiService.atualizarFavorito(animeId, dados);
        setFavoritos(prev =>
          prev.map(f => (f.animeId === animeId ? atualizado : f))
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao atualizar favorito';
        setError(msg);
        throw new Error(msg);
      }
    },
    []
  );

  const verificarFavorito = useCallback(
    (animeId: number): boolean => favoritos.some(f => f.animeId === animeId),
    [favoritos]
  );

  const refresh = useCallback(() => {
    carregarFavoritos();
  }, [carregarFavoritos]);

  // Carrega favoritos na montagem
  useEffect(() => {
    carregarFavoritos();
  }, [carregarFavoritos]);

  return {
    favoritos,
    loading,
    error,
    adicionarFavorito,
    removerFavorito,
    atualizarFavorito,
    verificarFavorito,
    refresh,
  };
}

/**
 * Hook para obter estatísticas dos favoritos.
 */
export function useEstatisticasFavoritos() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasFavoritos | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarEstatisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await apiService.obterEstatisticasFavoritos();
      setEstatisticas(stats);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar estatísticas';
      setError(msg);
      console.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    carregarEstatisticas();
  }, [carregarEstatisticas]);

  useEffect(() => {
    carregarEstatisticas();
  }, [carregarEstatisticas]);

  return { estatisticas, loading, error, refresh };
}

/**
 * Hook para pesquisar favoritos por um critério.
 */
export function usePesquisaFavoritos() {
  const [favoritos, setFavoritos] = useState<AnimeFavorito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pesquisar = useCallback(async (criterio: string) => {
    if (!criterio.trim()) {
      setFavoritos([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const resultados = await apiService.pesquisarFavoritos(criterio.trim());
      setFavoritos(resultados);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao pesquisar favoritos';
      setError(msg);
      console.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const limpar = useCallback(() => {
    setFavoritos([]);
    setError(null);
  }, []);

  return { favoritos, loading, error, pesquisar, limpar };
}

/**
 * Hook para gerenciar status de favorito individual.
 */
export function useFavoritoStatus(animeId: number | null) {
  const [isFavorito, setIsFavorito] = useState(false);
  const [favorito, setFavorito] = useState<AnimeFavorito | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verificarStatus = useCallback(async () => {
    if (!animeId) return;
    try {
      setLoading(true);
      setError(null);
      const [status, data] = await Promise.all([
        apiService.verificarFavorito(animeId),
        apiService.obterFavorito(animeId),
      ]);
      setIsFavorito(status);
      setFavorito(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao verificar status do favorito';
      setError(msg);
      console.error(msg);
    } finally {
      setLoading(false);
    }
  }, [animeId]);

  const toggleFavorito = useCallback(
    async (nota: number = 0, comentario: string = '') => {
      if (!animeId) return;
      try {
        if (isFavorito) {
          await apiService.removerFavorito(animeId);
          setIsFavorito(false);
          setFavorito(null);
        } else {
          const novo = await apiService.adicionarFavorito(animeId, nota, comentario);
          setIsFavorito(true);
          setFavorito(novo);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao alterar favorito';
        setError(msg);
        throw new Error(msg);
      }
    },
    [animeId, isFavorito]
  );

  const atualizar = useCallback(
    async (dados: { nota?: number; comentario?: string }) => {
      if (!animeId || !isFavorito) return;
      try {
        const atualizado = await apiService.atualizarFavorito(animeId, dados);
        setFavorito(atualizado);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao atualizar favorito';
        setError(msg);
        throw new Error(msg);
      }
    },
    [animeId, isFavorito]
  );

  useEffect(() => {
    if (animeId) {
      verificarStatus();
    } else {
      setIsFavorito(false);
      setFavorito(null);
      setError(null);
    }
  }, [animeId, verificarStatus]);

  return { isFavorito, favorito, loading, error, toggleFavorito, atualizarFavorito: atualizar };
}
