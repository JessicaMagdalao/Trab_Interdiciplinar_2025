import { IFavoritoRepository } from '../interfaces/IFavoritoRepository';
import { AnimeService } from './AnimeService';
import { AnimeFavorito } from '../models/AnimeFavorito';

/**
 * Serviço que gerencia operações CRUD para animes favoritos.
 * Aplica o padrão Service, isolando regras de negócio e coordenação entre
 * repositório de favoritos e o serviço de animes.
 */
export class FavoritoService {
  private favoritoRepository: IFavoritoRepository;
  private animeService: AnimeService;

  /**
   * Construtor do FavoritoService.
   * @param favoritoRepository Repositório para persistência de favoritos
   * @param animeService Serviço para operações com animes
   */
  constructor(favoritoRepository: IFavoritoRepository, animeService: AnimeService) {
    this.favoritoRepository = favoritoRepository;
    this.animeService = animeService;
  }

  /**  Adiciona um anime aos favoritos de um usuário */
  public async adicionarFavorito(
    animeId: number,
    usuarioId: string,
    nota: number = 0,
    comentario: string = ''
  ): Promise<AnimeFavorito> {
    const favoritoExistente = await this.favoritoRepository.buscarPorId(animeId, usuarioId);
    if (favoritoExistente) {
      throw new Error('Anime já está nos favoritos do usuário');
    }

    const anime = await this.animeService.obterDetalhesAnime(animeId);
    const novoFavorito = new AnimeFavorito(animeId, usuarioId, anime, nota, comentario);
    return this.favoritoRepository.salvar(novoFavorito);
  }

  /**  Remove um anime dos favoritos de um usuário */
  public async removerFavorito(animeId: number, usuarioId: string): Promise<boolean> {
    const favorito = await this.favoritoRepository.buscarPorId(animeId, usuarioId);
    if (!favorito) {
      throw new Error('Favorito não encontrado');
    }
    return this.favoritoRepository.deletar(animeId, usuarioId);
  }

  /**  Lista todos os favoritos de um usuário */
  public async listarFavoritos(usuarioId: string): Promise<AnimeFavorito[]> {
    return this.favoritoRepository.buscarPorUsuario(usuarioId);
  }

  /**  Atualiza dados de um favorito existente */
  public async atualizarFavorito(
    animeId: number,
    usuarioId: string,
    dados: Partial<{ nota: number; comentario: string }>
  ): Promise<AnimeFavorito> {
    const favorito = await this.favoritoRepository.buscarPorId(animeId, usuarioId);
    if (!favorito) {
      throw new Error('Favorito não encontrado');
    }

    if (dados.nota !== undefined) favorito.setNota(dados.nota);
    if (dados.comentario !== undefined) favorito.setComentario(dados.comentario);

    return this.favoritoRepository.atualizar(favorito);
  }

  /**  Verifica se um anime é favorito de um usuário */
  public async verificarFavorito(animeId: number, usuarioId: string): Promise<boolean> {
    const favorito = await this.favoritoRepository.buscarPorId(animeId, usuarioId);
    return favorito !== null;
  }

  /**  Obtém um favorito específico */
  public async obterFavorito(animeId: number, usuarioId: string): Promise<AnimeFavorito | null> {
    return this.favoritoRepository.buscarPorId(animeId, usuarioId);
  }

  /**  Obtém estatísticas de favoritos de um usuário */
  public async obterEstatisticasUsuario(usuarioId: string): Promise<{
    total: number;
    notaMedia: number;
    generosFavoritos: string[];
    ultimosAdicionados: AnimeFavorito[];
  }> {
    const favoritos = await this.favoritoRepository.buscarPorUsuario(usuarioId);

    if (favoritos.length === 0) {
      return { total: 0, notaMedia: 0, generosFavoritos: [], ultimosAdicionados: [] };
    }

    // Calcular média das notas
    const comNota = favoritos.filter(f => f.getNota() > 0);
    const notaMedia = comNota.length > 0
      ? comNota.reduce((acc, f) => acc + f.getNota(), 0) / comNota.length
      : 0;

    // Contar gêneros favoritos
    const contagemGeneros = new Map<string, number>();
    favoritos.forEach(fav => {
      fav.getAnime().getGeneros().forEach(g => {
        contagemGeneros.set(g.getNome(), (contagemGeneros.get(g.getNome()) || 0) + 1);
      });
    });

    const generosFavoritos = Array.from(contagemGeneros.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nome]) => nome);

    // Ordenar últimos adicionados por data (desc) e pegar os 5 primeiros
    const ultimosAdicionados = [...favoritos]
      .sort((a, b) => b.getDataAdicao().getTime() - a.getDataAdicao().getTime())
      .slice(0, 5);

    return {
      total: favoritos.length,
      notaMedia: Math.round(notaMedia * 100) / 100,
      generosFavoritos,
      ultimosAdicionados,
    };
  }

  /**  Pesquisa favoritos de um usuário por critério */
  public async pesquisarFavoritos(usuarioId: string, criterio: string): Promise<AnimeFavorito[]> {
    const favoritos = await this.favoritoRepository.buscarPorUsuario(usuarioId);
    if (!criterio || criterio.trim() === '') return favoritos;

    const criterioLower = criterio.toLowerCase();
    return favoritos.filter(f =>
      f.getAnime().pesquisarPorCriterio(criterioLower) ||
      f.getComentario().toLowerCase().includes(criterioLower)
    );
  }

  /**  Obtém favoritos ordenados por nota */
  public async obterFavoritosOrdenadosPorNota(usuarioId: string, ordem: 'asc' | 'desc' = 'desc'): Promise<AnimeFavorito[]> {
    const favoritos = await this.favoritoRepository.buscarPorUsuario(usuarioId);
    return favoritos.sort((a, b) =>
      ordem === 'asc' ? a.getNota() - b.getNota() : b.getNota() - a.getNota()
    );
  }
}
