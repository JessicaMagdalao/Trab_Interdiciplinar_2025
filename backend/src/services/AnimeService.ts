import { AniListService } from './AniListService';
import { Anime } from '../models/Anime';
export class AnimeService {
  private aniListService: AniListService;
  private cachePopulares: Anime[] | null = null;
  private cacheLancamento: Anime[] | null = null;
  private cacheGeneros: string[] | null = null;

  private cacheTimestampPopulares = 0;
  private cacheTimestampLancamento = 0;
  private cacheTimestampGeneros = 0;
  private readonly CACHE_TTL = 1000 * 60 * 5;

  constructor(aniListService: AniListService) {
    this.aniListService = aniListService;
  }

  private isCacheValido(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }

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

  public async obterGeneros(): Promise<string[]> {
    if (this.cacheGeneros && this.isCacheValido(this.cacheTimestampGeneros)) {
      return this.cacheGeneros;
    }

    const dados = await this.aniListService.obterGeneros();
    this.cacheGeneros = dados;
    this.cacheTimestampGeneros = Date.now();

    return dados;
  }

  public async buscarAnimesPorGenero(genero: string, page = 1, limit = 20): Promise<Anime[]> {
    const dados = await this.aniListService.buscarAnimesPorGenero(genero, page, limit);
    return dados.map((data: any) => Anime.fromJSON(data));
  }

  public async pesquisarAnimes(termo: string, page = 1, limit = 20): Promise<Anime[]> {
    const dados = await this.aniListService.pesquisarAnimes(termo, page, limit);
    return dados.map((data: any) => Anime.fromJSON(data));
  }

  public async obterDetalhesAnime(id: number): Promise<Anime> {
    const data = await this.aniListService.obterDetalhesAnime(id);
    return Anime.fromJSON(data);
  }
}
