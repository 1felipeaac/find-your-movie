import { useState } from "react";

import "./App.css";
import type { Genre, Movie } from "./models";
import { useGenres } from "./context/genre-context-data";
import {
  descobertaDeFilmes,
  getOndeAssistir,
  type ProviderProps,
} from "./services/tmdb";
import { MovieCard } from "./components/movie-cards";
import { MovieFilters } from "./components/movie-filters";
import { Moviehistory, type HistoryItem } from "./components/movie.history";
import Logo from "./assets/logo.svg?react";

interface MovieFiltersProps {
  minRating: number;
  genreId: number | "";
  yearMin: number | "";
  yearMax: number | "";
}

interface Payload {
  page?: number;
  "vote_average.gte"?: number;
  with_genres?: number | null;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  sort_by?: string;
  watch_region?: string;
  with_watch_monetization_types?: string;
}

function App() {
  const [count, setCount] = useState(0);
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [historyMovie, setHistoryMovie] = useState<HistoryItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const [genreId, setGenreId] = useState<number | "">("");
  const [minRating, setMinRating] = useState<number>(0);
  const [yearMin, setYearMin] = useState<number | "">("");
  const [yearMax, setYearMax] = useState<number | "">("");

  const [providers, setProviders] = useState<{
    streaming: ProviderProps[];
    aluguel: ProviderProps[];
    compra: ProviderProps[];
    link: string;
  } | null>(null);

  const { genres, isLoading } = useGenres();

  async function sortearFilmePersonalizado(filtros: MovieFiltersProps) {
    try {
      setIsFetching(true);

      const params: Payload = {
        page: 1,
        sort_by: "popularity.desc",
        watch_region: "BR",
        with_watch_monetization_types: "flatrate",
      };

      if (filtros.genreId) {
        params.with_genres = filtros.genreId;
      }

      if (filtros.minRating > 0) {
        params["vote_average.gte"] = filtros.minRating;
      }

      if (
        filtros.yearMin &&
        filtros.yearMax &&
        filtros.yearMin <= filtros.yearMax
      ) {
        params["primary_release_date.gte"] = `${filtros.yearMin}-01-01`;
        params["primary_release_date.lte"] = `${filtros.yearMax}-12-31`;
      }

      const initialResponse = await descobertaDeFilmes(params);

      if (!initialResponse) {
        console.error("No response from descobertaDeFilmes");
        return undefined;
      }

      const totalPages = Math.min(initialResponse.total_pages, 500);

      const randomPage = Math.floor(Math.random() * totalPages) + 1;

      const finalResponse = await descobertaDeFilmes({
        ...params,
        page: randomPage,
      });

      if (!finalResponse) {
        console.error("No response from descobertaDeFilmes");
        return undefined;
      }

      const randomIndex = Math.floor(
        Math.random() * finalResponse.results.length,
      );
      const sorteado = finalResponse.results[randomIndex];

      if (movie) {
        setHistoryMovie((prevHistory) => {
          const filmeAntigoParaSalvar = {
            poster_path: movie.poster_path,
            title: movie.title,
            link: providers?.link,
          };

          const novaLista = [...prevHistory, filmeAntigoParaSalvar];
          return novaLista.slice(-3);
        });
      }

      setMovie(sorteado);

      const matchedGenres = genres.filter((g) =>
        sorteado.genre_ids.includes(g.id),
      );

      const providersResponse = await getOndeAssistir(sorteado.id);
      setProviders(providersResponse);

      setMovieGenres(matchedGenres);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  }

  function handleClick() {
    setCount((count) => count + 1);
    sortearFilmePersonalizado({
      minRating,
      genreId,
      yearMin,
      yearMax,
    });
  }

  if (isLoading) return <p>Carregando site...</p>;

  return (
    <>
      <section id="center">
        <div className="hero"></div>
        <div className={`w-full max-w-sm mx-auto`}>
          <Logo className="w-full h-auto mb-4 bg-gray-500 rounded-2xl" />
          <div className="flex flex-col gap-6 text-center max-w-2xl mx-auto mt-4 mb-8">
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
          </div>
        </div>

        <MovieFilters
          genres={genres}
          genreId={genreId}
          setGenreId={setGenreId}
          minRating={minRating}
          setMinRating={setMinRating}
          yearMin={yearMin}
          setYearMin={setYearMin}
          yearMax={yearMax}
          setYearMax={setYearMax}
        />

        <button className="counter" onClick={handleClick} disabled={isFetching}>
          Sortear Filme
        </button>

        {movie && (
          <MovieCard
            movie={movie}
            movieGenres={movieGenres}
            providers={providers}
          />
        )}
        <Moviehistory historyMovie={historyMovie} />
      </section>

      <footer>Total Sorteados {count}</footer>
    </>
  );
}

export default App;
