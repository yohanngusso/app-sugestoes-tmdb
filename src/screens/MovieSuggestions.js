import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  Animated,
  Alert,
} from 'react-native';
import {
  Picker
} from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getMovieSuggestions, getGenres, searchMovies } from '../services/api';
import MovieDetails from '../components/MovieDetails';

const MovieSuggestions = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [rating, setRating] = useState(7);
  const [ratingText, setRatingText] = useState('7');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);

  const filterHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      const genresList = await getGenres();
      setGenres(genresList);
    } catch (err) {
      setError('Erro ao carregar gêneros: ' + err.message);
      Alert.alert('Erro', 'Não foi possível carregar os gêneros. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = async () => {
    if (searchQuery.trim()) {
      try {
        setLoading(true);
        setError(null);
        const results = await searchMovies(searchQuery);
        setMovies(results);
        if (results.length === 0) {
          Alert.alert('Aviso', 'Nenhum filme encontrado para sua busca.');
        }
      } catch (err) {
        setError('Erro na busca rápida: ' + err.message);
        Alert.alert('Erro', 'Ocorreu um erro durante a busca. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const suggestions = await getMovieSuggestions(selectedGenre, selectedYear, rating);
      setMovies(suggestions);
      if (suggestions.length === 0) {
        Alert.alert('Aviso', 'Nenhum filme encontrado com os filtros selecionados.');
      }
    } catch (err) {
      setError('Erro na busca com filtros: ' + err.message);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar sugestões. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilters = () => {
    const toValue = showFilters ? 0 : 1;
    setShowFilters(!showFilters);
    Animated.spring(filterHeight, {
      toValue,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const handleMoviePress = (movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const renderMovie = ({ item }) => {
    if (!item.poster_path) return null;

    return (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() => handleMoviePress(item)}
        activeOpacity={0.7}
      >
        <Image
          style={styles.moviePoster}
          source={{
            uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          }}
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.movieYear}>
            {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
          </Text>
          <Text style={styles.movieRating}>⭐ {item.vote_average?.toFixed(1) || 'N/A'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const years = Array.from(
    { length: 50 },
    (_, i) => (new Date().getFullYear() - i).toString()
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar filme..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleQuickSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setSearchQuery('');
                setMovies([]);
              }}
              style={styles.clearButton}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={toggleFilters}
          >
            <MaterialIcons 
              name={showFilters ? "expand-less" : "expand-more"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        <Animated.View style={[
          styles.filters,
          {
            maxHeight: filterHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500]
            }),
            opacity: filterHeight,
            overflow: 'hidden',
          }
        ]}>
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.label}>Gênero</Text>
              <Picker
                selectedValue={selectedGenre}
                onValueChange={(value) => setSelectedGenre(value)}
                style={styles.picker}
                mode={Platform.OS === 'android' ? 'dropdown' : 'default'}>
                <Picker.Item label="Todos" value="" />
                {genres.map((genre) => (
                  <Picker.Item key={genre.id} label={genre.name} value={genre.id} />
                ))}
              </Picker>
            </View>

            <View style={styles.filterItem}>
              <Text style={styles.label}>Ano</Text>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(value) => setSelectedYear(value)}
                style={styles.picker}
                mode={Platform.OS === 'android' ? 'dropdown' : 'default'}>
                <Picker.Item label="Todos" value="" />
                {years.map((year) => (
                  <Picker.Item key={year} label={year} value={year} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.label}>Avaliação mínima</Text>
            <TextInput
              style={styles.ratingInput}
              value={ratingText}
              onChangeText={(text) => {
                setRatingText(text);
                const value = parseFloat(text);
                if (!isNaN(value) && value >= 0 && value <= 10) {
                  setRating(value);
                } else if (text === '') {
                  setRating(0);
                }
              }}
              keyboardType="numeric"
              placeholder="0-10"
              maxLength={4}
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              handleSearch();
              toggleFilters();
            }}
          >
            <Text style={styles.buttonText}>Buscar Sugestões</Text>
          </TouchableOpacity>
        </Animated.View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <FlatList
            data={movies}
            renderItem={renderMovie}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        )}

        <MovieDetails
          movie={selectedMovie}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 12,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    marginLeft: 8,
    padding: 4,
  },
  filters: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    margin: 16,
    marginTop: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  filterItem: {
    flex: 1,
    minHeight: 80,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
    paddingLeft: 4,
  },
  picker: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    height: 50,
  },
  ratingContainer: {
    marginBottom: 12,
    paddingHorizontal: 7,
  },
  ratingInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moviePoster: {
    width: 100,
    height: 150,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  movieYear: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  movieRating: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef5350',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
});

export default MovieSuggestions;
