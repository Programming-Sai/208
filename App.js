import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from './components/CameraScreen';
import Home from './components/HomeScreen';
import History from './components/HistoryScreen';
import Starred from './components/StarredScreen';
import { HistoryProvider } from './components/HistoryContext'; // Import HistoryProvider
const Stack = createStackNavigator();

const App = () => {
  return (
    <HistoryProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Camera' component={CameraScreen} />
          <Stack.Screen name='History' component={History} />
          <Stack.Screen name='Favourites' component={Starred} />
        </Stack.Navigator>
      </NavigationContainer>
    </HistoryProvider>
  );
};

const withSafeAreaView = (Component) => {
  return (props) => (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={'black'} translucent/>
      <Component {...props} />
    </SafeAreaView>
  );
};

export default withSafeAreaView(App);
