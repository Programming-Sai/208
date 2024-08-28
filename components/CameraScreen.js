import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, Image, Text, TouchableOpacity, View, Modal, Alert, LogBox, ToastAndroid, Platform, ImageBackground } from 'react-native';
import { requestPermissionsAsync } from 'expo-media-library';
import SettingsPanel from './SettingsPanel';
import BottomDataView from './BottomDataView';
import { PinchGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import { useHistory } from '../components/HistoryContext'
import fetch from 'node-fetch';


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


const serverURL = "http://192.168.43.223:3000"

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
  const [codeScanned, setCodeScanned] = useState({});


  


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
    return       <ImageBackground source={require('../assets/BG4.jpeg')} style={{backgroundColor: "transparent", width:"100%", height:"100%", flex:1 }} />;
  }


  if (!permission.granted || !audioPermission.granted) {
    return (
      <ImageBackground source={require('../assets/BG4.jpeg')} style={{backgroundColor: "transparent", width:"100%", height:"100%", flex:1 }}>

      <View style={{flex: 1, alignItems: "center", justifyContent: "center", gap:20, backgroundColor:""}}>
        <Text style={{textAlign: 'center', color:"white", fontSize:15, padding:10}}>We need your permission to show the camera and record audio</Text>
        <TouchableOpacity style={{backgroundColor:"rgba(255,255,255,0.3)", borderWidth:0.3, borderRadius:30, borderColor:"white"}} onPress={requestPermission}>
          <Text style={{color:"white", fontSize:15, padding:10, paddingHorizontal:20}}>Grant Camera Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor:"rgba(255,255,255,0.3)", borderWidth:0.3, borderRadius:30, borderColor:"white"}} onPress={setAudioPermission} >
          <Text style={{color:"white", fontSize:15, padding:10, paddingHorizontal:20}}>Grant Audio Permission</Text>
        </TouchableOpacity>
      </View>
      </ImageBackground>
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
          setisUploading(true);
          const data = await lookupProduct(codeScanned.type === 32 ? codeScanned.data : '', photo.uri);
          setisUploading(false);
          console.log("\n\n\n\n\nReceived Data: ", data, '\n\n\n\n');

          addHistoryItem(data);
          setShowBottomData(true);

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
  


  const uploadVideo = async (uri) => {
    const uploadUrl = `${serverURL}/upload-image`; // Replace with your server's IP address
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

              barcodeData: codeScanned.type === 32 ? codeScanned.data : '',
              qrCodeData: codeScanned.type === 256 ? codeScanned.data : ''


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
  
  const uploadImage = async (uri) => {
    setImage(uri);
    setisUploading(true);

    const uploadUrl = `${serverURL}/upload-image`; // Replace with your server's IP address

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

          barcodeData: codeScanned.type === 32 ? codeScanned.data : '',
          qrCodeData: codeScanned.type === 256 ? codeScanned.data : ''

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




// Function to fetch product info from OpenFoodFacts
async function fetchFromOpenFoodFacts(barcode, image) {
  const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

  try {
      const response = await fetch(apiUrl);
      const productInfo = await response.json();

      if (response.ok && productInfo.status === 1) {
          // console.log('Product found on OpenFoodFacts:', productInfo.product);
          if (productInfo.product){

            const data = {
              product_code: productInfo.product.code,
              product_name : productInfo.product.product_name,
              product_price: "N/A",
              product_brand:productInfo.product.brands,
              product_manufacturing_date: productInfo.product.entry_dates_tags[0],
              product_expiry_date: "N/A",
              product_country_of_origin: "N/A",
              product_description: "N/A",
              product_images:[productInfo.product.image_nutrition_url, productInfo.product.image_url, productInfo.product.image_front_url],
              starred: false,
              scanType: scanType,
              scannedDate: scannedDate,
              scannedTime: scannedTime,
            };
            data.product_images = await Promise.all(data.product_images.map(async (frameUri) => await downloadImages(frameUri)));
            let c = await saveImage(image);
            data.product_images.unshift(c);

            return data;
          }
          

      } else {
          throw new Error('Product not found on OpenFoodFacts');
      }
  } catch (error) {
      console.error(error.message);
      return null;
  }
}


// Function to fetch product info from UPCItemDB
async function fetchFromUPCItemDB(barcode, image) {
const apiUrl = `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`;

try {
    const response = await fetch(apiUrl);
    
    
    // Check if the HTTP response status is OK
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const productInfo = await response.json();

    // Check if the response contains product information
    if (productInfo.code === 'OK' && productInfo.items.length > 0) {
        console.log('Product found on UPCItemDB:', productInfo.items[0]);
        const product = productInfo.items[0];
        if (product){

          const data = {
            product_code: product.upc,
            product_name: product.title,
            product_price: product.currency + ' ' + ((product.lowest_recorded_price + product.highest_recorded_price) / 2).toFixed(2),
            product_brand: product.brand,
            product_manufacturing_date: "N/A",  // You can update this if the information is available
            product_expiry_date: "N/A",         // You can update this if the information is available
            product_country_of_origin: product.country, // If country is available in response
            product_description: product.description,
            product_images: product.images,
            starred: false,
            scanType: scanType,
            scannedDate: scannedDate,
            scannedTime: scannedTime,
          };
          data.product_images = await Promise.all(data.product_images.map(async (frameUri) => await downloadImages(frameUri)));
          let c = await saveImage(image);
          data.product_images.unshift(c);
          return data;
        }
    } else {
        throw new Error('Product not found on UPCItemDB or invalid response');
    }
} catch (error) {
    console.error('Error fetching product info:', error.message);
    return null;
}
}


async function lookupProduct(barcode, image) {
  
  let product = await fetchFromOpenFoodFacts(barcode, image);
  if (!product) {
      product = await fetchFromUPCItemDB(barcode, image);
  }

  if (product) {
      return product;
  } else {
      console.log('Product not found in both databases.');
      if (codeScanned.type == 32){
        Alert.alert(
          'Lookup Failed',
          'Product not found in both databases.',
          [
            { text: 'OK' },
          ],
          { cancelable: false }
        );
      }
        return{
          product_code: codeScanned.data,
          product_name: "N/A",
          product_price:"N/A",
          product_brand: "N/A",
          product_manufacturing_date:"N/A",
          product_expiry_date: "N/A",
          product_country_of_origin: "N/A",
          product_description: "N/A",
          product_images: [image],
          starred: false,
          scanType: scanType,
          scannedDate: scannedDate,
          scannedTime: scannedTime,
        };
  }
}

















  return (
    <View style={{backgroundColor: "black", flex: 1, justifyContent: 'center', width:"100%", position:"relative", height:400}}>

      <PinchGestureHandler onGestureEvent={onPinchGestureEvent} onHandlerStateChange={onPinchHandlerStateChange} >
        <TapGestureHandler onHandlerStateChange={handleTap} numberOfTaps={2} >
          <CameraView onBarcodeScanned={(data)=>{setCodeScanned(data); console.log(data)}} style={{ flex: 1,}} facing={facing} ref={ref=>{setCameraRef(ref)}} mode={cameraMode} zoom={zoom} flash={flash} >
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent', margin: 64,}}>
              <View style={{flex: 1, alignSelf: 'flex-end', alignItems: 'center',}}>

              {codeScanned.data ? ToastAndroid.show(codeScanned.type === 32 ? "Barcode Detected" : codeScanned.type === 256 ? "QR Code Detected" : '', ToastAndroid.SHORT) : ToastAndroid.END}


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
                    
                    {/* <View style={{backgroundColor:'red', width:30, height:30, position:"absolute", top:'50%', right:'50%', zIndex:50}} /> */}
       
                </TouchableOpacity>
                {
                  cameraMode === 'video' &&  isRecording &&
                  <Text style={{color:"white", fontSize:20, textAlign:"center", marginTop:-10}}>{formatRecordingTime(elapsedTime)}</Text>
                }

                {
                isUploading && 
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
      {/* {showBottomData && <BottomDataView customStyles={{position:"absolute", bottom:0, left:0, right:0}} externalOpen={showBottomData} setExternalOpen={setShowBottomData} image={image} responseFromAPI={history} selectedItemKey={history.length -1} />} */}
      {showBottomData && <BottomDataView customStyles={{position:"absolute", bottom:0, left:0, right:0}} externalOpen={showBottomData} setExternalOpen={setShowBottomData} image={image} responseFromAPI={history} selectedItemKey={history.length -1} />}
    </View>
  );
}
