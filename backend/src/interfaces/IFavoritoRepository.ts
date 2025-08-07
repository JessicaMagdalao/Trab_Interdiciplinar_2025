import { AnimeFavorito } from '../models/AnimeFavorito';

export interface IFavoritoRepository {
  salvar(favorito: AnimeFavorito): Promise<AnimeFavorito>;

  buscarPorId(animeId: number, usuarioId: string): Promise<AnimeFavorito | null>;


  buscarPorUsuario(usuarioId: string): Promise<AnimeFavorito[]>;


  atualizar(favorito: AnimeFavorito): Promise<AnimeFavorito>;

  deletar(animeId: number, usuarioId: string): Promise<boolean>;
}
