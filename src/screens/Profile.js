import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus dados');
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
      });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar seu perfil');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // A navegação será tratada pelo AuthContext
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={userData.name}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
          editable={isEditing}
        />
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={userData.email}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={userData.phone}
          onChangeText={(text) => setUserData({ ...userData, phone: text })}
          keyboardType="phone-pad"
          editable={isEditing}
        />
        <TextInput
          style={styles.input}
          placeholder="Endereço"
          value={userData.address}
          onChangeText={(text) => setUserData({ ...userData, address: text })}
          multiline
          editable={isEditing}
        />
      </View>

      {isEditing ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleUpdate}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setIsEditing(false);
              loadUserData();
            }}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CD964',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#FF3B30',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginTop: 20,
  },
});

export default Profile;
