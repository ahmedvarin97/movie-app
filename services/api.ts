export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    HEADERS: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}
export const fetchMovies = async({query, page = 1}: {query?: string, page?: number}) => {
     const endpoint = query
     ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
     : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

     const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.HEADERS,
     });

     if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
     }

     const data = await response.json();

     return {results: data.results, total_pages: data.total_pages};
}

export const fetchMovieDetails = async(movieId: string): Promise<MovieDetails> => {
    try {
         const response = await fetch(
            `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
            {
                method: "GET",
                headers: TMDB_CONFIG.HEADERS,
            }
        );

        if (!response.ok) {
        throw new Error(`Failed to fetch movie details: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error)
        throw(error)
    }
}

export const fetchTrending = async() => {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/trending/movie/day`, {
        method: "GET",
        headers: TMDB_CONFIG.HEADERS,
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch trending movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
}