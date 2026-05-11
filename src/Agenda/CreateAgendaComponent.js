import { TextInput, StyleSheet,TouchableOpacity, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { setAgenda } from '../../firebase/dbSetFunctions';
import DateTimePicker from '../Event/DatePicker';
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";
import CloseModalIcon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { getSpeakers } from '../../firebase/dbGetFunctions';
import AgendaIcon from 'react-native-vector-icons/MaterialIcons';
import Checkbox from 'expo-checkbox';

const CreateAgendaComponent = (props) => {

    const [speakersList, setSpeakersList] = useState([]);
    const dropDownMenuArray = [];

    useEffect(() => {
      getData()
    }, [])

    function getData(){
      getSpeakers(speakersRetrieved, props.eventId);
    };

    function speakersRetrieved(speakersList){
      setSpeakersList(speakersList);
      speakersList.forEach((speaker) => {
        const speakerName = speaker.userDetails.firstName + ' ' + speaker.userDetails.lastName;
        const speakerUid = speaker.userDetails.userUid;
        dropDownMenuArray.push({label: speakerName, value: speakerUid})
        setItems(dropDownMenuArray);
      })
    };

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showSpeakerAtEvent, setShowSpeakerAtEvent] = useState(false);

    const [time, setTime] = useState(new Date());
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(dropDownMenuArray);

    const showTimePicker = () => {
        setTimePickerVisibility(true);
      };
  
    const onConfirmTime = (date) => {
      setTime(date);
      onCancelTime();
    };
    const onCancelTime = () => {
      setTimePickerVisibility(false);
    };

    function createAgenda() {
      setAgenda(
        title,
        description,
        time,
        showSpeakerAtEvent,
        value,
        props.eventId,
        showAgendaSuccessMessage,
        props.toggleAgendaModalHandler);
    };

    const getFormattedDate = (fDate) => {
        return fDate.toLocaleTimeString("en-GB", {
         hour: "2-digit",
         minute: '2-digit',
         hour12: false,
       });
     };

    const showAgendaSuccessMessage = () => {
        showMessage({
        message: "Your agenda has been saved!",
        type: "success",
      });
    };

  return (
     <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.buttonCloseAddAgenda}
            onPress={() => {
              props.toggleAgendaModalHandler(true);
            }}>
            <CloseModalIcon name="close-sharp" size={30} color="black" />
          </TouchableOpacity> 
        </View>

        <View style={styles.createPollsContainer}> 
        <Text style={styles.pageTitle}>Create agenda for each hour</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputsTitle}>Title</Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={text => setTitle(text)}
              style={styles.input}
            />

            <Text style={styles.textInputsTitle}>Description</Text>
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={text => setDescription(text)}
              style={styles.input}
            />  

            <Text style={styles.textInputsTitle}>Scheduled hours</Text>
            <TouchableOpacity onPress={() => showTimePicker()}>
            <View>
                <View pointerEvents="none">
                <TextInput
                    placeholder="Time"
                    value={time? getFormattedDate(time) : ''}
                    showSoftInputOnFocus={false}
                    style={styles.input}
                />
                </View>
            </View>
            </TouchableOpacity>

          </View>

          {/* SPEAKER ON AGENDA CHECKBOX*/}
        <View >
          <View style={styles.alignButton}>
          <TouchableOpacity 
              style={styles.radioButton}
              onPress = {() => setShowSpeakerAtEvent(!showSpeakerAtEvent)}>
              <Checkbox
                style={styles.checkbox}
                value={showSpeakerAtEvent}
                onValueChange={() => setShowSpeakerAtEvent(!showSpeakerAtEvent)}
                color={showSpeakerAtEvent ? '#0782F9' : undefined}
              />
              <Text style={styles.radioButtonTextt}>Allow speaker on Event</Text>
            </TouchableOpacity>
          </View>

          { showSpeakerAtEvent ?
            <View>
                <View style={styles.dropDownContainer}>
                  <Text style={styles.textRadioTitle}>Select user</Text>
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
            </View>
            : null
          }
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.alignButton}>
          <TouchableOpacity
              onPress = {() => {createAgenda()}}
              style={styles.createPollButton}
            >
              <View style={styles.centerTextIconOnButton}>
                <AgendaIcon name="view-agenda" size={30} color="white" />
                <Text style={styles.createPollButtonText}>Create agenda</Text>
              </View>
          </TouchableOpacity>
        </View>
      </View> 

      {/* DATE PICKER - START DATE */}
      <DateTimePicker 
          isVisible={isTimePickerVisible}
          mode={'datetime'}
          currentDate={time}
          onConfirm={onConfirmTime}
          onCancel={onCancelTime}
          is24Hour={true}
      />

      <FlashMessage/>

    </View>
  )
};

export default CreateAgendaComponent

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
createPollsContainer: {
  backgroundColor: '#89cff0',
  height: '77.5%',
  alignItems: 'center',
},
bottomContainer:{
  backgroundColor: '#89cff0',
  height: '13%',
},
buttonCloseAddAgenda: {
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
pageTitle: {
  fontSize: 17,
  fontWeight: "600",
  marginTop: 5,
  alignSelf: 'center',
},
textInputsTitle: {
  fontSize: 17,
  fontWeight: "600",
  paddingLeft: 13,
  marginTop: 5,
},
textRadioTitle: {
  fontSize: 17,
  fontWeight: "600",
  marginTop: 5,
},
createPollButton: {
  backgroundColor: '#0782F9',
  width: '45%',
  padding: 10,
  paddingLeft: 5,
  paddingRight: 5,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 5,
  marginBottom: 10,
},
createPollButtonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
},
dropDownContainer: {
  justifyContent: 'center',
  alignSelf: 'center',
},
radioButton: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  marginTop:3,
},
radioButtonTextt: {
  color: 'black',
  fontWeight: '700',
  fontSize: 18,
  alignSelf: 'center',
  justifyContent: 'center',
},
centerTextIconOnButton: {
  alignItems: 'center',
  justifyContent: 'center',
},
alignButton: {
  alignItems: 'center',
  justifyContent: 'center',
},
checkbox: {
  margin: 8,
},
});