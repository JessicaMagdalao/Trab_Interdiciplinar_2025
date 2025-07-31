import { AniListService } from './AniListService';
import { Anime } from '../models/Anime';

/**
 * Serviço intermediário entre o Controller e o AniListService.
 * Responsável por aplicar cache simples em memória e transformar
 * os dados crus da API em instâncias de domínio (Anime).
 */
export class AnimeService {
  private aniListService: AniListService;

  // Cache simples em memória
  private cachePopulares: Anime[] | null = null;
  private cacheLancamento: Anime[] | null = null;
  private cacheGeneros: string[] | null = null;

  private cacheTimestampPopulares = 0;
  private cacheTimestampLancamento = 0;
  private cacheTimestampGeneros = 0;

  // Tempo de vida do cache: 5 minutos
  private readonly CACHE_TTL = 1000 * 60 * 5;

  constructor(aniListService: AniListService) {
    this.aniListService = aniListService;
  }

  /**  Valida se o cache ainda é válido */
  private isCacheValido(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  /**  Buscar animes populares com cache */
  public async buscarAnimesPopulares(page = 1, limit = 20): Promise<Anime[]> {
    if (page === 1 && this.cachePopulares && this.isCacheValido(this.cacheTimestampPopulares)) {
      return this.cachePopulares;
    }

    const dados = await this.aniListService.buscarAnimesPopulares(page, limit);
    const animes = dados.map((data: any) => Anime.fromJSON(data));

    if (page === 1) {
      this.cachePopulares = animes;
      this.cacheTimestampPopulares = Date.now();
    }

    return animes;
  }

  /**  Buscar animes em lançamento com cache */
  public async buscarAnimesEmLancamento(page = 1, limit = 20): Promise<Anime[]> {
    if (page === 1 && this.cacheLancamento && this.isCacheValido(this.cacheTimestampLancamento)) {
      return this.cacheLancamento;
    }

    const dados = await this.aniListService.buscarAnimesEmLancamento(page, limit);
    const animes = dados.map((data: any) => Anime.fromJSON(data));

    if (page === 1) {
      this.cacheLancamento = animes;
      this.cacheTimestampLancamento = Date.now();
    }

    return animes;
  }

  /**  Obter lista de gêneros com cache */
  public async obterGeneros(): Promise<string[]> {
    if (this.cacheGeneros && this.isCacheValido(this.cacheTimestampGeneros)) {
      return this.cacheGeneros;
    }

    const dados = await this.aniListService.obterGeneros();
    this.cacheGeneros = dados;
    this.cacheTimestampGeneros = Date.now();

    return dados;
  }

  /**  Buscar animes por gênero */
  public async buscarAnimesPorGenero(genero: string, page = 1, limit = 20): Promise<Anime[]> {
    const dados = await this.aniListService.buscarAnimesPorGenero(genero, page, limit);
    return dados.map((data: any) => Anime.fromJSON(data));
  }

  /**  Pesquisar animes */
  public async pesquisarAnimes(termo: string, page = 1, limit = 20): Promise<Anime[]> {
    const dados = await this.aniListService.pesquisarAnimes(termo, page, limit);
    return dados.map((data: any) => Anime.fromJSON(data));
  }

  /**  Obter detalhes de um anime */
  public async obterDetalhesAnime(id: number): Promise<Anime> {
    const data = await this.aniListService.obterDetalhesAnime(id);
    return Anime.fromJSON(data);
  }
}
