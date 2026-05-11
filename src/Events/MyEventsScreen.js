import {StyleSheet, View } from 'react-native';
import React from 'react';
import DisplayEventsComponent from './DisplayEventsComponent';

const MyEventsScreen = ({navigation}) => {

  return (
   <View> 
    
      <DisplayEventsComponent
      displayEvents={'myEvents'}
      navigationObj={navigation}
      />
        
   </View>
  )
}

export default MyEventsScreen

const styles = StyleSheet.create({})