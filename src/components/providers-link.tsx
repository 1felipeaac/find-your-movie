import type { ProviderProps } from "../services/tmdb";

interface ProvidersLinkProps {
  providers: { 
    streaming: ProviderProps[];
    aluguel: ProviderProps[]; 
    compra: ProviderProps[]; 
    link: string 
  } | null;
}


export function ProvidersLink({ providers }: ProvidersLinkProps){

    return (<>
        {providers && providers.link && (
        <div className="mt-4 pt-4 border-t border-slate-700 text-center">
          <a 
            href={providers.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Ver mais detalhes no TMDB
          </a>
        </div>
      )}
    </>)
}