import { Anime } from './Anime';
import { ISerializavel } from '../interfaces/ISerializavel';

/**
 * Classe que representa o relacionamento entre usuários e animes favoritos.
 */
export class AnimeFavorito implements ISerializavel {
  private animeId: number;
  private usuarioId: string;
  private dataAdicao: Date;
  private nota: number;
  private comentario: string;
  private anime: Anime;

  /**
   * Construtor da classe AnimeFavorito.
   * @param animeId ID do anime favorito
   * @param usuarioId ID do usuário
   * @param anime Instância do anime
   * @param nota Nota pessoal do usuário (0-10, opcional)
   * @param comentario Comentário pessoal (opcional)
   */
  constructor(
    animeId: number,
    usuarioId: string,
    anime: Anime,
    nota: number = 0,
    comentario: string = ''
  ) {
    this.animeId = animeId;
    this.usuarioId = usuarioId.trim();
    this.anime = anime;
    this.dataAdicao = new Date();
    this.nota = Math.max(0, Math.min(10, nota));
    this.comentario = comentario.trim();
  }

  /** @returns ID do anime. */
  public getAnimeId(): number {
    return this.animeId;
  }

  /** @returns ID do usuário. */
  public getUsuarioId(): string {
    return this.usuarioId;
  }

  /** @returns Data de adição aos favoritos. */
  public getDataAdicao(): Date {
    return this.dataAdicao;
  }

  /** @returns Nota pessoal do usuário (0-10). */
  public getNota(): number {
    return this.nota;
  }

  /** @returns Comentário pessoal do usuário. */
  public getComentario(): string {
    return this.comentario;
  }

  /** @returns Instância completa do anime associado. */
  public getAnime(): Anime {
    return this.anime;
  }

  /**
   * Define uma nova nota pessoal.
   * @param nota Nova nota (0-10)
   */
  public setNota(nota: number): void {
    if (typeof nota === 'number') {
      this.nota = Math.max(0, Math.min(10, nota));
    }
  }

  /**
   * Define um novo comentário pessoal.
   * @param comentario Novo comentário
   */
  public setComentario(comentario: string): void {
    if (typeof comentario === 'string') {
      this.comentario = comentario.trim();
    }
  }

  /**
   * Atualiza a instância do anime caso corresponda ao mesmo ID.
   * @param anime Nova instância do anime
   */
  public atualizarAnime(anime: Anime): void {
    if (anime.getId() === this.animeId) {
      this.anime = anime;
    }
  }

  /**
   * Serializa este objeto em um JSON.
   * @returns Objeto JSON representando o favorito
   */
  public toJSON(): object {
    return {
      animeId: this.animeId,
      usuarioId: this.usuarioId,
      dataAdicao: this.dataAdicao.toISOString(),
      nota: this.nota,
      comentario: this.comentario,
      anime: this.anime.toJSON()
    };
  }

  /**
   * Cria uma instância de AnimeFavorito a partir de dados JSON.
   * @param data Objeto JSON com os dados
   * @returns Nova instância de AnimeFavorito
   */
  public static fromJSON(data: any): AnimeFavorito {
    const anime = Anime.fromJSON(data.anime);
    const favorito = new AnimeFavorito(
      data.animeId || 0,
      data.usuarioId || '',
      anime,
      data.nota || 0,
      data.comentario || ''
    );

    if (data.dataAdicao) {
      favorito.dataAdicao = new Date(data.dataAdicao);
    }
    return favorito;
  }

  /**
   * Gera uma chave única para identificar o favorito.
   * @returns Chave única no formato `animeId_usuarioId`
   */
  public gerarChave(): string {
    return `${this.animeId}_${this.usuarioId}`;
  }
}
