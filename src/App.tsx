import { useState } from 'react'

import './App.css'
import type { Genre, Movie } from './models'
import { useGenres } from './context/genre-context-data'
import { popularMoviesForPage } from './services/tmdb'
import { MovieCard } from './components/movie-cards'
import { env } from './env'



function App() {
  const [count, setCount] = useState(0)
  const [movie, setMovie] = useState<Movie | undefined>(undefined)
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [historyMovie, setHistoryMovie] = useState<string[]>([]);

  const { genres, isLoading } = useGenres();


  async function getTrueRandomMovie(){
    try {
      const randomPage = Math.floor(Math.random() * 500) + 1;
      const response = await popularMoviesForPage(randomPage);
      const randomIndex = Math.floor(Math.random() * 20);
      
      if (!response) {
        console.error('No response from popularMoviesForPage');
        return undefined;
      }

      const sorteado = response.results[randomIndex];

      if (movie) {
        setHistoryMovie((prevHistory) => {
          const novaLista = [...prevHistory, movie.poster_path];
          return novaLista.slice(-5);
        });
      }

      setMovie(sorteado);

      const matchedGenres = genres.filter(g => sorteado.genre_ids.includes(g.id));
      setMovieGenres(matchedGenres);

    } catch (error) {
      console.error('Erro:', error);
    }
  }

  function handleClick() {
    setCount((count) => count + 1);
    getTrueRandomMovie();
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
            Não sabe o que assistir? Clique no botão abaixo e sorteie um filme aleatório entre os mais populares do momento! Com apenas um clique, descubra uma nova aventura cinematográfica para curtir.
          </p>
        </div>
        <button
          className="counter"
          onClick={handleClick}
        >
          Sortear Filme
        </button>
      </section>

      {movie && <MovieCard movie={movie} movieGenres={movieGenres} />}

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
  )
}

export default App
