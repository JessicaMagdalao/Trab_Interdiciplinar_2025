import { IFavoritoRepository } from '../interfaces/IFavoritoRepository';
import { AnimeFavorito } from '../models/AnimeFavorito';

/**
 * Implementação em memória do repositório de favoritos.
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


  public async buscarPorId(animeId: number, usuarioId: string): Promise<AnimeFavorito | null> {
    const chave = this.gerarChave(animeId, usuarioId);
    return this.favoritos.get(chave) || null;
  }


  public async buscarPorUsuario(usuarioId: string): Promise<AnimeFavorito[]> {
    const lista = Array.from(this.favoritos.values()).filter(f => f.getUsuarioId() === usuarioId);
    return lista.sort((a, b) => b.getDataAdicao().getTime() - a.getDataAdicao().getTime());
  }

  public async atualizar(favorito: AnimeFavorito): Promise<AnimeFavorito> {
    const chave = this.gerarChave(favorito.getAnimeId(), favorito.getUsuarioId());
    if (!this.favoritos.has(chave)) {
      throw new Error(`Favorito não encontrado para anime ${favorito.getAnimeId()} e usuário ${favorito.getUsuarioId()}`);
    }
    this.favoritos.set(chave, favorito);
    return favorito;
  }


  public async deletar(animeId: number, usuarioId: string): Promise<boolean> {
    return this.favoritos.delete(this.gerarChave(animeId, usuarioId));
  }


  public async verificarFavorito(animeId: number, usuarioId: string): Promise<boolean> {
    return this.favoritos.has(this.gerarChave(animeId, usuarioId));
  }


  public async buscarTodos(): Promise<AnimeFavorito[]> {
    return Array.from(this.favoritos.values());
  }


  public async buscarPorAnime(animeId: number): Promise<AnimeFavorito[]> {
    return Array.from(this.favoritos.values()).filter(f => f.getAnimeId() === animeId);
  }

  public async obterEstatisticasUsuario(usuarioId: string): Promise<{
    total: number;
    notaMedia: number;
    generosFavoritos: string[];
  }> {
    const lista = await this.buscarPorUsuario(usuarioId);
    if (lista.length === 0) {
      return { total: 0, notaMedia: 0, generosFavoritos: [] };
    }
    const somaNotas = lista.reduce((acc, f) => acc + f.getNota(), 0);
    const notaMedia = Math.round((somaNotas / lista.length) * 100) / 100;


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

  public limpar(): void {
    this.favoritos.clear();
  }

  public obterTotal(): number {
    return this.favoritos.size;
  }

  private gerarChave(animeId: number, usuarioId: string): string {
    return `${animeId}_${usuarioId}`;
  }
}
