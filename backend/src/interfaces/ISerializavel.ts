/**
 * Interface que define o contrato para serialização de objetos.
 * Facilita a comunicação entre camadas e persistência de dados.
 */
export interface ISerializavel {
  /**
   * Converte a instância atual em um objeto simples, pronto para serialização.
   *
   * @returns Representação do objeto como um objeto JavaScript serializável (JSON-ready).
   */
  toJSON(): Record<string, any>;
}

