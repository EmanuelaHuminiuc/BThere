import { StyleSheet, View, Text } from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView from 'react-native-maps';
import { getEventLocation, getEventLocationDetails } from '../../firebase/dbGetFunctions';
import {Marker} from 'react-native-maps';

const LocationScreen = (props) => {
 
  const [ locationList, setLocationList ] = useState();
  const [ locationDetailsList, setLocationDetailsList ] = useState();
  
  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getEventLocation(locationRetrieved, props.route.params.eventId);
    getEventLocationDetails(locationDetailsRetrieved, props.route.params.eventId)
  };
  
  function locationRetrieved(locationList){
    setLocationList(locationList);
  };
  
  function locationDetailsRetrieved(locationDetailsList){
    setLocationDetailsList(locationDetailsList);
  };
  
  return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: locationList ? locationList[0].location.lat : 45.75372,
            longitude: locationList ? locationList[0].location.lng : 21.22571,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          >
          <Marker
            coordinate={{
              latitude: locationList ? locationList[0].location.lat : 45.75372,
              longitude: locationList ? locationList[0].location.lng : 21.22571,
            }}
          />
        </MapView>

        { JSON.stringify(locationDetailsList) !== JSON.stringify([]) ?  
        <View style={styles.detailsBackground}>
          <Text>
            <Text style={styles.detailsTitleText}>Location details: </Text>
            <Text style={styles.detailsText}>{locationDetailsList? locationDetailsList[0].locationDetails : ''}</Text>
          </Text>
          <Text>
            <Text style={styles.detailsTitleText}>City details: </Text>
            <Text style={styles.detailsText}>{locationDetailsList? locationDetailsList[0].cityDetails : ''}</Text>
          </Text>
        </View>
        : 
        null }
    </View> 
  )
}

export default LocationScreen

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  detailsBackground: {
    backgroundColor: 'rgba(191, 191, 191, 0.8)',
    width: '100%',
    height: '19%',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  detailsTitleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
    color: "black",
  },
  detailsText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: "black",
  },
})