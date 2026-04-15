import { useState } from "react";

import "./App.css";
import type { Genre, Movie } from "./models";
import { useGenres } from "./context/genre-context-data";
import { descobertaDeFilmes, getOndeAssistir, type ProviderProps } from "./services/tmdb";
import { MovieCard } from "./components/movie-cards";
import { env } from "./env";
import { MovieFilters } from "./components/movie-filters";

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
}

function App() {
  const [count, setCount] = useState(0);
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [historyMovie, setHistoryMovie] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const [genreId, setGenreId] = useState<number | "">("");
  const [minRating, setMinRating] = useState<number>(0);
  const [yearMin, setYearMin] = useState<number | "">("");
  const [yearMax, setYearMax] = useState<number | "">("");

  const [providers, setProviders] = useState<{ streaming: ProviderProps[]; aluguel: ProviderProps[]; compra: ProviderProps[]; link: any } | null>(null)

  const { genres, isLoading } = useGenres();

  async function sortearFilmePersonalizado(filtros: MovieFiltersProps) {
    try {
      setIsFetching(true);

      const params: Payload = {
        page: 1,
        sort_by: "popularity.desc",
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
          const novaLista = [...prevHistory, movie.poster_path];
          return novaLista.slice(-3);
        });
      }

      setMovie(sorteado);

      const matchedGenres = genres.filter((g) =>
        sorteado.genre_ids.includes(g.id),
      );

      const providersResponse = await getOndeAssistir(sorteado.id);
      setProviders(providersResponse)

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
    // sortearFilme();
  }

  if (isLoading) return <p>Carregando site...</p>;

  return (
    <>
      <section id="center">
        <div className="hero">
          {/* <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" /> */}
        </div>
        <div>
          <h1>Find your movie</h1>
          <p>
            Não sabe o que assistir? Clique no botão abaixo e sorteie um filme
            aleatório entre os mais populares do momento! Com apenas um clique,
            descubra uma nova aventura cinematográfica para curtir.
          </p>
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
      </section>

      {movie && <MovieCard movie={movie} movieGenres={movieGenres} providers={providers}/>}

      {historyMovie.length > 0 && (
        <section className="history">
          <h2>Histórico de Filmes Sorteados</h2>
          <div className="history-list flex gap-4 overflow-x-auto py-4 justify-center">
            {historyMovie.map((posterPath, index) => (
              <img
                key={index}
                src={`${env.VITE_IMG_URL}${posterPath}`}
                alt={`Pôster de ${movie?.title}`}
                className="w-20 h-28 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </section>
      )}

      <div>Sorteios: {count}</div>
    </>
  );
}

export default App;
