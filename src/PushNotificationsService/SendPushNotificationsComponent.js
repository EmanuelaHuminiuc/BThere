import { TextInput, StyleSheet,TouchableOpacity, Text, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import CloseModalIcon from 'react-native-vector-icons/Ionicons';
import { getParticipants } from '../../firebase/dbGetFunctions';
import PushNotificationService from './PushNotificationsService';
import DropDownPicker from 'react-native-dropdown-picker';

const SendPushNotificationsComponent = (props) => {
    const [ participantsList, setParticipantsList] = useState([]);
    const dropDownMenuArray = [
      {label: 'All users', value: 'allUsers'},
    ];

    useEffect(() => {
      getData()
    }, [])

    function getData(){
      getParticipants(participantsRetrieved, props.eventId);
  };

    function participantsRetrieved(participantsList){
      setParticipantsList(participantsList);
      participantsList.forEach((participant) => {
        const participantName = participant.userDetails.firstName + ' ' + participant.userDetails.lastName;
        const participantToken = participant.userDetails.pushToken;
        dropDownMenuArray.push({label: participantName, value: participantToken})
        setItems(dropDownMenuArray);
      })
    };

    const [ notificationTitle, setNotificationTitle ] = useState('');
    const [ notificationDescription, setNotificationDescription ] = useState('');
    
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('allUsers');
    const [items, setItems] = useState(dropDownMenuArray);

    function showSelectUserAlert() {
      Alert.alert(
        'Select an user',
        'You have to select an user!',
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

    function allUsersSendPushNotification () {
        if(value === 'allUsers'){
          participantsList.forEach((participant) => {
            const participantToken = participant.userDetails.pushToken;
            PushNotificationService.sendPushNotification(participantToken, notificationTitle, notificationDescription, props.togglePushNotificationsModalHandler)
          })
        } else {
            if (value){
            PushNotificationService.sendPushNotification(value, notificationTitle, notificationDescription, props.togglePushNotificationsModalHandler)
            } else {
              showSelectUserAlert();
            }
        }
    }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.buttonClose}
          onPress={() => {
            props.togglePushNotificationsModalHandler(true);
          }}>
          <CloseModalIcon name="close-sharp" size={30} color="black" />
        </TouchableOpacity> 
      </View>
    
      <View>
        <View style={styles.notificationDetailsContainer}> 
          <Text style={styles.pageTitle}>Send reminders in current event</Text>

          <Text style={styles.textTitle}>Select user</Text>
          <View style={styles.dropDownContainer}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select user"
              style={{
                backgroundColor: "white",
              }}
              containerStyle={{
                width: '70%',
              }}
              labelStyle={{
                fontWeight: "bold",
                backgroundColor: "white",
              }}
              selectedItemContainerStyle={{
                backgroundColor: "white",
              }}
              selectedItemLabelStyle={{
                fontWeight: "bold",
              
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.textInputsTitle}>Reminder title</Text>
            <TextInput
              placeholder="Reminder title"
              value={notificationTitle}
              onChangeText={text => setNotificationTitle(text)}
              style={styles.input}
            />

            <Text style={styles.textInputsTitle}>Reminder message</Text>
            <TextInput
              placeholder="Reminder message"
              value={notificationDescription}
              onChangeText={text => setNotificationDescription (text)}
              style={styles.input}
            />  
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
              onPress = {() => {allUsersSendPushNotification()}}
              style={styles.sendPushNotificationButton}
            >
              <Text style={styles.sendPushNotificationButtonText}>Send reminder</Text>
          </TouchableOpacity>
        </View> 
      </View>
    </View>
  )
};

export default SendPushNotificationsComponent

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#89cff0',
  width: '100%',
  height: '100%',
},
headerContainer:{
  backgroundColor: '#89cff0',
  height: '9.5%',
},
viewButtonsContainer: {
  backgroundColor: '#89cff0',
  flexDirection: 'row', 
  flexWrap:'wrap',
  height: '8.5%',
  justifyContent: 'center',
  alignItems: 'center',
},
notificationDetailsContainer: {
  backgroundColor: '#89cff0',
  height: '75%',
},
bottomContainer:{
  backgroundColor: '#89cff0',
  height: '15.9%',
  alignItems: 'center',
  justifyContent: 'center',
},
dropDownContainer: {
  justifyContent: 'center',
  alignSelf: 'center',
  marginTop: 7,
},
buttonClose: {
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  position: 'absolute',
  right: 5,
  top: 5,
},
inputContainer: {
  width: '90%',
  margin: 10,
},
input: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  marginTop: 10,
  fontSize: 20,
  margin: 10,
},
textInputsTitle: {
  fontSize: 17,
  fontWeight: "600",
  paddingLeft: 13,
  marginTop: 3,
},
textTitle: {
  fontSize: 17,
  fontWeight: "600",
  paddingLeft: 25,
  marginTop: 3,
},
pageTitle: {
  fontSize: 18,
  fontWeight: "700",
  marginTop: 3,
  alignSelf: 'center',
  marginBottom: 10,
},
sendPushNotificationButton: {
  backgroundColor: '#0782F9',
  width: '60%',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  position: 'absolute',
},
sendPushNotificationButtonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
  alignSelf: 'center',
},
viewModeButton: {
  backgroundColor: '#0782F9',
  width: '40%',
  padding: 10,
  paddingLeft: 20,
  paddingRight: 20,
  borderRadius: 10,
  alignSelf: 'center',
  marginTop: 15,
  marginLeft: 10,
  marginRight: 10,
  flexBasis: 'auto',
},
viewModeButtonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
  alignSelf: 'center',
},
});