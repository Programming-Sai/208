import React from 'react';
import { SafeAreaView, Text, StatusBar, Settings } from 'react-native';
import CameraScreen from './components/CameraScreen';
import Home from './components/HomeScreen';
import History from './components/HistoryScreen';

const App = () => {
  return (
    <SafeAreaView style={{padding:20, backgroundColor:"black"}}>
      <StatusBar barStyle="light-content" style={{backgroundColor:"red"}}/>
      {/* <CameraScreen /> */}
      {/* <Home /> */}
      <History />
    </SafeAreaView>
  );
};

export default App;
