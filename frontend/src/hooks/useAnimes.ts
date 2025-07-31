import { useState, useEffect, useCallback } from 'react';
import { Anime, UseAnimesResult } from '../types';
import { apiService } from '../services/api';

/**
 * Hook customizado para gerenciar estado de listas de animes.
 * Permite buscar animes populares ou em lançamento, com paginação e refresh.
 */
export function useAnimes(tipo: 'populares' | 'lancamento' = 'populares'): UseAnimesResult {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limite = 20;

  const carregarAnimes = useCallback(
    async (paginaAtual: number, limpar: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const novosAnimes: Anime[] =
          tipo === 'populares'
            ? await apiService.buscarAnimesPopulares(paginaAtual, limite)
            : await apiService.buscarAnimesEmLancamento(paginaAtual, limite);

        setAnimes(prev => (limpar ? novosAnimes : [...prev, ...novosAnimes]));
        setHasMore(novosAnimes.length === limite);
      } catch (err) {
        console.error('Erro ao carregar animes:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar animes');
      } finally {
        setLoading(false);
      }
    },
    [tipo]
  );

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const proxima = pagina + 1;
    setPagina(proxima);
    carregarAnimes(proxima, false);
  }, [loading, hasMore, pagina, carregarAnimes]);

  const refresh = useCallback(() => {
    setPagina(1);
    setHasMore(true);
    carregarAnimes(1, true);
  }, [carregarAnimes]);

  useEffect(() => {
    setPagina(1);
    setHasMore(true);
    setAnimes([]);
    carregarAnimes(1, true);
  }, [tipo, carregarAnimes]);

  return { animes, loading, error, loadMore, hasMore, refresh };
}

/**
 * Hook para buscar animes por gênero com paginação.
 */
export function useAnimesPorGenero(genero: string | null): UseAnimesResult {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limite = 20;

  const carregarAnimes = useCallback(
    async (paginaAtual: number, limpar: boolean = false) => {
      if (!genero) return;
      try {
        setLoading(true);
        setError(null);

        const novos = await apiService.buscarAnimesPorGenero(genero, paginaAtual, limite);
        setAnimes(prev => (limpar ? novos : [...prev, ...novos]));
        setHasMore(novos.length === limite);
      } catch (err) {
        console.error('Erro ao carregar animes por gênero:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar animes por gênero');
      } finally {
        setLoading(false);
      }
    },
    [genero]
  );

  const loadMore = useCallback(() => {
    if (loading || !hasMore || !genero) return;
    const proxima = pagina + 1;
    setPagina(proxima);
    carregarAnimes(proxima, false);
  }, [loading, hasMore, pagina, genero, carregarAnimes]);

  const refresh = useCallback(() => {
    if (!genero) return;
    setPagina(1);
    setHasMore(true);
    carregarAnimes(1, true);
  }, [genero, carregarAnimes]);

  useEffect(() => {
    if (genero) {
      setPagina(1);
      setHasMore(true);
      setAnimes([]);
      carregarAnimes(1, true);
    } else {
      setAnimes([]);
      setError(null);
    }
  }, [genero, carregarAnimes]);

  return { animes, loading, error, loadMore, hasMore, refresh };
}

/**
 * Hook para pesquisar animes por termo.
 */
export function usePesquisaAnimes() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pesquisar = useCallback(async (termo: string) => {
    if (!termo.trim()) {
      setAnimes([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const resultados = await apiService.pesquisarAnimes(termo.trim());
      setAnimes(resultados);
    } catch (err) {
      console.error('Erro ao pesquisar animes:', err);
      setError(err instanceof Error ? err.message : 'Erro ao pesquisar animes');
    } finally {
      setLoading(false);
    }
  }, []);

  const limpar = useCallback(() => {
    setAnimes([]);
    setError(null);
  }, []);

  return { animes, loading, error, pesquisar, limpar };
}

/**
 * Hook para obter detalhes de um anime específico.
 */
export function useAnimeDetalhes(id: number | null) {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarDetalhes = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const detalhes = await apiService.obterDetalhesAnime(id);
      setAnime(detalhes);
    } catch (err) {
      console.error('Erro ao carregar detalhes do anime:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes do anime');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refresh = useCallback(() => {
    carregarDetalhes();
  }, [carregarDetalhes]);

  useEffect(() => {
    if (id) {
      carregarDetalhes();
    } else {
      setAnime(null);
      setError(null);
    }
  }, [id, carregarDetalhes]);

  return { anime, loading, error, refresh };
}
