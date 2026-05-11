import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebase/firebase-config';
import { signOut } from "firebase/auth";
import AddEventIcon from 'react-native-vector-icons/MaterialIcons';
import UserIcon from 'react-native-vector-icons/FontAwesome5';
import SignOutIcon from 'react-native-vector-icons/FontAwesome';
import { getProfile } from '../../firebase/dbGetFunctions';


const DashboardScreen = ({navigation}) => {

  const [isSignedIn,setIsSignedIn] = useState(false);
  const [profileList, setProfileList] = useState([])

  useEffect(() => {
    if(auth.currentUser) {
      getProfile(profileRetrieved);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(!auth.currentUser) {
        navigation.replace("Login")
      }
    })

    return unsubscribe
  }, []);

  function profileRetrieved(profileList){
    setProfileList(profileList);
  };

  const addEventPressHandler = () => {
      navigation.navigate('EventScreen', {eventDisplayMode: 'addEvent'});
  };

  const myEventsPressHandler = () => {
      navigation.navigate('MyEvents');
  };
 
  const myProfilePressHandler = () => {
      navigation.navigate('MyProfile');
  };

  const signOutHandler = () => {
    signOut(auth)
    .then((re) => {
      setIsSignedIn(false);
    })
    .catch((err) => {
      console.log(err);
    })
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        onPress={addEventPressHandler}
        style={styles.button}
      >
        <View style={styles.centerTextIconOnButton}>
          <AddEventIcon name="add" size={30} color="white" />
          <Text style={styles.buttonText}>Add event</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={myEventsPressHandler}
        style={styles.button}
      >
        <View style={styles.centerTextIconOnButton}>
          <AddEventIcon name="event" size={30} color="white" />
          <Text style={styles.buttonText}>Events</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={myProfilePressHandler}
        style={styles.button}
      >
        <View style={styles.centerTextIconOnButton}>
          <UserIcon name="user-alt" size={30} color="white" />
          <Text style={styles.buttonText}>My profile</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={signOutHandler}
        style={styles.button}
      >
        <View style={styles.centerTextIconOnButton}>
          <SignOutIcon name="sign-out" size={30} color="white" />
          <Text style={styles.buttonText}>Sign out</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default DashboardScreen

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#89cff0',
    flexDirection: 'row', 
    flexWrap:'wrap',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '40%',
    height: '20%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17,
  },
  centerTextIconOnButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})