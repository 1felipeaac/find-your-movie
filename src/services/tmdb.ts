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
  watch_region?: string;
  with_watch_monetization_types?: string;
}

export interface ProviderProps {
  provider_id: number;
  provider_name: string;
  logo_path: string;
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

export async function getOndeAssistir(movieId: number) {
  try {
    const response = await tmdb.get(`/movie/${movieId}/watch/providers`, {
      params: {api_key: env.VITE_API_KEY}
    });
    
    const dadosBrasil = response.data.results.BR;

    if (!dadosBrasil) {
      return null;
    }

    return {
      streaming: dadosBrasil.flatrate as ProviderProps[] || [],
      aluguel: dadosBrasil.rent as ProviderProps[] || [],
      compra: dadosBrasil.buy as ProviderProps[] || [],
      link: dadosBrasil.link 
    };

  } catch (error) {
    console.error("Erro ao buscar provedores:", error);
    return null;
  }
}