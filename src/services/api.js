import { API_KEY, BASE_URL } from '../config/tmdb';

export const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1&include_adult=false`
    );
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.status_message || 'Erro ao buscar filmes');
    }
    
    return data.results || [];
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return [];
  }
};

export const getMovieSuggestions = async (genre, year, rating) => {
  try {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&include_adult=false`;
    
    // Adiciona filtros apenas se estiverem presentes
    if (genre) {
      url += `&with_genres=${genre}`;
    }
    
    if (year) {
      url += `&primary_release_year=${year}`;
    }
    
    if (rating) {
      url += `&vote_average.gte=${rating}`;
    }

    // Adiciona parâmetros adicionais para melhorar os resultados
    url += '&vote_count.gte=100'; // Filmes com pelo menos 100 votos
    url += '&page=1';

    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.status_message || 'Erro ao buscar sugestões');
    }
    
    return data.results || [];
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error);
    return [];
  }
};

export const getGenres = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
    );
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.status_message || 'Erro ao buscar gêneros');
    }
    
    return data.genres || [];
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    return [];
  }
};
