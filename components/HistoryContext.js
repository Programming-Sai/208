import React, { createContext, useState, useEffect, useContext } from 'react';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEqual } from 'lodash';




// Create the History Context
const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [starredHistory, setStarredHistory] = useState(() => {
    // Ensure 'history' is treated as an array, even if it's not populated
    const safeHistory = Array.isArray(history) ? history : [];
    return safeHistory.filter(item => item.starred === true);
  });
  const [removeHistoryCountNote, setRemoveHistoryCountNote] = useState(false);
  

  // Load history data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        const data = await AsyncStorage.getItem('historyData');
        if (data) {
          historyData = JSON.parse(data);
          setHistory(historyData); // Update history state with the loaded data
          setStarredHistory(historyData.filter(item => item.starred === true));
        }
      } catch (error) {
        console.error('Failed to load history from AsyncStorage:', error);
      }
    };

    loadHistoryData();
  }, []);


  useEffect(() => {
    const logAsyncStorageData = async () => {
      try {
        const data = await AsyncStorage.getItem('historyData');
        if (data) {
          console.log('Data in AsyncStorage:', JSON.parse(data));
        } else {
          console.log('No data found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Failed to retrieve data from AsyncStorage:', error);
      }

    console.log("\n\n\n")
    };

    logAsyncStorageData();
  });




  // Save history data to AsyncStorage whenever it's updated
  const saveHistoryData = async (data) => {
    try {
      await AsyncStorage.setItem('historyData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save history to AsyncStorage:', error);
    }
    // displayHistory();
  };

  // Add a new item to the history
  const addHistoryItem = async (item) => {
    displayHistory()
    const updatedHistory = [...history, item];
    setHistory(updatedHistory);
    await saveHistoryData(updatedHistory); // Save updated history to AsyncStorage
    displayHistory()
    setRemoveHistoryCountNote(true);
  };

  // Remove an item from the history by index
  const removeHistoryItem = async (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    setStarredHistory(updatedHistory.filter(item => item.starred === true));
    await saveHistoryData(updatedHistory); // Save updated history to AsyncStorage
    // displayHistory();
    console.log('Current History Length:', history.length, '\nIndex: ', index)
  };

  // removeHistoryItem(0);



  const saveImage = async (uri) => {
    try {
      const timestamp = new Date().toISOString();
      const imageName = `image_${timestamp}.jpg`;      
      const imagesDirectory = `${FileSystem.documentDirectory}images/`; // Expo's document directory
  
      // Ensure the directory exists
      const dirInfo = await FileSystem.getInfoAsync(imagesDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imagesDirectory, { intermediates: true });
      }
  
      const imagePath = imagesDirectory + imageName;
      await FileSystem.copyAsync({ from: uri, to: imagePath });
      return imagePath; // Return the path of the saved image
    } catch (error) {
      console.error('Failed to save image:', error);
      throw error;
    }
  };



  const downloadImages = async (uri) => {
    try {
      const timestamp = new Date().toISOString();
      const imageName = `image_${timestamp}.jpg`;      
      const imagesDirectory = `${FileSystem.documentDirectory}images/`; // Expo's document directory
  
      // Ensure the directory exists
      const dirInfo = await FileSystem.getInfoAsync(imagesDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imagesDirectory, { intermediates: true });
      }
  
      // Download the image from the remote URI
      const downloadedImage = await FileSystem.downloadAsync(uri, `${imagesDirectory}${imageName}`);
      
      // Return the local file path of the downloaded image
      return downloadedImage.uri;
  
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



  const toggleStarredItem = async (index) => {
    const updatedHistory = history.map((item, i) => {
      if (i === index) {
        return { ...item, starred: !item.starred }; // Toggle the starred property
      }
      return item;
    });
    console.log(`\n\n\nitem at ${index}`, history[index], '\n\n\n')
  
    setHistory(updatedHistory); // Update the state
    const filteredStarredHistory = updatedHistory.filter(item => item.starred === true);
    setStarredHistory(filteredStarredHistory);
    await saveHistoryData(updatedHistory); // Save the updated history to AsyncStorage
    // displayHistory(); // Optional: Display the history for debugging
  };


  
  const removeStarredItem = async (index) => {
    console.log('\n\n\nSomething Is to be Removed?')
    const idx = history.findIndex(item => isEqual(item, starredHistory[index]));
    if (idx !== -1) {
        const updatedHistory = [...history]; // Create a copy of the history array
        updatedHistory[idx] = { ...updatedHistory[idx], starred: false }; // Update the item in the copied array
        
        console.log(`\n\n\nitem at ${index}`, starredHistory[index], '\n\n\n');
        
        setHistory(updatedHistory); 
        const filteredStarredHistory = updatedHistory.filter(item => item.starred === true);
        setStarredHistory(filteredStarredHistory); 
        await saveHistoryData(updatedHistory); 
        // displayHistory(); 
    }
};

  



  const unStarAll = async () => {
    const updatedHistory = history.map((item) => ({
        ...item,
        starred: false,
      }));
    
      // Update the history state
      setHistory(updatedHistory);
    
      // Since all items are un-starred, starredHistory should be empty
      setStarredHistory([]);
    await saveHistoryData(updatedHistory); // Save the updated history to AsyncStorage
    // displayHistory(); // Optional: Display the history for debugging
  }; 
  



    const clearHistory = async () => {
        try {
        await AsyncStorage.removeItem('historyData');
        setHistory([]); // Clear the history state
        } catch (error) {
        console.error('Failed to clear history from AsyncStorage:', error);
        }
        clearDirectory(`${FileSystem.documentDirectory}images/`);
        displayHistory(); // Display history after clearing
    };

    // clearHistory()

    const clearDirectory = async (directoryPath) => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(directoryPath);

        if (dirInfo.exists) {
        // Delete the entire directory
        await FileSystem.deleteAsync(directoryPath, { idempotent: true });
        console.log('Directory deleted:', directoryPath);

        // Recreate the directory if needed
        await FileSystem.makeDirectoryAsync(directoryPath);
        console.log('Directory recreated:', directoryPath);
        } else {
        console.log('Directory does not exist:', directoryPath);
        }
    } catch (error) {
        console.error('Failed to clear directory:', error);
    }
    };



  return (
    <HistoryContext.Provider
      value={{
        history,
        setHistory,
        addHistoryItem,
        removeHistoryItem,
        saveImage,
        clearHistory,
        toggleStarredItem,
        starredHistory, 
        setStarredHistory,
        unStarAll,
        downloadImages,
        removeStarredItem,
        removeHistoryCountNote, 
        setRemoveHistoryCountNote
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
