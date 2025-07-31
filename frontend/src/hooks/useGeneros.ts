import { useState, useEffect, useCallback } from 'react';
import { Genero } from '../types';
import { apiService } from '../services/api';

/**
 * Hook para buscar e gerenciar a lista de gêneros.
 */
export function useGeneros() {
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarGeneros = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const lista = await apiService.obterGeneros();

      // Converte string[] para Genero[] preenchendo campos obrigatórios
const listaGeneros: Genero[] = lista.map((g: string): Genero => ({
  nome: g,
  descricao: '',
  cor: '#6b7280', // cor padrão cinza
  icone: 'book'   // ícone genérico
}));


      setGeneros(listaGeneros);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar gêneros';
      setError(msg);
      console.error(' Erro ao carregar gêneros:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    carregarGeneros();
  }, [carregarGeneros]);

  useEffect(() => {
    carregarGeneros();
  }, [carregarGeneros]);

  return { generos, loading, error, refresh };
}
