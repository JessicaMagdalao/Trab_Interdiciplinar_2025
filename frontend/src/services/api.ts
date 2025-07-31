import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  Anime,
  AnimeFavorito,
  ApiResponse,
  PaginacaoResponse,
  FiltroResponse,
  PesquisaResponse,
  EstatisticasFavoritos,
} from '../types';

/**
 * Serviço responsável por fazer chamadas à API backend.
 */
class ApiService {
  private api: AxiosInstance;
  private usuarioId: string;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.usuarioId = 'usuario-demo'; // mockado (ex: token)

    this.configurarInterceptors();
  }

  /** Intercepta requisições e respostas para log e tratamento de erros */
  private configurarInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Erro na requisição:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log(`[API] Resposta recebida:`, response.status);
        return response;
      },
      (error) => {
        console.error('[API] Erro na resposta:', error);

        if (error.response) {
          const { status, data } = error.response;
          throw new Error(data?.erro || `Erro ${status}: ${error.message}`);
        } else if (error.request) {
          throw new Error('Erro de conexão com o servidor');
        } else {
          throw new Error(error.message || 'Erro desconhecido');
        }
      }
    );
  }

  // ===== ANIMES =====

  async buscarAnimesPopulares(pagina = 1, limite = 20): Promise<Anime[]> {
    const res: AxiosResponse<PaginacaoResponse<Anime[]>> = await this.api.get('/animes/populares', {
      params: { page: pagina, limit: limite },
    });
    return res.data.dados;
  }

  async buscarAnimesEmLancamento(pagina = 1, limite = 20): Promise<Anime[]> {
    const res: AxiosResponse<PaginacaoResponse<Anime[]>> = await this.api.get('/animes/lancamento', {
      params: { page: pagina, limit: limite },
    });
    return res.data.dados;
  }

  async buscarAnimesPorGenero(genero: string, pagina = 1, limite = 20): Promise<Anime[]> {
    const res: AxiosResponse<FiltroResponse<Anime[]>> = await this.api.get(
      `/animes/genero/${encodeURIComponent(genero)}`,
      { params: { page: pagina, limit: limite } }
    );
    return res.data.dados;
  }

  async pesquisarAnimes(termo: string, pagina = 1, limite = 20): Promise<Anime[]> {
    const res: AxiosResponse<PesquisaResponse<Anime[]>> = await this.api.get('/animes/search', {
      params: { q: termo, page: pagina, limit: limite },
    });
    return res.data.dados;
  }

  async obterDetalhesAnime(id: number): Promise<Anime> {
    const res: AxiosResponse<ApiResponse<Anime>> = await this.api.get(`/animes/${id}`);
    return res.data.dados;
  }

async obterGeneros(): Promise<string[]> {
  const res: AxiosResponse<ApiResponse<string[]>> = await this.api.get('/animes/generos');
  return res.data.dados;
}


  // ===== FAVORITOS =====

  async adicionarFavorito(animeId: number, nota = 0, comentario = ''): Promise<AnimeFavorito> {
    const res: AxiosResponse<ApiResponse<AnimeFavorito>> = await this.api.post('/favoritos', {
      animeId,
      usuarioId: this.usuarioId,
      nota,
      comentario,
    });
    return res.data.dados;
  }

  async removerFavorito(animeId: number): Promise<void> {
    await this.api.delete(`/favoritos/${animeId}/${this.usuarioId}`);
  }

  async listarFavoritos(ordenacao = 'data', ordem: 'asc' | 'desc' = 'desc'): Promise<AnimeFavorito[]> {
    const res: AxiosResponse<ApiResponse<AnimeFavorito[]>> = await this.api.get(`/favoritos/${this.usuarioId}`, {
      params: { ordenacao, ordem },
    });
    return res.data.dados;
  }

  async atualizarFavorito(animeId: number, dados: { nota?: number; comentario?: string }): Promise<AnimeFavorito> {
    const res: AxiosResponse<ApiResponse<AnimeFavorito>> = await this.api.put(
      `/favoritos/${animeId}/${this.usuarioId}`,
      dados
    );
    return res.data.dados;
  }

  async verificarFavorito(animeId: number): Promise<boolean> {
    const res: AxiosResponse<ApiResponse<{ eFavorito: boolean }>> = await this.api.get(
      `/favoritos/${animeId}/${this.usuarioId}/verificar`
    );
    return res.data.dados.eFavorito;
  }

  async obterFavorito(animeId: number): Promise<AnimeFavorito | null> {
    try {
      const res: AxiosResponse<ApiResponse<AnimeFavorito>> = await this.api.get(
        `/favoritos/${animeId}/${this.usuarioId}`
      );
      return res.data.dados;
    } catch {
      return null;
    }
  }

  async obterEstatisticasFavoritos(): Promise<EstatisticasFavoritos> {
    const res: AxiosResponse<ApiResponse<EstatisticasFavoritos>> = await this.api.get(
      `/favoritos/${this.usuarioId}/estatisticas`
    );
    return res.data.dados;
  }

  async pesquisarFavoritos(criterio: string): Promise<AnimeFavorito[]> {
    const res: AxiosResponse<PesquisaResponse<AnimeFavorito[]>> = await this.api.get(
      `/favoritos/${this.usuarioId}/search`,
      { params: { q: criterio } }
    );
    return res.data.dados;
  }

  // ===== UTILITÁRIOS =====

  async verificarSaude(): Promise<boolean> {
    try {
      await this.api.get('/health');
      return true;
    } catch {
      return false;
    }
  }

  async obterInfoApi(): Promise<any> {
    const res = await this.api.get('/');
    return res.data;
  }

  setUsuarioId(novoUsuarioId: string): void {
    this.usuarioId = novoUsuarioId;
  }

  getUsuarioId(): string {
    return this.usuarioId;
  }

  limparCache(): void {
    // Future cache logic
    console.log('[API] Cache limpo');
  }
}

export const apiService = new ApiService();
export { ApiService };
