import React, { useState } from 'react';
import { SafeAreaView, View, Text, StatusBar, Image, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';

const historyData = [
    {key:'0', productImage:require('../assets/picture5.jpg'), scanType:'Barcode', productName:'Lorem', scannedDate:'01/01/2024', scannedTime: '02:30 PM'},
    {key:'1', productImage:require('../assets/picture6.jpg'), scanType:'Qrcode', productName:'LoremLorem', scannedDate:'01/01/2024', scannedTime: '02:30 PM'},
    {key:'2', productImage:require('../assets/picture4.jpg'), scanType:'Barcode', productName:'Lorem', scannedDate:'01/01/2024', scannedTime: '02:30 AM'},
    {key:'3', productImage:require('../assets/product1.jpeg'), scanType:'Text', productName:'LoremLorem', scannedDate:'01/01/2024', scannedTime: '02:30 PM'},
    {key:'4', productImage:require('../assets/product2.jpeg'), scanType:'Barcode', productName:'Lorem', scannedDate:'01/01/2024', scannedTime: '02:30 PM'},
    {key:'5', productImage:require('../assets/product3.jpg'), scanType:'Qrcode', productName:'Lorem', scannedDate:'01/01/2024', scannedTime: '02:30 AM'},
];

const History = () => {
    const [starredItems, setStarredItems] = useState({});

    const toggleStarredItem = (key) => {
        setStarredItems(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }));
    };

    const getImage = (key) => {
        return starredItems[key] 
            ? require('../assets/StarSelect.png') 
            : require('../assets/Starred.png');
    };

    return (
        <ScrollView style={{ height: "100%" }}>
            {historyData.map((item) => {
                return (
                    <TouchableOpacity key={item.key} style={{ borderRadius: 20, borderWidth: 1, borderColor: "white", marginVertical: 10, overflow: "hidden", position: 'relative' }}>
                        <ImageBackground source={item.productImage} style={{ width: "100%", height: 120 }}>
                            <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: "100%", height: "100%", padding: 10, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 10 }}>
                                <View style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: -10 }}>
                                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>{item.scanType}</Text>
                                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>{item.productName}</Text>
                                </View>

                                <View style={{ marginLeft: 200 }}>
                                    <TouchableOpacity onPress={() => toggleStarredItem(item.key)}>
                                        <Image source={getImage(item.key)} resizeMode='contain' style={{ width: 30, height: 30, position: "absolute", top: 0-40, left: 30, padding: 5 }} />
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <Image source={require('../assets/Delete.png')} resizeMode='contain' style={{ width: 30, height: 30, position: "absolute", top: -40, left: 90, padding: 10 }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 50, flexDirection: "row" }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", width: "40%" }}>
                                        <Image style={{ width: "50%", height: 35 }} resizeMode='contain' source={require('../assets/Date.png')} />
                                        <Text style={{ color: "white" }}>{item.scannedDate}</Text>
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", width: "40%" }}>
                                        <Image style={{ width: "50%", height: 35 }} resizeMode='contain' source={require('../assets/Time.png')} />
                                        <Text style={{ color: "white" }}>{item.scannedTime}</Text>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

export default History;
