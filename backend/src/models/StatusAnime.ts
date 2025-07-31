/**
 * Enumeração que define os possíveis status de um anime.
 * Garante type safety e valores consistentes no sistema.
 */
export enum StatusAnime {
    FINISHED = "FINISHED",
    RELEASING = "RELEASING",
    NOT_YET_RELEASED = "NOT_YET_RELEASED",
    CANCELLED = "CANCELLED",
    HIATUS = "HIATUS"
}

/**
 * Função utilitária para converter uma string em um StatusAnime válido.
 * Caso a string não seja reconhecida, retorna StatusAnime.FINISHED como padrão.
 *
 * @param status - Texto representando o status retornado pela API ou pelo banco.
 * @returns Um valor seguro do enum StatusAnime.
 */
export function parseStatusAnime(status: string | null | undefined): StatusAnime {
    if (!status || typeof status !== 'string') {
        return StatusAnime.FINISHED;
    }

    switch (status.trim().toUpperCase()) {
        case StatusAnime.FINISHED:
            return StatusAnime.FINISHED;
        case StatusAnime.RELEASING:
            return StatusAnime.RELEASING;
        case StatusAnime.NOT_YET_RELEASED:
            return StatusAnime.NOT_YET_RELEASED;
        case StatusAnime.CANCELLED:
            return StatusAnime.CANCELLED;
        case StatusAnime.HIATUS:
            return StatusAnime.HIATUS;
        default:
            // Retorna um padrão seguro para evitar valores inválidos
            return StatusAnime.FINISHED;
    }
}
