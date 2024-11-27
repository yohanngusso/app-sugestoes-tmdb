import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Login from './src/screens/Login';
import Register from './src/screens/Register';
import MovieSuggestions from './src/screens/MovieSuggestions';
import Profile from './src/screens/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            paddingBottom: 5,
            height: 60,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666666',
        }}>
        <Tab.Screen 
          name="Sugestões" 
          component={MovieSuggestions}
          options={{
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="movie-filter" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Perfil" 
          component={Profile}
          options={{
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const Navigation = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="MainApp" component={AppTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
