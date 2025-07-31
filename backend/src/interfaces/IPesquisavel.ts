/**
 * Define o contrato para objetos que podem ser pesquisados no sistema.
 * Segue o princípio da Segregação de Interfaces (ISP) do SOLID:
 * classes devem depender apenas dos métodos que realmente utilizam.
 */
export interface IPesquisavel {
  /**
   * Verifica se o objeto atual corresponde a um critério de pesquisa.
   *
   * @param criterio Termo de pesquisa a ser aplicado (ex.: texto, palavra-chave).
   * @returns `true` se o objeto atende ao critério fornecido, `false` caso contrário.
   */
  pesquisarPorCriterio(criterio: string): boolean;
}
