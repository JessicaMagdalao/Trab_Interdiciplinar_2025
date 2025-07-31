import { ISerializavel } from '../interfaces/ISerializavel';

/**
 * Classe que representa um gênero de anime.
 * Demonstra o relacionamento de associação com a classe Anime.
 * Implementa ISerializavel para facilitar a comunicação entre camadas.
 */
export class Genero implements ISerializavel {
  private nome: string;
  private descricao: string;
  private cor: string;
  private icone: string;

  /**
   * Construtor da classe Genero.
   * @param nome Nome do gênero
   * @param descricao Descrição do gênero
   * @param cor Cor representativa em formato hex (opcional)
   * @param icone Ícone do gênero (opcional)
   */
  constructor(
    nome: string,
    descricao: string = '',
    cor: string = '#6B7280',
    icone: string = ''
  ) {
    this.nome = nome.trim();
    this.descricao = descricao.trim();
    this.cor = this.validarCor(cor) ? cor : '#6B7280';
    this.icone = icone.trim();
  }

  /** @returns Nome do gênero. */
  public getNome(): string {
    return this.nome;
  }

  /** @returns Descrição do gênero. */
  public getDescricao(): string {
    return this.descricao;
  }

  /** @returns Cor representativa em formato hex. */
  public getCor(): string {
    return this.cor;
  }

  /** @returns Ícone do gênero. */
  public getIcone(): string {
    return this.icone;
  }

  /**
   * Atualiza a descrição do gênero.
   * @param descricao Nova descrição
   */
  public setDescricao(descricao: string): void {
    this.descricao = descricao.trim();
  }

  /**
   * Atualiza a cor do gênero.
   * Faz uma validação simples para garantir que seja um valor hex válido.
   * @param cor Nova cor em formato hex
   */
  public setCor(cor: string): void {
    this.cor = this.validarCor(cor) ? cor : this.cor;
  }

  /**
   * Atualiza o ícone do gênero.
   * @param icone Novo ícone
   */
  public setIcone(icone: string): void {
    this.icone = icone.trim();
  }

  /**
   * Compara se dois gêneros são iguais, com base no nome.
   * @param outro Outro gênero para comparação
   * @returns true se os gêneros forem iguais
   */
  public equals(outro: Genero): boolean {
    return this.nome.toLowerCase() === outro.nome.toLowerCase();
  }

  /** @returns Representação textual do gênero. */
  public toString(): string {
    return this.nome;
  }

  /**
   * Serializa o gênero para um objeto JSON.
   * @returns Objeto serializável com dados do gênero
   */
  public toJSON(): object {
    return {
      nome: this.nome,
      descricao: this.descricao,
      cor: this.cor,
      icone: this.icone
    };
  }

  /**
   * Cria um gênero a partir de um objeto JSON.
   * @param data Objeto com dados do gênero
   * @returns Nova instância de Genero
   */
  public static fromJSON(data: any): Genero {
    return new Genero(
      data.nome || '',
      data.descricao || '',
      data.cor || '#6B7280',
      data.icone || ''
    );
  }

  /**
   * Valida uma string de cor no formato hex simples (#RRGGBB).
   * @param cor String a validar
   * @returns true se for um hex válido
   */
  private validarCor(cor: string): boolean {
    const regexHex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    return regexHex.test(cor);
  }
}
