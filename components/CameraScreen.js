import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, Image, Text, TouchableOpacity, View, Modal, Alert, LogBox, ToastAndroid, Platform } from 'react-native';
import { requestPermissionsAsync } from 'expo-media-library';
import SettingsPanel from './SettingsPanel';
import BottomDataView from './BottomDataView';
import { PinchGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import { useHistory } from '../components/HistoryContext'

LogBox.ignoreAllLogs(false); // Show all logs including warnings and errors

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTime = (date) => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};




export default function CameraScreen({ navigation, route }) {
  const { scanType } = route.params || {};
  const { history, saveImage, addHistoryItem, downloadImages } = useHistory();



  const scannedDate = formatDate(new Date());
  const scannedTime = formatTime(new Date());

  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraMode, setCameraMode] = useState(scanType == 'auto' ? 'video' : 'photo');
  const [cameraRef, setCameraRef] = useState(null);
  const [image, setImage] = useState(null);
  const [responseFromAPI, setResponseFromAPI] = useState([]);
  const [showBottomData, setShowBottomData] = useState(false); 
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [isUploading, setisUploading] = useState(false);
  const [modalLoadingVisible, setModalLoadingVisible] = useState(true);
  const [cameraReady, setCameraReady] = useState(false); // New state for camera readiness
  const [isRecording, setIsRecording] = useState(false);
  const [audioPermission, setAudioPermission] = useMicrophonePermissions();
  const [zoom, setZoom] = useState(0);
  const [flash, setFlash] = useState('off');
  const [elapsedTime, setElapsedTime] = useState(0);




  useEffect(() => {
    (async () => {
      const mediaLibraryStatus = await requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    })();
  }, []);


  useEffect(() => {
    if (cameraRef) {
      if (cameraMode === 'photo') {
        if (isRecording) {
          cameraRef.stopRecording();
          setIsRecording(false);
          setElapsedTime(0);
        }
        const timer = setTimeout(() => {
          setCameraReady(true);
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [cameraMode, cameraRef, isRecording]);


  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, [isRecording]);


  const formatRecordingTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  if (!permission || !audioPermission) {
    return <View />;
  }


  if (!permission.granted || !audioPermission.granted) {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center", gap:20}}>
        <Text style={{textAlign: 'center'}}>We need your permission to show the camera and record audio</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
        <Button onPress={setAudioPermission} title="Grant Audio Permission" />
      </View>
    );
  }


  const onPinchGestureEvent = (event) => {
    let newZoom = zoom + (event.nativeEvent.scale - 1) / 10;
    newZoom = Math.min(Math.max(newZoom, 0), 1); // Ensure zoom stays within 0 to 1
    setZoom(newZoom);
  };


  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      setZoom(Math.min(Math.max(zoom, 0), 1)); // Ensure zoom stays within bounds
    }
  };


  const takePic = async () => {
    if (cameraRef && cameraReady) {
      try {
        setCameraMode('photo');
        const photo = await cameraRef.takePictureAsync();  
        if (photo?.uri) {
          setImage(photo.uri);
          await uploadImage(photo.uri);
        }
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    } else {
      console.log('Camera is not ready or cameraRef is null');
    }
  };
  

  const takeVid = async () => {
    if (cameraRef && cameraReady) {
      try {
        if (isRecording) {
          console.log('Stopping recording');
          await cameraRef.stopRecording();
          setIsRecording(false);
          setElapsedTime(0);
        } else {
          console.log('Starting recording');
          setIsRecording(true);
          const video = await cameraRef.recordAsync();
          setisUploading(true);
  
          if (video?.uri) {
            await uploadVideo(video.uri);
          }


          setIsRecording(false);
          setElapsedTime(0);
          setisUploading(false);
        }
      } catch (error) {
        console.error('Error handling video recording:', error);
      }
    } else {
      console.log('Camera is not ready or cameraRef is null');
    }
  };
  
// console.log("\n\n\n\n\n\n\n .\n\n")


  const uploadVideo = async (uri) => {
    const uploadUrl = 'http://192.168.43.223:3000/upload-video'; // Replace with your server's IP address
    try {
      const formData = new FormData();
      formData.append('video', {
        uri,
        type: 'video/mp4',
        name: 'video.mp4',
      });
      formData.append('scanType', scanType);

      console.log('Uploading video with FormData:', formData);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.firstThreeFrames) {


          const savedImagePath = await Promise.all(responseData.firstThreeFrames.map(async (frameUri) => await downloadImages(frameUri)));


          const newHistory = {
              starred: false, // Set to true if the image is starred
              imageList: savedImagePath,
              productData: responseData.productData,
              
              scanType: scanType,
              scannedDate: scannedDate,
              scannedTime: scannedTime,

              barcodeData: responseData.barcodeData,
              ocrData: responseData.ocrData,
              qrCodeData: responseData.qrCodeData

            };


          addHistoryItem(newHistory);
          console.log('Updated History:', JSON.stringify(newHistory, null, 2));


          setResponseFromAPI(responseData);
          setShowBottomData(true);
        }
      } else {
        console.error('Upload failed with status:', response.status);
        setShowBottomData(false);
        Alert.alert(
          'Upload Failed',
          'The server returned an error. Please try again later.',
          [
            { text: 'OK' },
          ],
          { cancelable: false }
        );
      }
    
  } catch (error) {
    console.log('Upload failed:', error);
    setShowBottomData(false);
    Alert.alert(
      'Upload Failed',
      'Failed to connect to the server. Please check your internet connection or try again later.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Retry',
          onPress: async () => {await uploadImage(uri)}, // Retry the upload
        },
      ],
      { cancelable: false }
    );
  } finally{
    setisUploading(false);
    console.log("End...?")
  }
};
  
// TODO: make sure that when te cameramode is changed it reflexts instantly.


const uploadImage = async (uri) => {
  setImage(uri);
  setisUploading(true);

  const uploadUrl = 'http://192.168.43.223:3000/upload-image'; // Replace with your server's IP address

  const formData = new FormData();
  formData.append('image', {
    uri,
    type: 'image/jpeg', // Adjust this based on your image type
    name: 'image.jpg', // Adjust this based on your image filename
  });
  formData.append('scanType', scanType);

  console.log('\n\n\nUploading image with FormData:', formData);

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      const responseData = await response.json();

      const savedImagePath = await saveImage(uri);

      
      const newHistory = {
        starred: false,
        imageList: [savedImagePath],
        productData: responseData.productData,

        scanType: scanType,
        scannedDate: scannedDate,
        scannedTime: scannedTime,

        barcodeData: responseData.barcodeData,
        ocrData: responseData.ocrData,
        qrCodeData: responseData.qrCodeData

      };

      addHistoryItem(newHistory);
      console.log('Updated History:', JSON.stringify(newHistory, null, 2));


      setResponseFromAPI(responseData);
      setShowBottomData(true);
    } else {
      console.error('Upload failed with status:', response.status);
      setShowBottomData(false);
      Alert.alert(
        'Upload Failed',
        'The server returned an error. Please try again later.',
        [
          { text: 'OK' },
        ],
        { cancelable: false }
      );
    }
  } catch (error) {
    console.log('Upload failed:', error);
    setShowBottomData(false);
    Alert.alert(
      'Upload Failed',
      'Failed to connect to the server. Please check your internet connection or try again later.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Retry',
          onPress: async () => {await uploadImage(uri)}, // Retry the upload
        },
      ],
      { cancelable: false }
    );
  } finally{
    setisUploading(false);
    console.log("End...?")
  }
};

  const handleTap = (event) => {
    if (event.nativeEvent.state === State.END) {
      setFlash(flash == 'on' ? 'off' : 'on');
      Platform.OS == 'android' ? ToastAndroid.show(flash == 'on' ? 'Flash Disabled' : 'Flash Enabled', ToastAndroid.SHORT) : Alert.alert(flash == 'on' ? 'Flash Disabled' : 'Flash Enabled');

    }
  };


// TODO Handle situation where server is down or, network issues arise.


  return (
    <View style={{backgroundColor: "black", flex: 1, justifyContent: 'center', width:"100%", position:"relative", height:400}}>

      <PinchGestureHandler
          onGestureEvent={onPinchGestureEvent}
          onHandlerStateChange={onPinchHandlerStateChange}
        >


      <TapGestureHandler
              onHandlerStateChange={handleTap}
              numberOfTaps={2} // Detect double taps
      >


      <CameraView style={{ flex: 1,}} facing={facing} ref={ref=>{setCameraRef(ref)}} mode={cameraMode} zoom={zoom} flash={flash} >
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent', margin: 64,}}>
          <View style={{flex: 1, alignSelf: 'flex-end', alignItems: 'center',}}>

          <TouchableOpacity onPress={cameraMode === 'photo' ? takePic : takeVid }  style={{ width:70, height:70, borderRadius:50, borderWidth:60, borderColor:"goldenrod", display:"flex", alignItems:"center", backgroundColor:"white", justifyContent: 'center', zIndex:100, borderWidth:1, marginBottom:40, }}>
          {isRecording ? (
                  <View style={{ width: 20, height: 20, backgroundColor: "red" }} />
                ) : (
                  cameraMode === 'photo' ? (
                    <Image source={require("../assets/CameraDark.png")} resizeMode='contain' style={{ width: "100%" }} />
                  ) : (
                    <Image source={require("../assets/VideoDark.png")} resizeMode='contain' style={{ width: "100%" }} />
                  )
                )}            
            </TouchableOpacity>
            {
              cameraMode === 'video' &&  isRecording &&
              <Text style={{color:"white", fontSize:20, textAlign:"center", marginTop:-10}}>{formatRecordingTime(elapsedTime)}</Text>
            }


            {isUploading && 
              <Modal animationType="slide" transparent={true} visible={modalLoadingVisible} onRequestClose={() => {setModalLoadingVisible(false);}}>
                <View style={{backgroundColor:"rgba(0,90,0,0.2)", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                  <Image source={require('../assets/loadingTwo.gif')} style={{width:"30%", height:"20%"}}/>
                  <Text style={{color:"white", fontSize:20, textAlign:"center", fontWeight:"bold"}}>{`Processing ${cameraMode.charAt(0).toUpperCase() + cameraMode.slice(1)}...`}</Text>
                </View>
               </Modal>
            }

            

          </View>
        </View>
      </CameraView>

      </TapGestureHandler>


      </PinchGestureHandler>


      <SettingsPanel navigation={navigation} cameraMode={cameraMode} setCameraMode={setCameraMode} cameraRef={cameraRef} isRecording={isRecording} setCameraReady={setCameraReady} zoom={zoom} setZoom={setZoom} flash={flash} setFlash={setFlash}  customStyles={{backgroundColor:"rgba(0,0,0,0.6)", position:"absolute",top:0, flex:1, justifyContent:"center", alignItems:"center", borderColor:"red", height:"100%", width:"85%"}}/>
      {showBottomData && <BottomDataView customStyles={{position:"absolute", bottom:0, left:0, right:0}} externalOpen={showBottomData} setExternalOpen={setShowBottomData} image={image} responseFromAPI={history} selectedItemKey={history.length -1} />}
    </View>
  );
}
