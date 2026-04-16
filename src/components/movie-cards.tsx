import { env } from "../env";
import type { Genre, Movie } from "../models";
import type { ProviderProps } from "../services/tmdb";
import { ExternalLink } from "./external-link";

interface MovieCardProps {
  movie: Movie | undefined;
  movieGenres: Genre[];
  providers?: {
    streaming: ProviderProps[];
    aluguel: ProviderProps[];
    compra: ProviderProps[];
    link: string;
  } | null;
}

export function MovieCard({ movie, movieGenres, providers }: MovieCardProps) {
  if (!movie) return null;

  return (
    <section
      id="movie-details"
      className={`w-full max-w-sm mx-auto bg-slate-800 rounded-2xl shadow-xl 
        overflow-hidden text-slate-100 transition-transform duration-300 
        hover:scale-[1.02] hover:shadow-2xl`}
    >
      <div className="relative w-full bg-slate-900">
        <img
          src={`${env.VITE_IMG_URL}${movie.poster_path}`}
          alt={`Pôster de ${movie.title}`}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-1 right-1 bg-yellow-500 text-slate-900 font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 text-sm">
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
          <span className="text-xs font-normal opacity-80">
            ({movie.vote_count})
          </span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-1 leading-tight text-white">
          {movie.title}
        </h2>

        <p className="text-slate-400 text-sm mb-4 font-medium">
          Lançamento: {new Date(movie.release_date).toLocaleDateString("pt-BR")}
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
              {movieGenres.map((genre) => (
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

        {providers && providers.streaming.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2">
              Streaming:
            </h3>
            <div className="flex gap-2 border-b border-slate-700 pb-4 mb-4 justify-center">
              {providers.streaming.map((plataforma) => (
                <img
                  key={plataforma.provider_id}
                  src={`${import.meta.env.VITE_IMG_URL}${plataforma.logo_path}`}
                  alt={plataforma.provider_name}
                  title={plataforma.provider_name}
                  className="w-10 h-10 rounded-lg shadow-md"
                />
              ))}
            </div>
            <ExternalLink
              link={providers.link}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Ver mais detalhes no TMDB
            </ExternalLink>
          </div>
        )}
      </div>
    </section>
  );
}
