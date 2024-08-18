import React, { useState, useEffect } from 'react';
import { SafeAreaView, Image, Text, View, Settings, ScrollView, FlatList, TouchableOpacity } from 'react-native';



const BottomDataView = ({ customStyles, externalOpen, setExternalOpen, image, responseFromAPI }) => {
  const [currentImage, setCurrentImage] = useState({uri: responseFromAPI.firstThreeFrames ? responseFromAPI.firstThreeFrames[0] : image});
  const [toggle, setToggle] = useState(false);

  const [imageList, setImageList] = useState(responseFromAPI && responseFromAPI.firstThreeFrames ? responseFromAPI.firstThreeFrames.map((imagePath, i) => ({key: String(i), image: { uri: imagePath }})) : [{key: '0', image: { uri: image }}]);
  const [productInfo, setProductInfo] = useState(responseFromAPI.productData);


  function renderItems({item}){
    return(
    <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={()=>{
        setCurrentImage(item.image); 
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
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Name:</Text> {productInfo.productName}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Price:</Text> {productInfo.productPrice}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Manufacturer/Brand:</Text> {productInfo.productManufacturer}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Expiry Date: </Text> {productInfo.productExpriryDate}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Date Manufactured:</Text> {productInfo.productDateManufactured}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Country Of Origin:</Text> {productInfo.productCountryOfOrigin}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white", textAlign:"justify"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Description:</Text> {productInfo.productDescription}</Text>
            </View>
        </ScrollView>
    </View>
  );
};
export default BottomDataView;
