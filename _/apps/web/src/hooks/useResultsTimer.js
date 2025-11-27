import { useEffect } from "react";

export function useResultsTimer({
  step,
  timerRef,
  setTimeRemaining,
  onTimeout,
}) {
  useEffect(() => {
    if (step === "results") {
      // Limpar timer anterior se existir
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Inicializar o tempo em 60 segundos (alterado de 90)
      setTimeRemaining(60);

      // Iniciar o timer após um pequeno delay para garantir que o timeRemaining foi atualizado
      setTimeout(() => {
        timerRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            console.log("Timer contando:", prev); // Para debug
            if (prev <= 1) {
              clearInterval(timerRef.current);
              onTimeout();
              return 60; // Retornar para 60 ao invés de 90
            }
            return prev - 1;
          });
        }, 1000);
      }, 100);
    } else {
      // Limpar timer quando não estiver na tela de results
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [step, timerRef, setTimeRemaining, onTimeout]);
}
