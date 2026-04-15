import axios from "axios";
import { env } from "../env";
import type { DiscoverResponse, Genre, TmdbResponse } from "../models";

const {VITE_BASE_URL, VITE_BEARER_TOKEN} = env
const language = 'pt-BR';


export interface Payload{
  page?: number;
  'vote_average.gte'?: number;
  with_genres?: number | null;
  'primary_release_date.gte'?: string;
  'primary_release_date.lte'?: string;
  sort_by?: string;
}

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

export async function descobertaDeFilmes(params: Payload) : Promise<DiscoverResponse| undefined>{
    try{
      const response = await tmdb.get<DiscoverResponse>('/discover/movie', {
        params: params
      })
      return response.data
    } catch (error) {
      console.error('Error fetching discovered movies:', error)
    }
}