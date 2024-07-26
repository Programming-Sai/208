import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, Image, Text, TouchableOpacity, View, Modal } from 'react-native';
import { Video } from 'expo-av';
import { createAssetAsync, getAlbumAsync, createAlbumAsync, addAssetsToAlbumAsync, requestPermissionsAsync } from 'expo-media-library';
import SettingsPanel from './SettingsPanel';
import BottomDataView from './BottomDataView';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(false); // Show all logs including warnings and errors





export default function CameraScreen() {

  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraMode, setCameraMode] = useState('photo');
  const [cameraRef, setCameraRef] = useState(null);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [showBottomData, setShowBottomData] = useState(false); 
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoadingVisible, setModalLoadingVisible] = useState(true);
  const [imageTaken, setImageTaken] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioPermission, setAudioPermission] = useMicrophonePermissions();


  useEffect(() => {
    (async () => {
      const mediaLibraryStatus = await requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    })();
  }, []);



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


  const handleModeToggle = () => {
    setCameraMode((prevMode) => (prevMode === 'photo' ? 'video' : 'photo'));
  };





  const takePic = async () => {
    if (cameraRef) {
      setCameraMode('photo');
      const photo = await cameraRef.takePictureAsync();
      setIsSaving(true);
      const asset = await createAssetAsync(photo.uri);
      let album = await getAlbumAsync('MyAppPhotos');
      if (!album) {
        await createAlbumAsync('MyAppPhotos', asset, false);
      } else {
        await addAssetsToAlbumAsync([asset], album.id, false);
      }
      setIsSaving(false);
      setImage(photo.uri);
      setShowBottomData(true);
    }
  };

  


  async function recordVid() {
    if (cameraRef) {
      if (isRecording) {
        console.log('Stopped recording isRecording:', isRecording);
        cameraRef.stopRecording();
        setIsRecording(false);
      } else {
        setIsRecording(true);
        console.log('Start recording');
        const video = cameraRef.recordAsync();
        video.then((video) => {
          console.log('Video saved:', video?.uri);
          if (video?.uri && hasMediaLibraryPermission) {
            const asset = createAssetAsync(video.uri);
            let album = getAlbumAsync('MyAppVideos');
            if (!album) {
             createAlbumAsync('MyAppVideos', asset, false);
              console.log('Album created and asset added');
            } else {
             addAssetsToAlbumAsync([asset], album.id, false);
              console.log('Asset added to existing album');
            }
          }
          alert('Video Saved.');
        });
       
        console.log('Stopped recording');

      }
    }
  }


  return (
    <View style={{backgroundColor: "black", flex: 1, justifyContent: 'center', width:"100%", position:"relative", height:400}}>

      <CameraView style={{ flex: 1,}} facing={facing} ref={ref=>{setCameraRef(ref)}} mode={cameraMode}>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent', margin: 64,}}>
          <View style={{flex: 1, alignSelf: 'flex-end', alignItems: 'center',}}>

          <TouchableOpacity onPress={takePic} style={{ width:70, height:70, borderRadius:50, borderWidth:60, borderColor:"goldenrod", display:"flex", alignItems:"center", backgroundColor:"white", justifyContent: 'center', zIndex:100, borderWidth:1, marginBottom:40, }}>
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
                </View>
               </Modal>
            }

            

          </View>
        </View>
      </CameraView>
      

      <SettingsPanel  customStyles={{backgroundColor:"rgba(0,0,0,0.6)", position:"absolute",top:0, flex:1, justifyContent:"center", alignItems:"center", borderColor:"red", height:"100%", width:"85%"}}/>
      <BottomDataView customStyles={{position:"absolute", bottom:0, left:0, right:0}} externalOpen={showBottomData} setExternalOpen={setShowBottomData} image={image}/>
    </View>
  );
}
