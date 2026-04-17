export function AppPresentation() {
    return(
        <ul className="flex flex-col gap-4 text-left bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-inner w-full max-w-lg mx-auto">
              <li className="text-center">
                <p className="text-lg text-slate-300 font-medium px-4">
                  Cansado de procurar e não achar nada? Eu resolvo isso para
                  você.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  🍿
                </span>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  <strong className="text-indigo-400 font-bold block mb-1">
                    Do seu jeito:
                  </strong>
                  Filtre por gênero, ano de lançamento e nota ideal.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  📺
                </span>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  <strong className="text-indigo-400 font-bold block mb-1">
                    Pronto para assistir:
                  </strong>
                  Só sorteamos filmes disponíveis nos melhores streamings do Brasil
                  (Netflix, Prime, Disney, Max e mais).
                </p>
              </li>
              <li className="text-center">
                <p className="text-slate-400 text-sm md:text-base font-medium mt-2">
                  Configure seus gostos abaixo, clique em{" "}
                  <span className="text-slate-200 font-semibold">sortear</span>{" "}
                  e deixe a mágica do cinema acontecer!
                </p>
              </li>
            </ul>
    )
}