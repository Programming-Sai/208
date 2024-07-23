import React, { useState } from 'react';
import { SafeAreaView, Image, Text, View, Settings, ScrollView, FlatList, TouchableOpacity } from 'react-native';

const data =[
    {key:'0', image:require("../assets/product1.jpeg")},
    {key:'1', image:require("../assets/product2.jpeg")},
    {key:'2', image:require("../assets/product3.jpg")},
    {key:'3', image:require("../assets/picture4.jpg")},
    {key:'4', image:require("../assets/picture5.jpg")},
    {key:'5', image:require("../assets/picture6.jpg")},
]
data.reverse();





const BottomDataView = ({ customStyles, externalOpen, setExternalOpen  }) => {
  const [currentImage, setCurrentImage] = useState(require("../assets/picture.jpeg"));
  const [toggle, setToggle] = useState(false);



  function renderItems({item}){
    return(
    <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={()=>{
        setCurrentImage(item.image); !data.some(item => item.key === '6') && data.unshift({key:'6', image:require("../assets/picture.jpeg")})}}>
        <Image source={item.image} style={{ width: 100, height: 100, borderRadius: 10, borderColor:"white", borderWidth:1 }} />
    </TouchableOpacity>
    )
  };


  return (
    <View style={[{backgroundColor:"black", borderTopLeftRadius:40, borderTopRightRadius:40, height:toggle || externalOpen ?"95%":0, flex:1, justifyContent:"center", alignItems:"center", zIndex: toggle || externalOpen  ? 10 : 5 }, customStyles]}>
        <TouchableOpacity onPress={()=>{setToggle(!toggle); setExternalOpen(!externalOpen)}} style={{borderWidth:1, width:200, borderRadius:50, backgroundColor:"black", marginTop:toggle || externalOpen ?-10:-50, borderColor:"white", paddingBottom:toggle || externalOpen ?0:10, marginBottom:toggle || externalOpen ?0:-28, marginTop:-10}}>
            <Text style={{transform: [{ rotate: '90 deg' }],borderColor:"white", textAlign:"center", fontWeight:"bold", fontSize:20, color:"white", }}> { toggle || externalOpen  ? '\u27E9' : '\u27E8'} </Text>
        </TouchableOpacity>
        <ScrollView style={{padding:10, marginTop:20, }}>
            <Image source={currentImage} style={{width:340, borderWidth:1, borderRadius:40, height:400, borderColor:"white"}}/>
            <FlatList 
                data={data}
                renderItem={renderItems}
                keyExtractor={(item)=>item.key}
                horizontal={true} 
                alwaysBounceHorizontal={true}
                contentContainerStyle={{ paddingVertical: 10 }} />
            <View style={{paddingVertical:50, paddingHorizontal:10}}>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Name:</Text> {'Lorem ipsum'}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Price:</Text> {'$0.00'}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white", textAlign:"justify"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Description:</Text> {'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien. Viverra orci sagittis eu volutpat odio facilisis mauris sit amet. In nulla posuere sollicitudin aliquam ultrices sagittis orci a. Diam phasellus vestibulum lorem sed risus ultricies tristique nulla aliquet. Eget est lorem ipsum dolor sit amet consectetur adipiscing elit. Mauris a diam maecenas sed enim ut sem viverra aliquet. Id aliquet lectus proin nibh nisl condimentum id venenatis a. Viverra nam libero justo laoreet sit amet cursus sit amet dictum. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque. Faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing. Magna fringilla urna porttitor rhoncus dolor purus non. Nunc sed velit dignissim sodales ut eu sem integer vitae. Massa id neque aliquam vestibulum morbi blandit cursus risus at. Facilisis mauris sit amet massa vitae tortor condimentum lacinia quis.Ac odio tempor orci dapibus ultrices in. Sit amet volutpat consequat mauris nunc congue nisi vitae suscipit. Gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim. Dignissim suspendisse in est ante in nibh. Venenatis urna cursus eget nunc scelerisque viverra mauris in. Proin fermentum leo vel orci porta non pulvinar neque laoreet. Velit euismod in pellentesque massa placerat duis ultricies lacus. Commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit. Aenean et tortor at risus viverra adipiscing at in. Ut sem nulla pharetra diam sit amet. Faucibus a pellentesque sit amet porttitor. Orci a scelerisque purus semper eget duis at. Egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices. Viverra orci sagittis eu volutpat odio facilisis mauris. Non enim praesent elementum facilisis leo vel fringilla est ullamcorper. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien.'}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Manufacturer/Brand:</Text> {'Lorem ipsum'}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Expiry Date: </Text> {'01/01/0101'}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Date Manufactured:</Text> {'01/01/0101'}</Text>
                <Text style={{marginBottom:10, fontStyle:"italic", color:"white"}}><Text style={{fontSize:15, fontWeight:"bold", letterSpacing:1}}>Product Country Of Origin:</Text> {'China'}</Text>
            </View>
        </ScrollView>
    </View>
  );
};

export default BottomDataView;
