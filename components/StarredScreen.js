import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, ScrollView, Alert } from 'react-native';
import BottomDataView from './BottomDataView';

const initialHistoryData = [
    {key:'0', productImage:require('../assets/picture5.jpg'), scanType:'Barcode', productName:'Lorem', scannedDate:'01/01/2024', scannedTime: '02:30 PM'},
    {key:'1', productImage:require('../assets/picture6.jpg'), scanType:'Qrcode', productName:'LoremLorem', scannedDate:'01/01/2024', scannedTime: '02:30 PM'},
    {key:'2', productImage:require('../assets/picture4.jpg'), scanType:'Barcode', productName:'Lorem', scannedDate:'01/01/2024', scannedTime: '02:30 AM'},
    {key:'3', productImage:require('../assets/product1.jpeg'), scanType:'Text', productName:'LoremLorem', scannedDate:'01/01/2024', scannedTime: '02:30 PM'},
    {key:'4', productImage:require('../assets/product2.jpeg'), scanType:'Barcode', productName:'Lorem', scannedDate:'01/01/2024', scannedTime: '02:30 PM'},
    {key:'5', productImage:require('../assets/product3.jpg'), scanType:'Qrcode', productName:'Lorem', scannedDate:'01/01/2024', scannedTime: '02:30 AM'},
];

const Starred = () => {
    const initializeStarredItems = () => {
        const initialState = {};
        initialHistoryData.forEach(item => {
            initialState[item.key] = false;
        });
        return initialState;
    };

    const [historyData, setHistoryData] = useState(initialHistoryData);
    const [starredItems, setStarredItems] = useState(initializeStarredItems);
    const [selectedItemKey, setSelectedItemKey] = useState(null); // Track selected item
    const [showBottomData, setShowBottomData] = useState(true); // Control visibility of BottomDataView

    const toggleStarredItem = (key) => {
        setStarredItems(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }));
        removeItem(key);
    };

    useEffect(() => {
        console.log(starredItems); // This will log the updated state whenever it changes
    }, [starredItems]); // Depend on starredItems


    const getImage = (key) => {
        return starredItems[key]
            ? require('../assets/StarSelect.png')
            : require('../assets/Starred.png');
    };

    const removeItem = (key) => {
        Alert.alert(
            '',
            'The Item Would be Removed from Favourites',
            [{ text: 'Remove From Favourites', onPress: () => setHistoryData(prevData => prevData.filter(item => item.key !== key)) }, {text: 'Cancel'}]
        );
    };

    const handleItemPress = (key) => {
        setSelectedItemKey(key);
        setShowBottomData(true);
    };


    return (

        <View style={{padding:20}}>
            <ScrollView style={{height:"100%"}}>
            <Text style={{color:"white", padding:10, fontSize:20, fontWeight:"bold", }}>Favourites</Text>
            {historyData.map((item) => (
                <TouchableOpacity onPress={()=>{handleItemPress(item.key)}} key={item.key} style={{ borderRadius: 20, borderWidth: 1, borderColor: "white", marginVertical: 10, overflow: "hidden", position: 'relative' }}>
                    <ImageBackground source={item.productImage} style={{ width: "100%", height: 120 }}>
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: "100%", height: "100%", padding: 10, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 10 }}>
                            <View style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: -10 }}>
                                <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>{item.scanType}</Text>
                                <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>{item.productName}</Text>
                            </View>

                            <View style={{ marginLeft: 180 }}>
                                <TouchableOpacity onPress={() => removeItem(item.key)}>
                                    <Image source={ require('../assets/StarSelect.png') } resizeMode='contain' style={{ width: 30, height: 30, position: "absolute", top: -40, left: 80, padding: 5 }} />
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
            ))}
        </ScrollView>
        {showBottomData && selectedItemKey && (
                <BottomDataView 
                    key={selectedItemKey} // Ensure unique key for the BottomDataView
                    customStyles={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 0 , borderWidth:1, borderColor:"white", borderBottomWidth:0}} 
                    externalOpen={showBottomData}
                    setExternalOpen={setShowBottomData}
                />
            )}
        </View>
      
);
};

export default Starred;
