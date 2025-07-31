import { AnimeFavorito } from '../models/AnimeFavorito';

/** 
 * Define o contrato que qualquer repositório de favoritos deve seguir.
 * Aplica o princípio da inversão de dependência (DIP) do SOLID:
 * a aplicação depende de abstrações (interfaces) e não de implementações concretas.
 */
export interface IFavoritoRepository {
  /**
   * Salva um novo favorito no repositório.
   * Deve garantir a persistência do objeto.
   * @param favorito Objeto do tipo AnimeFavorito a ser salvo.
   * @returns Promise resolvida com o objeto salvo.
   */
  salvar(favorito: AnimeFavorito): Promise<AnimeFavorito>;

  /**
   * Busca um favorito específico pelo ID do anime e ID do usuário.
   * Ideal para verificar se um anime já está nos favoritos de um usuário.
   * @param animeId Identificador único do anime.
   * @param usuarioId Identificador único do usuário.
   * @returns Promise resolvida com o AnimeFavorito ou null caso não exista.
   */
  buscarPorId(animeId: number, usuarioId: string): Promise<AnimeFavorito | null>;

  /**
   * Lista todos os favoritos cadastrados para um usuário específico.
   * @param usuarioId Identificador único do usuário.
   * @returns Promise resolvida com um array de AnimeFavorito.
   */
  buscarPorUsuario(usuarioId: string): Promise<AnimeFavorito[]>;

  /**
   * Atualiza os dados de um favorito existente.
   * Deve sobrescrever as informações do favorito já salvo.
   * @param favorito Objeto AnimeFavorito contendo os novos dados.
   * @returns Promise resolvida com o objeto atualizado.
   */
  atualizar(favorito: AnimeFavorito): Promise<AnimeFavorito>;

  /**
   * Remove um favorito com base no ID do anime e ID do usuário.
   * @param animeId Identificador único do anime.
   * @param usuarioId Identificador único do usuário.
   * @returns Promise resolvida com `true` se foi removido ou `false` caso não exista.
   */
  deletar(animeId: number, usuarioId: string): Promise<boolean>;
}
