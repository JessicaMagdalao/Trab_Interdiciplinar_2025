/**
 * Classe abstrata que serve como base para diferentes tipos de mídia.
 */
export abstract class Midia {
    protected id: number;
    protected titulo: string;
    protected imagem: string;
    protected sinopse: string;
    protected dataCriacao: Date;

  /**
   * Construtor da classe Midia.
    @param id 
    @param titulo
    @param imagem 
    @param sinopse 
   */
  constructor(id: number, titulo: string, imagem: string, sinopse: string) {
    if (id <= 0) {
      throw new Error('O ID da mídia deve ser um número positivo.');
    }

    this.id = id;
    this.titulo = titulo.trim();
    this.imagem = imagem.trim();
    this.sinopse = sinopse.trim();
    this.dataCriacao = new Date();
  }

  /** @returns ID da mídia */
  public getId(): number {
    return this.id;
  }

  /** @returns Título da mídia */
  public getTitulo(): string {
    return this.titulo;
  }

  /** @returns URL da imagem da mídia */
  public getImagem(): string {
    return this.imagem;
  }

  /** @returns Sinopse ou descrição da mídia */
  public getSinopse(): string {
    return this.sinopse;
  }

  /** @returns Data de criação do registro */
  public getDataCriacao(): Date {
    return this.dataCriacao;
  }

  /**
   * Define o título da mídia.
   * @param titulo Novo título (não vazio)
   */
  public setTitulo(titulo: string): void {
    if (!titulo || titulo.trim() === '') {
      throw new Error('O título da mídia não pode estar vazio.');
    }
    this.titulo = titulo.trim();
  }

  /**
   * Define a URL da imagem da mídia.
   * @param imagem Nova URL da imagem
   */
  public setImagem(imagem: string): void {
    if (!imagem || imagem.trim() === '') {
      throw new Error('A URL da imagem não pode estar vazia.');
    }
    this.imagem = imagem.trim();
  }

  /**
   * Define a sinopse da mídia.
   * @param sinopse Nova sinopse
   */
  public setSinopse(sinopse: string): void {
    this.sinopse = (sinopse || '').trim();
  }

  /**
   * @returns
   */
  public abstract getDetalhes(): string;

  /**

   * @returns
   */
  public abstract validar(): boolean;
}
