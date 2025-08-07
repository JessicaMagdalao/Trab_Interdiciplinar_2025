import { IFavoritoRepository } from '../interfaces/IFavoritoRepository';
import { AnimeService } from './AnimeService';
import { AnimeFavorito } from '../models/AnimeFavorito';

export class FavoritoService {
  private favoritoRepository: IFavoritoRepository;
  private animeService: AnimeService;

  constructor(favoritoRepository: IFavoritoRepository, animeService: AnimeService) {
    this.favoritoRepository = favoritoRepository;
    this.animeService = animeService;
  }

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
  public async removerFavorito(animeId: number, usuarioId: string): Promise<boolean> {
    const favorito = await this.favoritoRepository.buscarPorId(animeId, usuarioId);
    if (!favorito) {
      throw new Error('Favorito não encontrado');
    }
    return this.favoritoRepository.deletar(animeId, usuarioId);
  }

  public async listarFavoritos(usuarioId: string): Promise<AnimeFavorito[]> {
    return this.favoritoRepository.buscarPorUsuario(usuarioId);
  }

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

  public async verificarFavorito(animeId: number, usuarioId: string): Promise<boolean> {
    const favorito = await this.favoritoRepository.buscarPorId(animeId, usuarioId);
    return favorito !== null;
  }

  public async obterFavorito(animeId: number, usuarioId: string): Promise<AnimeFavorito | null> {
    return this.favoritoRepository.buscarPorId(animeId, usuarioId);
  }
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

    const comNota = favoritos.filter(f => f.getNota() > 0);
    const notaMedia = comNota.length > 0
      ? comNota.reduce((acc, f) => acc + f.getNota(), 0) / comNota.length
      : 0;

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
  public async pesquisarFavoritos(usuarioId: string, criterio: string): Promise<AnimeFavorito[]> {
    const favoritos = await this.favoritoRepository.buscarPorUsuario(usuarioId);
    if (!criterio || criterio.trim() === '') return favoritos;

    const criterioLower = criterio.toLowerCase();
    return favoritos.filter(f =>
      f.getAnime().pesquisarPorCriterio(criterioLower) ||
      f.getComentario().toLowerCase().includes(criterioLower)
    );
  }

  public async obterFavoritosOrdenadosPorNota(usuarioId: string, ordem: 'asc' | 'desc' = 'desc'): Promise<AnimeFavorito[]> {
    const favoritos = await this.favoritoRepository.buscarPorUsuario(usuarioId);
    return favoritos.sort((a, b) =>
      ordem === 'asc' ? a.getNota() - b.getNota() : b.getNota() - a.getNota()
    );
  }
}
