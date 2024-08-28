import React, { useState } from 'react';
import { Image, Text, View, ScrollView, FlatList, TouchableOpacity, Clipboard, ToastAndroid } from 'react-native';



const BottomDataView = ({ customStyles, externalOpen, setExternalOpen, image, responseFromAPI, selectedItemKey }) => {

  const [currentImage, setCurrentImage] = useState({uri: responseFromAPI[selectedItemKey].product_images[0]});
  const [toggle, setToggle] = useState(false);
  const [imageList, setImageList] = useState(responseFromAPI && responseFromAPI[selectedItemKey].product_images ? responseFromAPI[selectedItemKey].product_images.map((imagePath, i) => ({key: String(i), image: { uri: imagePath }})) : [{key: '0', image: { uri: image }}]);
  const [productInfo, setProductInfo] = useState(responseFromAPI[selectedItemKey]);
  const scanType = responseFromAPI[selectedItemKey].scanType;
  const scanResult = responseFromAPI[selectedItemKey].product_code


  const copy = () => {
    if (scanResult){
      Clipboard.setString(scanResult);
      ToastAndroid.show(`${scanResult} Copied To Clipboard`, ToastAndroid.SHORT);
    }
  };


  function renderItems({item}){
    return(
    <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={()=>{
        setCurrentImage(item.image); ``
        }}>
        <Image source={item.image} style={{ width: 100, height: 100, borderRadius: 10, borderColor:"white", borderWidth:1 }} />
    </TouchableOpacity>
    )
  };



  return (
    <View style={[{backgroundColor:"black", borderTopLeftRadius:40, borderTopRightRadius:40, height:toggle || externalOpen ?"93%":0, flex:1, justifyContent:"center", alignItems:"center", zIndex: toggle || externalOpen  ? 10 : 5 }, customStyles]}>
        <TouchableOpacity onPress={()=>{setToggle(false); setExternalOpen(false);}} style={{borderWidth:1, width:200, borderRadius:50, backgroundColor:"black", marginTop:toggle || externalOpen ?-10:-50, borderColor:"white", paddingBottom:toggle || externalOpen ?0:10, marginBottom:toggle || externalOpen ?0:-28, marginTop:-10}}>
            <Text style={{transform: [{ rotate: '90 deg' }],borderColor:"white", textAlign:"center", fontWeight:"bold", fontSize:20, color:"white", }}> { toggle || externalOpen  ? '\u27E9' : '\u27E8'} </Text>
        </TouchableOpacity>
        <ScrollView style={{padding:10, marginTop:20, }}>
            <Image source={currentImage} style={{width:"100%", borderWidth:1, borderRadius:40, height:400, borderColor:"white"}}/>

            <FlatList 
                data={imageList}
                renderItem={renderItems}
                keyExtractor={(item)=>item.key}
                horizontal={true}                                                                              
                alwaysBounceHorizontal={true}
                contentContainerStyle={{ paddingVertical: 10 }} />
            <View style={{paddingVertical:50, paddingHorizontal:10}}>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Type Of Scan:</Text> {scanType.charAt(0).toUpperCase() + scanType.slice(1)}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Name:</Text> {productInfo.product_name}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Price:</Text> {productInfo.product_price}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Manufacturer/Brand:</Text> {productInfo.product_brand}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Expiry Date: </Text> {productInfo.product_expiry_date}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Date Manufactured:</Text> {productInfo.product_manufacturing_date}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Country Of Origin:</Text> {productInfo.product_country_of_origin}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white", textAlign:"justify"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Description:</Text> {productInfo.product_description}</Text>
                
                <View style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:20 }} >
                  <Text style={{marginBottom:10, fontStyle:"italic", color:"white", textAlign:"justify"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Scan Result:</Text>  <Text>{scanResult}</Text></Text>  
                  
                  <TouchableOpacity onPress={ copy } style={{backgroundColor:"rgba(255,255,255,0.3)", borderRadius:50, flexDirection:"row", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:10}}>
                      <Image resizeMode='contain' style={{width:20, height:20}} source={require('../assets/Copy.png')}/>
                      <Text style={{color:"white"}}>Copy Scan Result</Text>
                  </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </View>
  );
};
export default BottomDataView;

