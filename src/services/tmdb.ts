import axios from "axios";
import { env } from "../env";
import type { Genre, TmdbResponse } from "../models";

const {VITE_BASE_URL, VITE_BEARER_TOKEN} = env
const language = 'pt-BR';


export const tmdb = axios.create({
    baseURL: VITE_BASE_URL,
    headers: {
    'Authorization': `Bearer ${VITE_BEARER_TOKEN}`,
    Accept: 'application/json',
    },
    params:{
        language: language
    }
})

export async function getGenre() : Promise<Genre[]>{
    const response = await tmdb.get('/genre/movie/list')
    return response.data.genres
}

export async function popularMoviesForPage(page: number) : Promise<TmdbResponse| undefined>{
    try{

      const response = await tmdb.get<TmdbResponse>('/movie/popular', {
        params: { page: page }
      })

      return response.data
    } catch (error) {
      console.error('Error fetching popular movies:', error)
    }
  }