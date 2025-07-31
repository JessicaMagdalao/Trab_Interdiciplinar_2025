import { Midia } from './Midia';
import { Genero } from './Genero';
import { StatusAnime } from './StatusAnime';
import { IPesquisavel } from '../interfaces/IPesquisavel';
import { IValidavel } from '../interfaces/IValidavel';
import { ISerializavel } from '../interfaces/ISerializavel';

/**
 * Classe que representa um anime no sistema.
 * Herda de Midia e implementa múltiplas interfaces, demonstrando
 * polimorfismo e os princípios SOLID.
 * 
 * Relacionamentos:
 * - Herança: Anime herda de Midia
 * - Implementação: Implementa IPesquisavel, IValidavel, ISerializavel
 * - Associação: Possui lista de Genero (1:N)
 */
export class Anime extends Midia implements IPesquisavel, IValidavel, ISerializavel {
  private generos: Genero[];
  private popularidade: number;
  private status: StatusAnime;
  private episodios: number;
  private temporada: string;
  private ano: number;
  private estudio: string;
  private nota: number;

  /**
   * Construtor da classe Anime.
   * @param id ID único do anime.
   * @param titulo Título do anime.
   * @param imagem URL da imagem de capa.
   * @param sinopse Sinopse do anime.
   * @param generos Lista de gêneros (opcional).
   * @param popularidade Índice de popularidade (opcional).
   * @param status Status atual do anime (opcional).
   * @param episodios Número de episódios (opcional).
   * @param temporada Temporada de lançamento (opcional).
   * @param ano Ano de lançamento (opcional).
   * @param estudio Estúdio de animação (opcional).
   * @param nota Avaliação do anime (opcional).
   */
  constructor(
    id: number,
    titulo: string,
    imagem: string,
    sinopse: string,
    generos: Genero[] = [],
    popularidade: number = 0,
    status: StatusAnime = StatusAnime.FINISHED,
    episodios: number = 0,
    temporada: string = '',
    ano: number = new Date().getFullYear(),
    estudio: string = '',
    nota: number = 0
  ) {
    super(id, titulo, imagem, sinopse);
    this.generos = [...generos];
    this.popularidade = Math.max(0, popularidade);
    this.status = status;
    this.episodios = Math.max(0, episodios);
    this.temporada = temporada.trim();
    this.ano = ano;
    this.estudio = estudio.trim();
    this.nota = Math.max(0, Math.min(10, nota));
  }

  /** @returns Array de gêneros do anime. */
  public getGeneros(): Genero[] {
    return [...this.generos];
  }

  /** @returns Índice de popularidade do anime. */
  public getPopularidade(): number {
    return this.popularidade;
  }

  /** @returns Status atual do anime. */
  public getStatus(): StatusAnime {
    return this.status;
  }

  /** @returns Número de episódios do anime. */
  public getEpisodios(): number {
    return this.episodios;
  }

  /** @returns Temporada de lançamento do anime. */
  public getTemporada(): string {
    return this.temporada;
  }

  /** @returns Ano de lançamento do anime. */
  public getAno(): number {
    return this.ano;
  }

  /** @returns Nome do estúdio de animação. */
  public getEstudio(): string {
    return this.estudio;
  }

  /** @returns Nota do anime (0 a 10). */
  public getNota(): number {
    return this.nota;
  }

  /**
   * Adiciona um gênero ao anime.
   * @param genero Gênero a ser adicionado.
   */
  public adicionarGenero(genero: Genero): void {
    if (!this.generos.some(g => g.equals(genero))) {
      this.generos.push(genero);
    }
  }

  /**
   * Remove um gênero do anime.
   * @param genero Gênero a ser removido.
   */
  public removerGenero(genero: Genero): void {
    this.generos = this.generos.filter(g => !g.equals(genero));
  }

  /**
   * Atualiza a popularidade do anime.
   * @param popularidade Novo índice de popularidade.
   */
  public atualizarPopularidade(popularidade: number): void {
    this.popularidade = Math.max(0, popularidade);
  }

  /**
   * Pesquisa se o anime corresponde a um critério.
   * @param criterio Termo de pesquisa.
   * @returns `true` se corresponder, caso contrário `false`.
   */
  public pesquisarPorCriterio(criterio: string): boolean {
    if (!criterio || criterio.trim() === '') return true;

    const criterioLower = criterio.toLowerCase().trim();
    if (this.titulo.toLowerCase().includes(criterioLower)) return true;
    if (this.sinopse.toLowerCase().includes(criterioLower)) return true;
    if (this.generos.some(genero => genero.getNome().toLowerCase().includes(criterioLower))) return true;
    if (this.estudio.toLowerCase().includes(criterioLower)) return true;

    return false;
  }

  /**
   * Valida os dados do anime.
   * @returns `true` se os dados forem válidos.
   */
  public validar(): boolean {
    if (!this.titulo || this.titulo.trim() === '') return false;
    if (this.id <= 0) return false;
    if (this.popularidade < 0) return false;
    if (this.episodios < 0) return false;
    if (this.nota < 0 || this.nota > 10) return false;
    if (this.ano < 1900 || this.ano > new Date().getFullYear() + 5) return false;

    return true;
  }

  /**
   * Retorna detalhes formatados do anime.
   * @returns String com os detalhes do anime.
   */
  public getDetalhes(): string {
    const generosNomes = this.generos.map(g => g.getNome()).join(', ');
    return `${this.titulo} (${this.ano}) - ${this.status} - ${this.episodios} episódios - Gêneros: ${generosNomes} - Nota: ${this.nota}/10`;
  }

  /**
   * Serializa o anime para JSON.
   * @returns Objeto com os dados do anime.
   */
  public toJSON(): object {
    return {
      id: this.id,
      titulo: this.titulo,
      imagem: this.imagem,
      sinopse: this.sinopse,
      generos: this.generos.map(g => g.toJSON()),
      popularidade: this.popularidade,
      status: this.status,
      episodios: this.episodios,
      temporada: this.temporada,
      ano: this.ano,
      estudio: this.estudio,
      nota: this.nota,
      dataCriacao: this.dataCriacao.toISOString()
    };
  }

/**
 * Cria uma instância de Anime a partir de JSON da AniList.
 * @param data Objeto JSON contendo os dados.
 * @returns Instância de Anime.
 */
public static fromJSON(data: any): Anime {
  const generos = (data.genres || []).map((g: string) =>
    Genero.fromJSON({ nome: g, descricao: '', cor: '', icone: '' })
  );

  const titulo = data.title?.romaji || data.title?.english || data.title?.native || 'Título Desconhecido';
  const imagem = data.coverImage?.large || data.coverImage?.medium || '';
  const sinopse = data.description || '';
  const popularidade = data.popularity || 0;
  const status = data.status || StatusAnime.FINISHED;
  const episodios = data.episodes || 0;
  const temporada = data.season || '';
  const ano = data.seasonYear || new Date().getFullYear();
  const estudio = data.studios?.nodes?.[0]?.name || '';
  const nota = data.averageScore || 0;

  return new Anime(
    data.id || 0,
    titulo,
    imagem,
    sinopse,
    generos,
    popularidade,
    status,
    episodios,
    temporada,
    ano,
    estudio,
    nota
  );
}
}

