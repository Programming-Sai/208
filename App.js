import React from 'react';
import { SafeAreaView, Text, StatusBar, Settings } from 'react-native';
import CameraScreen from './components/CameraScreen';
import Home from './components/HomeScreen';
import History from './components/HistoryScreen';
import Starred from './components/StarredScreen';

const App = () => {
  return (
    <SafeAreaView style={{backgroundColor:"black", flex:1}}>
      <StatusBar barStyle="light-content" style={{backgroundColor:"red"}}/>
      {/* <CameraScreen /> */}
      {/* <Home /> */}
      {/* <History /> */}
      <Starred />
    </SafeAreaView>
  );
};

export default App;
