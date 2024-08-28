import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity, ScrollView, Alert } from 'react-native';
import BottomDataView from './BottomDataView';
import { useHistory } from '../components/HistoryContext'; 


const History = () => {
    const { history, setRemoveHistoryCountNote , removeHistoryItem, clearHistory, toggleStarredItem } = useHistory();
    const [selectedItemKey, setSelectedItemKey] = useState(null); 
    const [showBottomData, setShowBottomData] = useState(false); 

    setRemoveHistoryCountNote(false);

    const handleItemPress = (key) => {
        setSelectedItemKey(key);
        setShowBottomData(true);
    };

    const handleRemoveItem = (key) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        removeHistoryItem(key);
                        if (selectedItemKey === key) {
                            setSelectedItemKey(null);
                            setShowBottomData(false);
                        }
                    },
                },
            ]
        );
    };


    const handleClearHistory = () => {
        if (history.length == 0){
            alert('History Already Empty.');
            return
        }
        Alert.alert(
            'Clear History',
            'Are you sure you want to clear the current history?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        clearHistory();
                    },
                },
            ]
        );
    };

    return (
        <View style={{ backgroundColor: "black", padding: 20 }}>
            <ScrollView style={{ height: "100%", position: "relative", marginTop:10 }}>
            <Text style={{ color: "white", padding: 10, fontSize: 20, fontWeight: "bold" }}>History</Text>
                {
                history.length > 0 && 
                <TouchableOpacity onPress={handleClearHistory}>
                    <Text style={{color:"white", textAlign:"right", marginBottom:10, fontSize:15}}>Clear All</Text>
                </TouchableOpacity>
                }
                
                {history.length > 0 ? history.map((item, idx) => ( 
                    <TouchableOpacity
                        onPress={() => handleItemPress(idx)}
                        key={idx}
                        style={{ borderRadius: 20, borderWidth: 1, borderColor: "white", marginVertical: 10, overflow: "hidden", position: 'relative' }}
                    >
                        <ImageBackground source={{ uri: item.product_images[0] }} style={{ width: "100%", height: 120 }}>{console.log("Image: ", item.product_images[0])}
                            <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', width: "100%", height: "100%", padding: 10, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 10 }}>
                                <View style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: -10 }}>
                                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17 }}>{item.scanType.charAt(0).toUpperCase() + item.scanType.slice(1)}</Text>
                                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 17, maxWidth:'70%' }} numberOfLines={1} ellipsizeMode='middle' >{item.product_name}</Text>
                                </View>
                                <View style={{ marginLeft: 180 }}>
                                    <TouchableOpacity onPress={() => toggleStarredItem(idx)}>
                                    <Image source={history[idx].starred ? require('../assets/StarSelect.png') : require('../assets/Starred.png')} resizeMode='contain' style={{ width: 30, height: 30, position: "absolute", top: -40, left: 30, padding: 5 }} />
                                    </TouchableOpacity>
                                    {console.log(idx, history[idx].starred)}

                                    <TouchableOpacity onPress={() => handleRemoveItem(idx)}>
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
                        )) : (
                            <Text style={{color:"white", fontSize:30, marginTop:"60%", textAlign:'center'}}>No History Available</Text>
                        )}

            </ScrollView>
            {            console.log("selected Item:", selectedItemKey)            }
            {showBottomData && (
                <BottomDataView
                    key={selectedItemKey} // Ensure unique key for the BottomDataView
                    customStyles={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 0, borderWidth: 1, borderColor: "white", borderBottomWidth: 0 }}
                    externalOpen={showBottomData}
                    setExternalOpen={setShowBottomData}
                    responseFromAPI={history}
                    selectedItemKey={selectedItemKey.toString()}
                />
            )}
        </View>
    );
};

export default History;
