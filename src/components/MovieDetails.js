import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MovieDetails = ({ movie, visible, onClose }) => {
  if (!movie) return null;

  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <ScrollView>
            <View style={styles.posterContainer}>
              <Image
                style={styles.poster}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }}
              />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.title}>{movie.title}</Text>
              <Text style={styles.year}>({releaseYear})</Text>

              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={20} color="#FFD700" />
                <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
                <Text style={styles.votes}>({movie.vote_count} votos)</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sinopse</Text>
                <Text style={styles.overview}>
                  {movie.overview || 'Sinopse não disponível.'}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Data de Lançamento:</Text>
                  <Text style={styles.infoText}>
                    {new Date(movie.release_date).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Popularidade:</Text>
                  <Text style={styles.infoText}>
                    {movie.popularity.toFixed(1)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Idioma Original:</Text>
                  <Text style={styles.infoText}>
                    {movie.original_language.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '90%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  posterContainer: {
    width: '100%',
    height: undefined,
    aspectRatio: 2/3,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  year: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#1a1a1a',
  },
  votes: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    width: 150,
  },
  infoText: {
    fontSize: 15,
    color: '#1a1a1a',
    flex: 1,
    fontWeight: '500',
  },
});

export default MovieDetails;
