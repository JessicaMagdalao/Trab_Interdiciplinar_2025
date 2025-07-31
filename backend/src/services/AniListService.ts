import { GraphQLClient } from 'graphql-request';

/**
 * Serviço responsável pela comunicação com a API GraphQL da AniList.
 * Aplica o padrão Adapter para fornecer uma interface simplificada
 * para consumir dados externos da AniList.
 */
export class AniListService {
  private baseUrl: string;
  private client: GraphQLClient;

  // Cache para os gêneros
  private cachedGenres: string[] | null = null;
  private lastFetchGenres = 0;
  private readonly cacheTTL = 1000 * 60 * 10; // 10 minutos

  constructor() {
    this.baseUrl = 'https://graphql.anilist.co';
    this.client = new GraphQLClient(this.baseUrl);
  }

  /**
   * Executa uma query GraphQL na API AniList com retry em caso de 429.
   */
  public async executarQuery(query: string, variaveis?: object): Promise<any> {
    try {
      return await this.client.request(query, variaveis);
    } catch (error: any) {
      if (error?.response?.status === 429) {
        const retryAfter = parseInt(error.response.headers?.get('retry-after') || '5', 10);
        console.warn(` Rate limit atingido. Aguardando ${retryAfter} segundos antes de tentar novamente...`);
        await new Promise(res => setTimeout(res, retryAfter * 1000));
        return this.client.request(query, variaveis);
      }
      console.error(' Erro ao executar query GraphQL:', error);
      throw new Error(`Falha na comunicação com a API AniList: ${error.message || error}`);
    }
  }

  /**
   * Busca animes populares com paginação.
   */
  public async buscarAnimesPopulares(pagina = 1, limite = 20): Promise<any[]> {
    const query = this.construirQueryPopulares();
    const resultado = await this.executarQuery(query, { page: pagina, perPage: limite });
    return Array.isArray(resultado?.Page?.media) ? resultado.Page.media : [];
  }

  /**
   * Busca animes filtrados por gênero.
   */
  public async buscarAnimesPorGenero(genero: string, pagina = 1, limite = 20): Promise<any[]> {
    const query = this.construirQueryPorGenero();
    const resultado = await this.executarQuery(query, { page: pagina, perPage: limite, genre: genero });
    return Array.isArray(resultado?.Page?.media) ? resultado.Page.media : [];
  }

  /**
   * Pesquisa animes por termo de busca.
   */
  public async pesquisarAnimes(termo: string, pagina = 1, limite = 20): Promise<any[]> {
    const query = this.construirQueryPesquisa();
    const resultado = await this.executarQuery(query, { page: pagina, perPage: limite, search: termo });
    return Array.isArray(resultado?.Page?.media) ? resultado.Page.media : [];
  }

  /**
   * Obtém detalhes completos de um anime específico.
   */
  public async obterDetalhesAnime(id: number): Promise<any> {
    const query = this.construirQueryDetalhes();
    const resultado = await this.executarQuery(query, { id });
    return resultado?.Media || null;
  }

  /**
   * Obtém a lista de gêneros com cache.
   */
  public async obterGeneros(): Promise<string[]> {
    const agora = Date.now();
    if (this.cachedGenres && agora - this.lastFetchGenres < this.cacheTTL) {
      return this.cachedGenres;
    }
    const resultado = await this.executarQuery(`query { GenreCollection }`);
    if (resultado?.GenreCollection) {
      this.cachedGenres = resultado.GenreCollection;
      this.lastFetchGenres = agora;
    }
    return this.cachedGenres || [];
  }

  /**
   * Busca animes em lançamento (status RELEASING).
   */
  public async buscarAnimesEmLancamento(pagina = 1, limite = 20): Promise<any[]> {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total currentPage lastPage hasNextPage perPage
          }
          media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
            id
            title { romaji english native }
            coverImage { large medium }
            description
            genres
            popularity
            status
            episodes
            season
            seasonYear
            studios { nodes { name } }
            averageScore
            nextAiringEpisode {
              episode
              timeUntilAiring
            }
          }
        }
      }
    `;
    const resultado = await this.executarQuery(query, { page: pagina, perPage: limite });
    return Array.isArray(resultado?.Page?.media) ? resultado.Page.media : [];
  }

  // -----------------------
  // Queries privadas
  // -----------------------
  private construirQueryPopulares(): string {
    return `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo { total currentPage lastPage hasNextPage perPage }
          media(type: ANIME, sort: POPULARITY_DESC) {
            id title { romaji english native }
            coverImage { large medium }
            description genres popularity status episodes season seasonYear
            studios { nodes { name } }
            averageScore startDate { year month day }
          }
        }
      }
    `;
  }

  private construirQueryPorGenero(): string {
    return `
      query ($page: Int, $perPage: Int, $genre: String) {
        Page(page: $page, perPage: $perPage) {
          pageInfo { total currentPage lastPage hasNextPage perPage }
          media(type: ANIME, genre_in: [$genre], sort: POPULARITY_DESC) {
            id title { romaji english native }
            coverImage { large medium }
            description genres popularity status episodes season seasonYear
            studios { nodes { name } }
            averageScore startDate { year month day }
          }
        }
      }
    `;
  }

  private construirQueryPesquisa(): string {
    return `
      query ($page: Int, $perPage: Int, $search: String) {
        Page(page: $page, perPage: $perPage) {
          pageInfo { total currentPage lastPage hasNextPage perPage }
          media(type: ANIME, search: $search, sort: POPULARITY_DESC) {
            id title { romaji english native }
            coverImage { large medium }
            description genres popularity status episodes season seasonYear
            studios { nodes { name } }
            averageScore startDate { year month day }
          }
        }
      }
    `;
  }

  private construirQueryDetalhes(): string {
    return `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id title { romaji english native }
          coverImage { large medium extraLarge } bannerImage
          description genres popularity status episodes duration
          season seasonYear studios { nodes { name } }
          averageScore meanScore startDate { year month day }
          endDate { year month day } source format
          tags { name description rank }
          characters { nodes { name { full } image { medium } } }
          staff { nodes { name { full } primaryOccupations } }
        }
      }
    `;
  }
}
