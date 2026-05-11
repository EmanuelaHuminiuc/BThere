import { StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getEventLocation } from '../../firebase/dbGetFunctions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Input } from 'react-native-elements';
import { setMap } from '../../firebase/dbSetFunctions';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';

const CreateLocationComponent = (props) => {

    const GOOGLE_PLACES_API_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    const [ regionChange, setRegionChange ] = useState({lat: 45.75372, lng: 21.22571, latitudeDelta: 0.0922, longitudeDelta: 0.0421});
    const [ locationList, setLocationList ] = useState();

    useEffect(() => {
      getData()
    }, [])
  
    function getData(){
      getEventLocation(locationRetrieved, props.route.params.eventId);
    };
    
    function locationRetrieved(locationList){
      if(locationList && locationList.length != 0){
        setLocationList(locationList[0].location);
        setRegionChange(locationList[0].location);
      }
    };

    function addLocation(locationRegion){
        setMap(
          props.route.params.eventId,
          locationRegion
      ) 
    }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: regionChange ? regionChange.lat : locationList[0].location.lat,
          longitude: regionChange ? regionChange.lng : locationList[0].location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        >
        <Marker
          coordinate={{
            latitude: regionChange ? regionChange.lat : locationList[0].location.lat,
            longitude: regionChange ? regionChange.lng : locationList[0].location.lng,
          }}
        />
      </MapView>

      <GooglePlacesAutocomplete
        placeholder='Choose Event Location'
        fetchDetails={true}
        isRowScrollable={true}
        enablePoweredByContainer={false}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        GooglePlacesDetailsQuery={{
          fields:'geometry'
        }}
        onPress={(data, details) => {
          setRegionChange(details.geometry.location);
          addLocation(details.geometry.location);
        }}
        textInputProps={{
          InputComp: Input,
          leftIcon: { type: 'font-awesome', name: 'chevron-left' },
          errorStyle: { color: 'red' },
        }}
        style={{position: "absolute", top: 0}}
        styles={{
          container: {
            flex: 1,
          },
          textInputContainer: {
            flexDirection: 'row',
            width: '100%',
          },
          textInput: {
            backgroundColor: '#FFFFFF',
            height: 44,
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
            fontSize: 15,
            flex: 1,
          },
          poweredContainer: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderColor: '#c8c7cc',
            borderTopWidth: 0.5,
          },
          powered: {},
          listView: {},
          row: {
            backgroundColor: '#FFFFFF',
            padding: 13,
            height: 44,
            flexDirection: 'row',
          },
          separator: {
            height: 0.5,
            backgroundColor: '#c8c7cc',
          },
          description: {},
          loader: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 20,
          },
        }}
      />
    </View>
  )
}

export default CreateLocationComponent

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
})