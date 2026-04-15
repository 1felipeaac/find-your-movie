import { env } from "../env";
import type { Movie } from "../models";

interface Genre {
  id: number;
  name: string;
}

interface MovieCardProps {
  movie: Movie;
  movieGenres: Genre[];
}

export function MovieCard({ movie, movieGenres }: MovieCardProps) {

  if (!movie) return null;

  return (
    <section 
      id="movie-details"
      className={`max-w-2xs mx-auto bg-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-100 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl`}
    >
      <div className="relative w-full max-w-xs bg-slate-900">
      
        <img 
          src={`${env.VITE_IMG_URL}${movie.poster_path}`} 
          alt={`Pôster de ${movie.title}`} 
          className="w-full h-full object-cover"
        />
        

        <div className="absolute top-1 right-1 bg-yellow-500 text-slate-900 font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 text-sm">
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
          <span className="text-xs font-normal opacity-80">({movie.vote_count})</span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-1 leading-tight text-white">
          {movie.title}
        </h2>
        
        <p className="text-slate-400 text-sm mb-4 font-medium">
          Lançamento: {new Date(movie.release_date).toLocaleDateString('pt-BR')}
        </p>

        <p className="text-slate-300 text-justify text-sm mb-6 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-300">
          {movie.overview}
        </p>

        {movieGenres.length > 0 && (
          <div className="border-t border-slate-700 pt-4 mt-auto">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Gêneros
            </h3>
            <ul className="flex flex-wrap gap-2 justify-center">
              {movieGenres.map(genre => (
                <li 
                  key={genre.id}
                  className="appearance-none bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {genre.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}