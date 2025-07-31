import { IFavoritoRepository } from '../interfaces/IFavoritoRepository';
import { AnimeFavorito } from '../models/AnimeFavorito';

/**
 * Implementação em memória do repositório de favoritos.
 * Usa um Map com chave composta (animeId_usuarioId) para armazenamento eficiente.
 *  Facilita testes, desenvolvimento local e não precisa de banco de dados real.
 */
export class MemoryFavoritoRepository implements IFavoritoRepository {
  private favoritos: Map<string, AnimeFavorito>;

  constructor() {
    this.favoritos = new Map<string, AnimeFavorito>();
  }

  /**
   * Salva ou atualiza um favorito no repositório.
   * @param favorito - Favorito a ser salvo
   */
  public async salvar(favorito: AnimeFavorito): Promise<AnimeFavorito> {
    const chave = this.gerarChave(favorito.getAnimeId(), favorito.getUsuarioId());
    this.favoritos.set(chave, favorito);
    return favorito;
  }

  /**
   * Busca um favorito específico por animeId e usuarioId.
   */
  public async buscarPorId(animeId: number, usuarioId: string): Promise<AnimeFavorito | null> {
    const chave = this.gerarChave(animeId, usuarioId);
    return this.favoritos.get(chave) || null;
  }

  /**
   * Lista todos os favoritos de um usuário, ordenados pela data de adição.
   */
  public async buscarPorUsuario(usuarioId: string): Promise<AnimeFavorito[]> {
    const lista = Array.from(this.favoritos.values()).filter(f => f.getUsuarioId() === usuarioId);
    return lista.sort((a, b) => b.getDataAdicao().getTime() - a.getDataAdicao().getTime());
  }

  /**
   * Atualiza dados de um favorito já existente.
   */
  public async atualizar(favorito: AnimeFavorito): Promise<AnimeFavorito> {
    const chave = this.gerarChave(favorito.getAnimeId(), favorito.getUsuarioId());
    if (!this.favoritos.has(chave)) {
      throw new Error(`Favorito não encontrado para anime ${favorito.getAnimeId()} e usuário ${favorito.getUsuarioId()}`);
    }
    this.favoritos.set(chave, favorito);
    return favorito;
  }

  /**
   * Deleta um favorito específico.
   */
  public async deletar(animeId: number, usuarioId: string): Promise<boolean> {
    return this.favoritos.delete(this.gerarChave(animeId, usuarioId));
  }

  /**
   * Verifica se existe um favorito para animeId e usuarioId.
   */
  public async verificarFavorito(animeId: number, usuarioId: string): Promise<boolean> {
    return this.favoritos.has(this.gerarChave(animeId, usuarioId));
  }

  /**
   * Lista todos os favoritos salvos (útil para testes e debug).
   */
  public async buscarTodos(): Promise<AnimeFavorito[]> {
    return Array.from(this.favoritos.values());
  }

  /**
   * Lista todos os favoritos de um determinado anime (independente do usuário).
   */
  public async buscarPorAnime(animeId: number): Promise<AnimeFavorito[]> {
    return Array.from(this.favoritos.values()).filter(f => f.getAnimeId() === animeId);
  }

  /**
   * Gera estatísticas do usuário:
   * - Total de favoritos
   * - Nota média
   * - Top 5 gêneros mais favoritados
   */
  public async obterEstatisticasUsuario(usuarioId: string): Promise<{
    total: number;
    notaMedia: number;
    generosFavoritos: string[];
  }> {
    const lista = await this.buscarPorUsuario(usuarioId);
    if (lista.length === 0) {
      return { total: 0, notaMedia: 0, generosFavoritos: [] };
    }

    // média das notas
    const somaNotas = lista.reduce((acc, f) => acc + f.getNota(), 0);
    const notaMedia = Math.round((somaNotas / lista.length) * 100) / 100;

    // contagem dos gêneros
    const contagem = new Map<string, number>();
    lista.forEach(f => {
      f.getAnime().getGeneros().forEach(g => {
        const nome = g.getNome();
        contagem.set(nome, (contagem.get(nome) || 0) + 1);
      });
    });

    const generosFavoritos = Array.from(contagem.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nome]) => nome);

    return { total: lista.length, notaMedia, generosFavoritos };
  }

  /**
   * Limpa todos os favoritos (geralmente usado em testes ou reset de ambiente).
   */
  public limpar(): void {
    this.favoritos.clear();
  }

  /**
   * Retorna o número total de registros.
   */
  public obterTotal(): number {
    return this.favoritos.size;
  }

  /**
   * Gera uma chave única para mapear o favorito no Map.
   */
  private gerarChave(animeId: number, usuarioId: string): string {
    return `${animeId}_${usuarioId}`;
  }
}
