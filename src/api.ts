const API_KEY = "2857cf74d732c58f2a83ca01b798ce02";
const BASE_PATH = "https://api.themoviedb.org/3/movie";

/*
API Docs url: https://developers.themoviedb.org/3/getting-started/introduction
API Requets Example: https://https://developers.themoviedb.org/3/getting-started/introductionapi.themoviedb.org/3/movie/550?api_key=2857cf74d732c58f2a83ca01b798ce02
API access tokens for read: eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyODU3Y2Y3NGQ3MzJjNThmMmE4M2NhMDFiNzk4Y2UwMiIsInN1YiI6IjY0MTU5NzRkZTc0MTQ2MDA3YzgxYWQzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.weRG6z8b21DMSWnrfxKailVXncwWadXWZhFVqjS-o8w
*/

export interface INowPlayingMovies {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: INowPlayingMovie[];
  total_pages: number;
  total_results: number;
}

export interface INowPlayingMovie {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

export const getNowPlaying = async () => {
  return await (
    await fetch(`${BASE_PATH}/now_playing?api_key=${API_KEY}`)
  ).json();
};

export const getSearchResult = async (movieId: number) => {
  return await (
    await fetch(
      `${BASE_PATH}/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`
    )
  ).json();
};
