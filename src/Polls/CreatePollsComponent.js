import { TextInput, StyleSheet,TouchableOpacity, Text, View } from 'react-native';
import React, { useState } from 'react';
import { setPoll } from '../../firebase/dbSetFunctions';
import CloseModalIcon from 'react-native-vector-icons/Ionicons';
import PollIcon from 'react-native-vector-icons/FontAwesome5';

const CreatePollsComponent = (props) => {

  const [pollQuestion, setPollQuestion] = useState('');
  const [choice1, setChoice1] = useState('');
  const [choice2, setChoice2] = useState('');
  const [choice3, setChoice3] = useState('');

  function createPoll() {
    setPoll(
        pollQuestion,
        choice1,
        choice2,
        choice3,
        props.eventId,
        props.togglePollsModalHandler);
  };

  return (
     <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.buttonCloseAddPolls}
            onPress={() => {
              props.togglePollsModalHandler(true);
            }}>
            <CloseModalIcon name="close-sharp" size={30} color="black" />
          </TouchableOpacity> 
        </View>

        <View style={styles.createPollsContainer}> 
            <Text style={styles.textInputsTitle}>Poll question</Text>
            <TextInput
              placeholder="Question"
              value={pollQuestion}
              onChangeText={text => setPollQuestion(text)}
              style={styles.input}
            />

            <Text style={styles.textInputsTitle}>Choice 1</Text>
            <TextInput
              placeholder="Choice 1"
              value={choice1}
              onChangeText={text => setChoice1(text)}
              style={styles.input}
            />  

            <Text style={styles.textInputsTitle}>Choice 2</Text>
            <TextInput
              placeholder="Choice 2"
              value={choice2}
              onChangeText={text => setChoice2(text)}
              style={styles.input}
            />  

            <Text style={styles.textInputsTitle}>Choice 3</Text>
            <TextInput
              placeholder="Choice 3"
              value={choice3}
              onChangeText={text => setChoice3(text)}
              style={styles.input}
            />  
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.alignButton}>
            <TouchableOpacity
                onPress = {() => {createPoll()}}
                style={styles.createPollButton}
              >
                <View style={styles.centerTextIconOnButton}>
                  <PollIcon name="poll" size={30} color="white" />
                  <Text style={styles.createPollButtonText}>Create poll</Text>
                </View>
            </TouchableOpacity>
          </View>
        </View> 
      </View>
    )
};

export default CreatePollsComponent

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
  height: '60.5%',
},
bottomContainer:{
  backgroundColor: '#89cff0',
  height: '30%',
},
buttonCloseAddPolls: {
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  position: 'absolute',
  right: 5,
  top: 5,
},
input: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  marginTop: 10,
  fontSize: 20,
  margin: 10,
  width: '90%',
  justifyContent: 'center',
  alignSelf: 'center',
},
textInputsTitle: {
  fontSize: 17,
  fontWeight: "600",
  paddingLeft: 20,
},
createPollButton: {
  backgroundColor: '#0782F9',
  width: '40%',
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
centerTextIconOnButton: {
  alignItems: 'center',
  justifyContent: 'center',
},
alignButton: {
  alignItems: 'center',
  justifyContent: 'center',
},
});