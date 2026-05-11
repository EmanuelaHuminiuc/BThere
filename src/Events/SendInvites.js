import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { setInvitesEvent } from '../../firebase/dbSetFunctions';

const SendInvites = (props) => {

  const [ userFirstName, setUserFirstName] = useState('');
  const [ userLastName, setUserLastName] = useState('');
  const [ userEmail, setUserEmail] = useState('');
  
  function showUserAlreadyExistsAlert() {
    Alert.alert(
      'User already participant',
      'User is already a participant!',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {
          cancelable: true
        },
    )};

    function setSendInvitesEventHandler(){
      setInvitesEvent(
        userFirstName,
        userLastName,
        userEmail,
        props.route.params.eventId,
        showUserAlreadyExistsAlert,
        setUserFirstName,
        setUserLastName,
        setUserEmail)
      };

  return (
    <View style={styles.container}>
     
      {/* TEXT INPUTS FOR USER DETAILS */}
      <View style={styles.inputContainer}>
        <Text style={styles.textInputsTitle}>User first name</Text>
        <TextInput
          placeholder="User first name"
          value={userFirstName}
          onChangeText={text => setUserFirstName(text)}
          style={styles.input}
        />

        <Text style={styles.textInputsTitle}>User last name</Text>
        <TextInput
          placeholder="User last name"
          value={userLastName}
          onChangeText={text => setUserLastName(text)}
          style={styles.input}
        />

        <Text style={styles.textInputsTitle}>User email</Text>
        <TextInput
          placeholder="User email"
          value={userEmail}
          onChangeText={text => setUserEmail(text)}
          style={styles.input}
        />

      </View>

      {/* SEND INVITE BUTTON */}
      <View style={styles.buttonContainer}>
          <TouchableOpacity
              onPress = {setSendInvitesEventHandler}
              style={styles.button}
              >
              <Text style={styles.buttonText}>Send invite</Text>
          </TouchableOpacity>
      </View>
    </View>
  )
}

export default SendInvites

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#89cff0',
  justifyContent: 'center',
  alignItems: 'center',
},
inputContainer: {
  backgroundColor: '#89cff0',
  width: '100%',
  margin: 5,
  paddingLeft: 10,
  paddingRight: 23,
  },
buttonContainer: {
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 5,
  marginBottom: 12,
},
textInputsTitle: {
  fontSize: 16,
  fontWeight: "600",
  paddingLeft: 3,
  marginTop: 5,
},
input: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  marginTop: 5,
  fontSize: 18,
},
button: {
  width: '50%',
  backgroundColor: '#0782F9',
  padding: 15,
  borderRadius: 10,
  justifyContent: 'center',
  alignSelf: 'center',
  marginBottom: 10,
  marginTop: 10,
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 18,
  alignSelf: 'center',
},
})