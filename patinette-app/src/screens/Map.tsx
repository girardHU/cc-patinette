import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import axios from 'axios';

interface IMarkers {
  id: number,
  available: boolean,
  battery: number,
  latitude: number,
  longitude: number,
  createdAt: string,
  updatedAt: string,
  vehicle_type: string,
}

export default function Map() {

  const [markers, setMarkers] = useState<Array<IMarkers>>([])

  useEffect(() => {
    async function getVehicle() {
      axios.get(`http://192.168.1.140:5000/vehicle`)
        .then(response => {
          // console.log('response.data.data :', response.data.data)
          const vehicles = response.data.data
          console.log('axios call succeded !')
          // console.log("vehicles :", vehicles)
          if (vehicles.length > 0) {
            const result: Array<IMarkers> = []
            vehicles.forEach((element: IMarkers) => {
              if (element['longitude'] != null && element['latitude'] != null) {
                result.push(element)
              }
            })
            // console.log("result :", result)
            setMarkers(result)
          }
          return response.data.data
        }).catch(error => {
          console.log(error)
          return []
        });
    }
    getVehicle()
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.852968,
          longitude: 2.349902,
          latitudeDelta: 0.1522,
          longitudeDelta: 0.1021,
        }} >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          // title={marker.key}
          // description={marker.contactName}
          >
            {/* <View style={{ backgroundColor: "#2065EE", padding: 5, borderRadius: 35 }}>
              <Ionicons name={'arrow-down-outline'} size={20} color={'#fff'} />
            </View> */}
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});