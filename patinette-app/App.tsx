import 'react-native-gesture-handler';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './src/screens/Home';
import Login from './src/screens/Login';
import Register from './src/screens/Register';

import Profile from './src/screens/Profile';
import Map from './src/screens/Map';
import Scanner from './src/screens/Scanner';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

function LoggedHome() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Map') {
            iconName = focused
              ? 'ios-map'
              : 'ios-map-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'people-circle-outline';

          } else if (route.name === 'Scanner') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#E6B400',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Scanner" component={Scanner} />
    </Tab.Navigator >
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="LoggedHome" component={LoggedHome} />
        {/* <Stack.Screen name="Profile" component={Profile} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}