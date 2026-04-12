import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { Genre } from '../models';
import { getGenre } from '../services/tmdb';

interface GenreContextData {
  genres: Genre[];
  isLoading: boolean;
}

const GenreContext = createContext<GenreContextData>({} as GenreContextData);

export function GenreProvider({ children }: { children: ReactNode }) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGenres() {
      try {
        const data = await getGenre();
        setGenres(data);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadGenres();
  }, []); 

  return (
    <GenreContext.Provider value={{ genres, isLoading }}>
      {children}
    </GenreContext.Provider>
  );
}

export function useGenres() {
  return useContext(GenreContext);
}