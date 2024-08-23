import React, { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity, Animated } from 'react-native';
import Slider from '@react-native-community/slider';


const SettingsPanel = ({ customStyles, navigation, setCameraMode, cameraMode, cameraRef, isRecording, setCameraReady, zoom, setZoom, flash, setFlash }) => {
  const [toggle, setToggle] = useState(true);
  const zoomIntervalRef = useRef(null);
  const [focus, setFocus] = useState(false);
  const [visible, setVisible] = useState(false); // Track visibility state




  const settings = [
    { key: '0', setting: "Zoom in", image: require("../assets/ZoomIn.png"), extraStyles: {}, extraStyles2: {} },
    { key: '1', setting: "Zoom Out", image: require("../assets/ZoomOut.png"), extraStyles: { width: 50 }, extraStyles2: {} },
    { key: '2', setting: "Video", image: require("../assets/VideoDisabled.png"), extraStyles: { width: 50 }, extraStyles2: { marginLeft: -10 } },
    { key: '3', setting: "Photo", image: require("../assets/Camera.png"), extraStyles: { width: 60 }, extraStyles2: { marginLeft: -10 } },
    { key: '4', setting: "Flash", image: flash == 'on' ? require("../assets/FlashOn.png") : require("../assets/FlashOff.png"), extraStyles: { width: 50, height:50 }, extraStyles2: { marginLeft: -20, marginBottom:15 } },
    { key: '5', setting: "History", image: require("../assets/History.png"), extraStyles: {}, extraStyles2: { marginLeft: -10 } },
  ];

  

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  useEffect(() => {
    const transitionCameraMode = async () => {
      if (cameraRef) {
        if (cameraMode === 'photo') {
          if (isRecording) {
            try {
              await cameraRef.stopRecording();
              setIsRecording(false);
            } catch (error) {
              console.error('Error stopping video recording:', error);
            }
          }
        }

        const timer = setTimeout(() => {
          setCameraReady(true);
        }, 500);

        return () => clearTimeout(timer);
      }
    };

    transitionCameraMode();
  }, [cameraMode, cameraRef, isRecording]);

  const increaseZoom = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 1));
    setVisible(true); // Ensure slider is visible when zooming
    setTimeout(()=>{console.log(setVisible(false))}, 1000);

  };

  const decreaseZoom = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0));
    setVisible(true); // Ensure slider is visible when zooming
    setTimeout(()=>{console.log(setVisible(false))}, 1000);
  };

  const startZooming = (direction) => {
    zoomIntervalRef.current = setInterval(() => {
      setZoom(prevZoom => {
        let newZoom = prevZoom + direction * 0.1;
        return Math.min(Math.max(newZoom, 0), 1);
      });
    }, 100);
  };

  const stopZooming = () => {
    if (zoomIntervalRef.current) {
      clearInterval(zoomIntervalRef.current);
      zoomIntervalRef.current = null;
    }
    setVisible(false); // Hide slider after zooming stops
  };

  const renderItems = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          switch (item.key) {
            case '0':
              increaseZoom();
              break;
            case '1':
              decreaseZoom();
              break;
            case '2':
              setCameraMode('video');
              break;
            case '3':
              setCameraMode('photo');
              break;
            case '4':
              setFlash(flash == 'on' ? 'off' : 'on');
              break;
            case '5':
              navigation.navigate('History');
              break;
          }
          if (item.key === '0' || item.key === '1' || item.key === '4') {
            return;
          }
          setToggle(!toggle);
        }}
        onPressIn={() => {
          if (item.key === '0' || item.key === '1') {
            setFocus(true);
            setVisible(true);
          }
        }}
        onLongPress={() => {
          if (item.key === '0') {
            startZooming(1);  // Zoom in
          } else if (item.key === '1') {
            startZooming(-1);  // Zoom out
          }
        }}
        onPressOut={() => {
          if (item.key === '0' || item.key === '1') {
            stopZooming();
            setFocus(false);
            // Hide slider with a delay to ensure it doesn't disappear immediately
            setTimeout(() => {
              if (!focus) {
                setVisible(false);
              }
            }, 2000);
          }
        }}

        disabled={item.key === '2' ? true : false}
        style={{ display: "flex", alignItems: 'center', justifyContent: 'center', padding: 10, margin: 10, width: "40%", borderRadius: 20, gap: 5, height: 100 }}
      >
        <Image source={item.image} style={[{ width: 30, height: 30, marginRight: 10 }, item.extraStyles]} />
        <Text style={[{ color: item.key === '2' ? 'grey' : 'white', fontSize: 15, }, item.extraStyles2]}>{item.setting}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[{ backgroundColor: '#333', padding: 10, width: '80%', height: '50%', left: toggle ? "-100%" : 0, zIndex: toggle ? 5 : 10 }, customStyles]}>
      <FlatList
        keyExtractor={(item) => item.key}
        data={settings}
        renderItem={renderItems}
        numColumns={2}
        contentContainerStyle={{ flexGrow: 0, gap: 10, alignItems: "center", justifyContent: "center", height: "100%" }}
      />
      <Animated.View style={{ opacity: fadeAnim, marginTop: 20 }}>
      <Slider
        style={{ width: 250, height: 40 }}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={zoom}
        onValueChange={(value) => setZoom(value)}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="grey"
        thumbTintColor="white"
        onTouchStart={() => {
          setVisible(true); // Ensure it's set to true on touch start
        }}
        onTouchEnd={() => {
          setTimeout(() => {
            setVisible(false); // Properly set visibility to false after delay
          }, 5000);
        }}
      />

        <Text style={{ color: "white", fontSize: 15, fontWeight: "bold", textAlign: "center" }}>{(zoom * 100).toFixed(0)}%</Text>
      </Animated.View>
      <TouchableOpacity onPress={() => setToggle(!toggle)} style={[{ position: "absolute", left: toggle ? "120%" : "100%", color: "white", padding: 2, paddingLeft: toggle ? 10 : 0, backgroundColor: "black", height: "25%", borderRightColor: "white", borderTopColor: "white", borderBottomColor: "white", borderWidth: 2, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }, toggle ? {} : { borderLeftColor: "white" }]}>
        <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}> {toggle ? '\u27E9' : '\u27E8'} </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsPanel;
