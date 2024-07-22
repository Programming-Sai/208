import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';

const Home = () => {
  return (
    <View style={{width:"100%", height:"100%"}}>
      <View style={{marginBottom:10, padding:10}}>
        <Text style={{fontSize:25, textAlign:"center", fontWeight:"bold", color:"white", borderWidth:1, borderColor:"green", borderRadius:20, padding:15 }}>InnovaTech Product Scanner</Text>
      </View>

      <View style={{paddingBottom:10, paddingVertical:10, marginVertical:20, display:"flex", borderRadius:20, backgroundColor:"#121", padding:1, flexDirection:"row", alignItems:"center", justifyContent:"center", width:"100%", gap: 30, flexWrap:"wrap"}}>
        <TouchableOpacity style={{flexBasis:"43%", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Image style={{width:"100%", height:100}} resizeMode='contain' source={require('../assets/Auto.png')} />
            <Text style={{color:"white"}}>Auto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexBasis:"43%", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Image style={{width:"100%", height:100}} resizeMode='contain' source={require('../assets/Barcode.png')} />
            <Text style={{color:"white"}}>Barcode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexBasis:"43%", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Image style={{width:"100%", height:100}} resizeMode='contain' source={require('../assets/Qrcode.png')} />
            <Text style={{color:"white"}}>QRcode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexBasis:"43%", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Image style={{width:"100%", height:100}} resizeMode='contain' source={require('../assets/Text.png')} />
            <Text style={{color:"white"}}>Text</Text>
        </TouchableOpacity>
      </View>

      <Text style={{color:"white", textAlign:"center", fontSize:18, letterSpacing:2, marginBottom:10}}>Select Scanner Type</Text>

      <View style={{display:"flex", paddingVertical:5, flexDirection:"row", alignItems:"center", justifyContent:"space-between", width:"100%", gap: 30}}>
        <TouchableOpacity style={{ gap:10, borderRadius:20, backgroundColor:"green", display:"flex", justifyContent:"center", flexDirection:"row", alignItems:"center"}}>
            <Image source={require('../assets/History.png')} style={{width:"25%", height: 40}} resizeMode='contain' />
            <Text style={{color:"white"}}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ gap:10, borderRadius:20, backgroundColor:"green", display:"flex", justifyContent:"center", flexDirection:"row", alignItems:"center"}}>
            <Image source={require('../assets/Starred.png')} style={{width:"22%", height: 40}} resizeMode='contain' />
            <Text style={{color:"white"}}>Starred</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
