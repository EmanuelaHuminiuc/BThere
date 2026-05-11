import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import SaveIcon from 'react-native-vector-icons/MaterialIcons';
import CloseModalIcon from 'react-native-vector-icons/Ionicons';
import { updateAgenda } from '../../firebase/dbSetFunctions';
import { auth } from '../../firebase/firebase-config';

const SpeakerEditsAgendaItem = (props) => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ agendaData,  setAgendaData ] = useState();
  const [ agendaItemId,  setAgendaItemId ] = useState();
  const user = auth.currentUser;
  const uid = user.uid;

  useEffect(() => {
    getModalDataToDisplay()
  }, []);

  function getModalDataToDisplay() {
    props.agendaItemData.forEach((item) => {
      if(item.speakerId === uid){
        setAgendaData(item);
        const itemId = item.id;
        setAgendaItemId(itemId);
      }
    })
          
  };

  function updateAgendaHandler() {
      updateAgenda(
        title,
        description,
        agendaItemId,
        agendaData.agendaTime,
        props.currentData,
        props.updateTitleDescriptionHandler);
  };

  return (
    <View style={styles.container}>
       <View style={styles.headerContainer}>
            <TouchableOpacity
            style={styles.buttonCloseAddPolls}
            onPress={() => {
                props.toggleSpeakerEditsAgendaItemModalHandler(false);
            }}>
              <CloseModalIcon name="close-sharp" size={30} color="black" />
            </TouchableOpacity> 
        </View>
      <View style={styles.createPollsContainer}> 
          
          <View style={styles.inputContainer}>
          <Text style={styles.pageTitle}>Edit your speech details</Text>
            <Text style={styles.textInputsTitle}>Initial speach title</Text>
            <TextInput
              placeholder="Speach title"
              value={agendaData ? agendaData.agendaTitle : "Title"}
              editable={false} 
              selectTextOnFocus={false}
              style={styles.input}
            />
            <Text style={styles.textInputsTitle}>New speach title</Text>
            <TextInput
              placeholder="Speach title"
              value={title}
              onChangeText={text => setTitle(text)}
              style={styles.input}
            />

            <Text style={styles.textInputsTitle}>Initial speach description</Text>
            <TextInput
              placeholder="Speach description"
              value={agendaData ? agendaData.agendaDescription : "Description"}
              editable={false} 
              selectTextOnFocus={false}
              style={styles.input}
            />

            <Text style={styles.textInputsTitle}>New speach description</Text>
            <TextInput
              placeholder="Speach description"
              value={description}
              onChangeText={text => setDescription(text)}
              style={styles.input}
            />  
            <TouchableOpacity
            onPress = {() => {updateAgendaHandler()}}
            style={styles.button}
            >
               <View style={styles.centerTextIconOnButton}>
                <SaveIcon name="add" size={30} color="white" />
                <Text style={styles.createPollButtonText}>Save</Text>
              </View>
          </TouchableOpacity>
          </View>
        </View>
    </View>
  )
}

export default SpeakerEditsAgendaItem

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#89cff0',
  height: '100%',
},
headerContainer:{
  backgroundColor: '#89cff0',
  height: '9.5%',
},
createPollsContainer: {
  backgroundColor: '#89cff0',
  height: '80.5%',
  alignItems: 'center',
  justifyContent: 'center',
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
  fontSize: 18,
  fontWeight: "600",
  paddingLeft: 13,
  marginTop: 5,
  alignSelf: 'center',
  marginBottom: 10,
},
textInputsTitle: {
  fontSize: 17,
  fontWeight: "600",
  paddingLeft: 13,
  marginTop: 5,
},
buttonCloseAddPolls: {
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  position: 'absolute',
  right: 5,
  top: 5,
},
centerTextIconOnButton: {
  alignItems: 'center',
  justifyContent: 'center',
},
createPollButtonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
},
button: {
  backgroundColor: '#0782F9',
  width: '25%',
  padding: 5,
  borderRadius: 10,
  alignSelf: 'center',
  justifyContent: 'center',
  margin: 10,
},
})