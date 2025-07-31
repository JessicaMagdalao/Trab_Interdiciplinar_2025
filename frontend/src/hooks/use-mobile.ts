import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook para detectar se a tela está em modo mobile.
 * Usa `matchMedia` para reagir dinamicamente a mudanças de tamanho de tela.
 */
export function useIsMobile(): boolean {
  const mql = React.useMemo(
    () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`),
    []
  );

  // Inicializa com o estado atual do matchMedia
  const [isMobile, setIsMobile] = React.useState<boolean>(mql.matches);

  // Atualiza o estado ao alterar o tamanho
  const handleChange = React.useCallback(() => {
    setIsMobile(mql.matches);
  }, [mql]);

  React.useEffect(() => {
    // Adiciona listener
    mql.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, [mql, handleChange]);

  return isMobile;
}
