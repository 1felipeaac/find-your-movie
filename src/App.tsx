import { useState, useEffect, useRef } from "react";

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
import { AppPresentation } from "./components/app-presentation";
import { handleDrawLimit } from "./utils";
import { appFooter } from "./components/app-footer";

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
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [historyMovie, setHistoryMovie] = useState<HistoryItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const [genreId, setGenreId] = useState<number | "">("");
  const [minRating, setMinRating] = useState<number>(0);
  const [yearMin, setYearMin] = useState<number | "">("");
  const [yearMax, setYearMax] = useState<number | "">("");

  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  const [cooldownTime, setCooldownTime] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

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

    const isAllowed = handleDrawLimit();

    if (!isAllowed) {
      setLimitMessage("Limite de 4 sorteios atingido! Volte mais tarde para sortear novos filmes.");
  
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setLimitMessage(null);
      }, 5000);

      return; 
    }

    sortearFilmePersonalizado({
      minRating,
      genreId,
      yearMin,
      yearMax,
    });
  }

  useEffect(() => {
    const checkCooldown = () => {
      const resetTime = Number(localStorage.getItem('fym_resetTime')) || 0;
      const drawCount = Number(localStorage.getItem('fym_drawCount')) || 0;
      const now = Date.now();

      
      if (drawCount >= 4 && now < resetTime) {
        const tempoRestante = resetTime - now;
        
        const horas = Math.floor(tempoRestante / (1000 * 60 * 60));
        const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);


        const hFormatado = horas.toString().padStart(2, '0');
        const mFormatado = minutos.toString().padStart(2, '0');
        const sFormatado = segundos.toString().padStart(2, '0');

        setCooldownTime(`${hFormatado}h ${mFormatado}m ${sFormatado}s`);
      } else {
        
        setCooldownTime(null);
        
        
        if (drawCount >= 4 && now >= resetTime) {
          localStorage.setItem('fym_drawCount', '0');
        }
      }
    };

    
    checkCooldown();

    
    const intervalId = setInterval(checkCooldown, 1000);

    
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) return <p>Carregando site...</p>;

  return (
    <>
      <section id="center">
        <div className="hero"></div>
        <div className={`w-full max-w-sm mx-auto`}>
          <Logo className="w-full h-auto mb-4 bg-gray-500 rounded-2xl" />
          <div className="flex flex-col gap-6 text-center max-w-2xl mx-auto mt-4 mb-8">
            <AppPresentation/>
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

        <button 
          className="counter" 
          onClick={handleClick} 
          disabled={isFetching}
        >
          Sortear Filme
        </button>

        {limitMessage && (
          <div className={`
            mt-4 p-3 bg-red-500/10 border border-red-500/50 
            text-red-400 text-sm font-medium 
            rounded-lg text-center max-w-sm mx-auto 
            shadow-lg animate-pulse`}
          >
            {limitMessage}
          </div>
        )}

        {movie && (
          <MovieCard
            movie={movie}
            movieGenres={movieGenres}
            providers={providers}
          />
        )}
        <Moviehistory historyMovie={historyMovie} />
      </section>

      {cooldownTime !== null && appFooter(cooldownTime)}

    </>
  );
}

export default App;
