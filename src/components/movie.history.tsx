import { env } from "../env";
import imageDefault from "../assets/not-found-default.png";

export interface HistoryItem {
  poster_path: string;
  title: string;
  link?: string;
}

interface MoviehistoryProps {
  historyMovie: HistoryItem[];
}

export function Moviehistory({ historyMovie }: MoviehistoryProps) {
  if (historyMovie.length === 0) return null;

  return (
    <section className="history mt-8">
      <h2 className="text-xl font-bold text-center text-white mb-4">
        Histórico de Filmes Sorteados
      </h2>
      
      <div className="history-list flex gap-4 overflow-x-auto py-4 justify-center">
        {historyMovie.map((item, index) => {
          
          const imgSrc = item.poster_path 
            ? `${env.VITE_IMG_URL}${item.poster_path}` 
            : imageDefault;

          return (
            <div key={index} className="flex flex-col items-center">
              {item.link ? (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title={`Ver onde assistir ${item.title}`}
                  className="hover:scale-110 transition-transform duration-200 block"
                >
                  <img
                    src={imgSrc}
                    alt={`Pôster de ${item.title}`}
                    className="w-20 h-28 object-cover rounded-lg shadow-md cursor-pointer border-2 border-transparent hover:border-indigo-500"
                  />
                </a>
              ) : (
                <img
                  src={imgSrc}
                  alt={`Pôster de ${item.title}`}
                  className="w-20 h-28 object-cover rounded-lg shadow-md opacity-80"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}