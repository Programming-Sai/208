import React, { useState } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity, Animated } from 'react-native';


const settings = [
  { key: '0', setting: "Zoom in", image: require("../assets/ZoomIn.png"), extraStyles:{}, extraStyles2:{} },
  { key: '1', setting: "Zoom Out", image: require("../assets/ZoomOut.png"), extraStyles:{width:50}, extraStyles2:{}  },
  { key: '2', setting: "Video", image: require("../assets/Video.png"), extraStyles:{width:50}, extraStyles2:{marginLeft:-10} },
  { key: '3', setting: "Photo", image: require("../assets/Camera.png"), extraStyles:{width:60}, extraStyles2:{marginLeft:-10} },
  { key: '4', setting: "Filter", image: require("../assets/Filter.png"), extraStyles:{width:35}, extraStyles2:{marginLeft:-10} },
  { key: '5', setting: "History", image: require("../assets/History.png"), extraStyles:{}, extraStyles2:{marginLeft:-10} },
];

const renderItems = ({ item }) => {
  return (
    <TouchableOpacity style={{ display:"flex", alignItems: 'center', justifyContent: 'center', padding:10, margin:10, width:"40%", borderRadius:20, gap:5, height:100 }}>
      <Image source={item.image} style={[{ width: 30, height: 30, marginRight: 10}, item.extraStyles]} />
      <Text style={[{ color: 'white', fontSize: 15, }, item.extraStyles2]}>{item.setting}</Text>
    </TouchableOpacity>
  );
};

const SettingsPanel = ({ customStyles }) => {
  const [toggle, setToggle] = useState(true);
  return (
    <View style={[{ backgroundColor: '#333', padding: 10, width: '80%', height: '50%', left:toggle?"-100%":0  }, customStyles]}>
      <FlatList
        keyExtractor={(item) => item.key}
        data={settings}
        renderItem={renderItems}
        numColumns={2}
        contentContainerStyle={{ flexGrow: 0, gap:10, alignItems:"center", justifyContent:"center", height:"100%" }} // Ensure items fill the container correctly
      />
      <TouchableOpacity onPress={()=>setToggle(!toggle)} style={[{position:"absolute", left: toggle?"120%":"100%", color:"white", padding:2, paddingLeft:toggle ? 10:0, backgroundColor:"black", height:"25%", borderRightColor:"white", borderTopColor:"white",borderBottomColor:"white", borderWidth:2, borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center"}, toggle?{}:{borderLeftColor:"white"}]}>
        <Text style={{color:"white", fontSize:25,fontWeight:"bold"}}> { toggle ? '\u27E9' : '\u27E8'} </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsPanel;
{120, 100}