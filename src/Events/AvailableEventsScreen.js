import { StyleSheet, View } from 'react-native';
import React from 'react';
import DisplayEventsComponent from './DisplayEventsComponent';

const AvailableEventsScreen = ({navigation}) => {

  return (
    <View>
      <DisplayEventsComponent 
        displayEvents={'availableEvents'}
        navigationObj={navigation}
      />
    </View>
  )
};

export default AvailableEventsScreen

const styles = StyleSheet.create({})