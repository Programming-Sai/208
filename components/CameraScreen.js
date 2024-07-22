import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, Image, Text, TouchableOpacity, View } from 'react-native';
import SettingsPanel from './SettingsPanel';
import BottomDataView from './BottomDataView';

export default function CameraScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraMode, setCameraMode] = useState(true);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', width:"100%", position:"relative",}}>
      
      <CameraView style={{ flex: 1,}} facing={facing}>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent', margin: 64,}}>
          <View style={{flex: 1, alignSelf: 'flex-end', alignItems: 'center',}}>
            <TouchableOpacity style={{ width:70, height:70, borderRadius:50, borderWidth:60, borderColor:"goldenrod", display:"flex", alignItems:"center", backgroundColor:"white", justifyContent: 'center', zIndex:100, borderWidth:1, marginBottom:40, }}>
                {cameraMode ? <Image source={require("../assets/CameraDark.png")} resizeMode='contain' style={{width:"100%"}}/> : <View style={{width:20, height:20, backgroundColor:"red", borderRadius:50}}></View>}
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
      
      <SettingsPanel  customStyles={{backgroundColor:"rgba(0,0,0,0.6)", position:"absolute",top:0, zIndex:10, flex:1, justifyContent:"center", alignItems:"center", borderColor:"red", height:"100%", width:"85%"}}/>
      <BottomDataView customStyles={{position:"absolute", bottom:0, left:0, right:0, zIndex:0}}/>
    </View>
  );
}
