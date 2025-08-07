import { ISerializavel } from '../interfaces/ISerializavel';
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

  public getNome(): string {
    return this.nome;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public getCor(): string {
    return this.cor;
  }

  public getIcone(): string {
    return this.icone;
  }

  public setDescricao(descricao: string): void {
    this.descricao = descricao.trim();
  }

  public setCor(cor: string): void {
    this.cor = this.validarCor(cor) ? cor : this.cor;
  }

  public setIcone(icone: string): void {
    this.icone = icone.trim();
  }
  public equals(outro: Genero): boolean {
    return this.nome.toLowerCase() === outro.nome.toLowerCase();
  }

  public toString(): string {
    return this.nome;
  }

  public toJSON(): object {
    return {
      nome: this.nome,
      descricao: this.descricao,
      cor: this.cor,
      icone: this.icone
    };
  }

  public static fromJSON(data: any): Genero {
    return new Genero(
      data.nome || '',
      data.descricao || '',
      data.cor || '#6B7280',
      data.icone || ''
    );
  }
  private validarCor(cor: string): boolean {
    const regexHex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    return regexHex.test(cor);
  }
}
