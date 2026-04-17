export function appFooter(cooldownTime: string | null) {
    return(
        <footer className="mt-16 pb-8 border-t border-slate-800/50 pt-6 text-center">
        {cooldownTime ? (
          <div className="inline-flex flex-col items-center p-4 bg-slate-900/50 rounded-xl border border-red-500/20">
            <span className="text-red-400 text-sm font-semibold uppercase tracking-wider mb-1">
              Limite de Sorteios Atingido
            </span>
            <span className="text-2xl font-mono font-bold text-red-300 animate-pulse">
              ⏳ {cooldownTime}
            </span>
          </div>
        ) : (
          <div className="text-slate-500 text-sm font-medium">
            Sorteios disponíveis: {4 - (Number(localStorage.getItem('fym_drawCount')) || 0)}/4
          </div>
        )}
      </footer>
    )
}