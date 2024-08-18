import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, Image, Text, TouchableOpacity, View, Modal } from 'react-native';
import { createAssetAsync, getAlbumAsync, createAlbumAsync, addAssetsToAlbumAsync, requestPermissionsAsync } from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsPanel from './SettingsPanel';
import BottomDataView from './BottomDataView';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import {addHistoryItem, saveImage, useHistory, history } from '../components/HistoryContext'
import { LogBox } from 'react-native';

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




export default function CameraScreen({ navigation, scanType }) {

  const scannedDate = formatDate(new Date());
  const scannedTime = formatTime(new Date());

  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraMode, setCameraMode] = useState('photo');
  const [cameraRef, setCameraRef] = useState(null);
  const [image, setImage] = useState(null);
  const [responseFromAPI, setResponseFromAPI] = useState([]);
  const [showBottomData, setShowBottomData] = useState(false); 
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalLoadingVisible, setModalLoadingVisible] = useState(true);
  const [cameraReady, setCameraReady] = useState(false); // New state for camera readiness
  const [isRecording, setIsRecording] = useState(false);
  const [audioPermission, setAudioPermission] = useMicrophonePermissions();
  const [zoom, setZoom] = useState(0);



  const [history, setHistory] = useState({
    history: []
  });
  



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
        }
        const timer = setTimeout(() => {
          setCameraReady(true);
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [cameraMode, cameraRef, isRecording]);




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
        setIsSaving(true);
  
        if (photo?.uri) {
          await uploadImage(photo.uri);
        }
  
        setIsSaving(false);
        setImage(photo.uri);
        setShowBottomData(true);
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
        } else {
          console.log('Starting recording');
          setIsRecording(true);
          const video = await cameraRef.recordAsync();
          setIsSaving(true);
  
          if (video?.uri) {
            await uploadVideo(video.uri);
          }
          alert('Video Upload.');
          setIsRecording(false);
          setIsSaving(false);
          setShowBottomData(true);
        }
      } catch (error) {
        console.error('Error handling video recording:', error);
      }
    } else {
      console.log('Camera is not ready or cameraRef is null');
    }
  };
  






console.log("\n\n\n\n\n\n\n .\n\n")


  const uploadVideo = async (uri) => {
    const uploadUrl = 'http://192.168.43.223:3000/upload-video'; // Replace with your server's IP address
    try {
      const formData = new FormData();
      formData.append('video', {
        uri,
        type: 'video/mp4',
        name: 'video.mp4',
      });
      console.log('Uploading video with FormData:', formData);
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.firstThreeFrames && responseData.firstThreeFrames.length > 0) {
          const base64Images = await Promise.all(responseData.firstThreeFrames.map(async (frameUri) => await getBase64FromUri(frameUri)));
          // Add to history
          setHistory(prevHistory => {
            const newHistory = {
              starred: false, // Set to true if the image is starred
              imageList: [base64Image],
              productData: responseData.productData,
              scanType: scanType,
              scannedDate: scannedDate,
              scannedTime: scannedTime,
            };
            return {
              history: [...prevHistory.history, newHistory]
            };
          });
          console.log('Updated History:', JSON.stringify(history, null, 2));
          setImage(responseData.firstThreeFrames[0]);
          setResponseFromAPI(responseData);

        }
      } else {
        console.error('Upload failed:', response.statusText);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
// TODO: make sure that when te cameramode is changed it reflexts instantly.


  const uploadImage = async (uri) => {
    const uploadUrl = 'http://192.168.43.223:3000/upload-image'; // Replace with your server's IP address
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        type: 'image/jpeg', // Adjust this based on your image type
        name: 'image.jpg', // Adjust this based on your image filename
      });

      console.log('\n\n\nUploading image with FormData:', formData);
      const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.image) {
          setImage(responseData.image);
        }



        const base64Image = await getBase64FromUri(uri);
        const newHistory = {
          starred: false,
          imageList: [base64Image],
          productData: responseData.productData,
          scanType: scanType,
          scannedDate: scannedDate,
          scannedTime: scannedTime,
        };

        addHistoryItem(updatedHistory);
        console.log(updatedHistory, "\n\n");


        console.log('Updated History:', JSON.stringify(history, null, 2));




        
        setResponseFromAPI(responseData);
      } else {
        console.error('Upload failed:', response.statusText);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  


  const getBase64FromUri = (uri) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => resolve(fileReader.result);
      fileReader.onerror = reject;
  
      fetch(uri)
        .then(response => response.blob())
        .then(blob => fileReader.readAsDataURL(blob));
    });
  };

console.log("\n\n\n", scanType);



  return (
    <View style={{backgroundColor: "black", flex: 1, justifyContent: 'center', width:"100%", position:"relative", height:400}}>


      <PinchGestureHandler
          onGestureEvent={onPinchGestureEvent}
          onHandlerStateChange={onPinchHandlerStateChange}
        >


      <CameraView style={{ flex: 1,}} facing={facing} ref={ref=>{setCameraRef(ref)}} mode={cameraMode} zoom={zoom}>
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


            {isSaving && 
              <Modal animationType="slide" transparent={true} visible={modalLoadingVisible} onRequestClose={() => {setModalLoadingVisible(false);}}>
                <View style={{backgroundColor:"rgba(0,90,0,0.2)", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                  <Image source={require('../assets/loadingTwo.gif')} style={{width:"30%", height:"20%"}}/>
                  {/* <Text style={{color:"white", fontSize:20, textAlign:"center", fontWeight:"bold"}}>{"Uploading..."}</Text> */}
                  <Text style={{color:"white", fontSize:20, textAlign:"center", fontWeight:"bold"}}>{"Processing..."}</Text>
                </View>
               </Modal>
            }

            

          </View>
        </View>
      </CameraView>



      </PinchGestureHandler>


      <SettingsPanel navigation={navigation} cameraMode={cameraMode} setCameraMode={setCameraMode} cameraRef={cameraRef} isRecording={isRecording} setCameraReady={setCameraReady} zoom={zoom} setZoom={setZoom}  customStyles={{backgroundColor:"rgba(0,0,0,0.6)", position:"absolute",top:0, flex:1, justifyContent:"center", alignItems:"center", borderColor:"red", height:"100%", width:"85%"}}/>
      {showBottomData && <BottomDataView customStyles={{position:"absolute", bottom:0, left:0, right:0}} externalOpen={showBottomData} setExternalOpen={setShowBottomData} image={image} responseFromAPI={responseFromAPI} />}
    </View>
  );
}
