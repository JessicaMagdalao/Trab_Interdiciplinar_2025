/**
 * Interface que define o contrato para validação de objetos.
 * Permite diferentes estratégias de validação seguindo o padrão Strategy.
 */
export interface IValidavel {
  /**
   * Valida o estado atual do objeto.
   *
   * @returns `true` se o objeto for válido, `false` caso contrário.
   * @throws (opcional) Pode lançar um erro se preferir sinalizar falhas críticas de validação.
   */
  validar(): boolean;
}

