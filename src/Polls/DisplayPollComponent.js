import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React, {useEffect, useState} from 'react';
import RNPoll from "react-native-poll";
import { getPoll, getPollResult } from '../../firebase/dbGetFunctions';
import { setPollAsAnswered } from '../../firebase/dbSetFunctions';
 
const DisplayPollComponent = (props) => {

  const [ pollList, setPollList ] = useState();
  const [ pollAnswered, setPollAnswered ] = useState(false);

  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getPoll(pollRetrieved, setPollAnswered, props.route.params.currentPollId);
    getPollResult(pollRetrieved, props.route.params.currentPollId);
  };

  function pollRetrieved(pollList){
      setPollList(pollList);
  };

  function pollResultHandler(){
    props.navigation.navigate("PollStatisticsComponent", {eventId: props.route.params.eventId, currentPollId: props.route.params.currentPollId});
  }

  const choices = pollList ? [
        { id: pollList[0].choiceId1, choice: pollList[0].choice1Text, votes: pollList[0].choice1Votes },
        { id: pollList[0].choiceId2, choice: pollList[0].choice2Text, votes: pollList[0].choice2Votes },
        { id: pollList[0].choiceId3, choice: pollList[0].choice3Text, votes: pollList[0].choice3Votes },
    ] : [];

  return (
    <View style={styles.container}>
      {/* CURRENT POLL VIEW */}
      { !pollAnswered ? 
        <View>
          <View style={styles.currentPollContent}>
            <Text style={styles.currentPollContentText}>Poll Question: {pollList ? pollList[0].pollQuestion : ''}</Text>
          </View>

          <RNPoll
            totalVotes={pollList ? pollList[0].totalVotes : 0}
            choices={choices}
            onChoicePress={(selectedChoiceId) => {
              setPollAsAnswered(selectedChoiceId, props.route.params.currentPollId, pollRetrieved)
            }}
            fillBackgroundColor={'#0782F9'}
            borderColor={'#000000'}
            defaultChoiceBorderWidth={50}
            selectedChoiceBorderWidth={50}
          />
        </View>
      : 
        <View>
          <Text style={styles.pollAnsweredText}>Poll Already Answered</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}
            onPress={() => {pollResultHandler()}}>
              <Text style={styles.buttonText}>Poll results</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </View>
  )
}

export default DisplayPollComponent

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#89cff0',
},
currentPollContent: {
  padding: 10,
  backgroundColor : '#0782F9',
  border: 15,
  width: '80%',
  marginLeft: 40,
  marginTop: 10,
  alignItems: 'center',
  justifyContent: 'center',
},
currentPollContentText: {
  fontSize: 17,
  fontWeight: "500",
  color: 'white',
},
pollAnsweredText: {
  fontSize: 20,
  fontWeight: "700",
  color: 'black',
  marginTop: 10,
  marginLeft: 90,
},
button: {
  backgroundColor: '#0782F9',
  width: '100%',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  marginRight: '10%',
  marginLeft: '75%',
  marginBottom: 10,
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 18,
},
buttonContainer: {
  width: '60%',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
  marginBottom: 12,
},
})