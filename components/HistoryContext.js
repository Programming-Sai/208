import React, { createContext, useState, useEffect, useContext } from 'react';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Directory for saving images in the file system
const imagesDirectory = FileSystem.documentDirectory + 'images/';

// Create the History Context
const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  // Load history data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        const data = await AsyncStorage.getItem('historyData');
        if (data) {
          setHistory(JSON.parse(data)); // Update history state with the loaded data
        }
      } catch (error) {
        console.error('Failed to load history from AsyncStorage:', error);
      }
    };

    loadHistoryData();
    displayHistory();
  }, []);

  // Save history data to AsyncStorage whenever it's updated
  const saveHistoryData = async (data) => {
    try {
      await AsyncStorage.setItem('historyData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save history to AsyncStorage:', error);
    }
    displayHistory();
  };

  // Add a new item to the history
  const addHistoryItem = async (item) => {
    const updatedHistory = [...history, item];
    setHistory(updatedHistory);
    await saveHistoryData(updatedHistory); // Save updated history to AsyncStorage
    displayHistory();
  };

  // Remove an item from the history by index
  const removeHistoryItem = async (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    await saveHistoryData(updatedHistory); // Save updated history to AsyncStorage
    displayHistory();
  };

  // Toggle the starred status of an item in the history
  const toggleStarredItem = async (index) => {
    const updatedHistory = history.map((item, i) =>
      i === index ? { ...item, starred: !item.starred } : item
    );
    setHistory(updatedHistory);
    await saveHistoryData(updatedHistory); // Save updated history to AsyncStorage
  };

  // Save an image to the file system and return the path
  const saveImage = async (uri, imageName) => {
    try {
      const imagePath = imagesDirectory + imageName;
      await FileSystem.copyAsync({ from: uri, to: imagePath });
      return imagePath; // Return the path of the saved image
    } catch (error) {
      console.error('Failed to save image:', error);
      throw error;
    }
  };


  const displayHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('historyData');
      if (data) {
        console.log('Current history:', JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to retrieve history from AsyncStorage:', error);
    }
  };



  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('historyData');
      setHistory([]); // Clear the history state
    } catch (error) {
      console.error('Failed to clear history from AsyncStorage:', error);
    }
    displayHistory(); // Display history after clearing
  };





//   clearHistory()




  return (
    <HistoryContext.Provider
      value={{
        history,
        addHistoryItem,
        removeHistoryItem,
        toggleStarredItem,
        saveImage,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

// Custom hook to access the History Context
export const useHistory = () => {
  return useContext(HistoryContext);
};
