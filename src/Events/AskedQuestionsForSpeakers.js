import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import React, {useEffect, useState} from 'react';
import { getQuestionsForSpeaker } from '../../firebase/dbGetFunctions';
import { setQuestionsForSpeakers } from '../../firebase/dbSetFunctions';
import CloseModalIcon from 'react-native-vector-icons/Ionicons';
import SendQuestionIcon from 'react-native-vector-icons/FontAwesome';

const AskedQuestionsForSpeakers = (props) => {

  const [ questionsList, setQuestionsList] = useState();
  const [ question, setQuestion] = useState('');
  
  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getQuestionsForSpeaker(questionsRetrieved, props.eventId, props.speakerId);
  };
  
  function questionsRetrieved(questionsList){
    setQuestionsList(questionsList);
  };

  function convertTimestamp (timestamp){
    let date = timestamp.toDate();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    date = day + '/' + month + '/' + year + ' - ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
    return date;
  };

  const QuestionsItem = ({
    question, answer, date, eventId, userId, speakerId
  }) => (
    <View style={styles.item}> 
        <Text style={styles.item2ndTitle}>{convertTimestamp(date)}</Text>
        <Text>
          <Text style={styles.item2ndTitle}>Question: </Text>
          <Text style={styles.item2nd}>{question}</Text>
        </Text>
        {answer ?
          <Text>
            <Text style={styles.item2ndTitle}>Answer: </Text>
            <Text style={styles.item2nd}>{answer}</Text>
          </Text>
        : null 
        }
    </View>
  );


function addQuestion() {
  setQuestionsForSpeakers(
    question,
    props.eventId,
    props.speakerId,
    setQuestion,
    questionsRetrieved);
};

  return (
    <React.Fragment>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.buttonCloseQuestions}
              onPress={() => {
                props.toggleQuestionsModalHandler(true);
              }}>
              <CloseModalIcon name="close-sharp" size={30} color="black" />
            </TouchableOpacity> 
          </View>

        <Text style={styles.textInputsTitle}>Send questions to speaker</Text>    

        {/* TEXT INPUT FOR ASKING QUESTIONS */}
        <View style={styles.secondContainer}>
            <TextInput
              placeholder="Question"
              value={question}
              onChangeText={text => setQuestion(text)}
              style={styles.input}
              multiline={true}
              numberOfLines={10}
            />
    
          <TouchableOpacity
            onPress = {() => {addQuestion()}}
            style={styles.button}
            >
             <View style={styles.centerTextIconOnButton}>
              <SendQuestionIcon name="send" size={25} color="white" />
              <Text style={styles.createPollButtonText}>Send</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* QUESTIONS VIEW */}
    { JSON.stringify(questionsList) !== JSON.stringify([]) ?
        <View style={styles.questionsContainer}>
          <Text style={styles.participantsTitleText}>Questions</Text>
          
          {/* QUESTIONS FLAT LIST */}
          <FlatList style = {styles.flatList}
            data={questionsList}
            keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            renderItem={({item})  =>
            <QuestionsItem
              question={item.question}
              eventId={item.eventId}
              userId={item.userId}
              speakerId={item.speakerId}
              answer={item.answer}
              date={item.date}
            />}
          />
        </View>
        : 
        <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>No questions for now.</Text>
            <Text style={styles.viewText}>Send questions to speaker.</Text>
        </View>
      }
      </View>
  </React.Fragment>
  )
}

export default AskedQuestionsForSpeakers

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#89cff0',
    height: '100%',
    width: '100%',
},
headerContainer:{
  backgroundColor: '#89cff0',
  height: '10%',
},
secondContainer: {
  backgroundColor: '#89cff0',
  height: '15%',
  flexDirection: 'row', 
  flexWrap:'wrap',
  alignItems:'center',
  justifyContent: 'center',
},
questionsContainer: {
  backgroundColor: '#89cff0',
  height: '71%',
},
participantsTitleText: {
  fontSize: 21,
  fontWeight: "700",
  alignSelf: 'center',
  justifyContent: 'center',
},
buttonCloseQuestions: {
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  position: 'absolute',
  right: 5,
  top: 5,
},
buttonCloseAddPostText: {
  color: 'white',
  fontWeight: '800',
  fontSize: 18,
},
flatList  : {
  backgroundColor : '#89cff0',
},
item: {
  backgroundColor: '#89cff0',
  justifyContent: 'center',
  alignContent:'center',
  margin: 10,
  marginBottom: 5,
  borderStyle: 'dashed',
  borderBottomWidth: 1,
  borderBottomColor: 'black',
},
item2nd: {
  justifyContent: 'center',
  margin: 5,
  fontSize: 19,
},
item2ndTitle: {
  justifyContent: 'center',
  margin: 5,
  fontSize: 19,
  fontWeight: "700",
},
input: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  marginTop: 10,
  marginLeft: 13,
  fontSize: 20,
  marginBottom: 10,
  width: '60%',
  height: 80,
},
textInputsTitle: {
  fontSize: 21,
  fontWeight: "700",
  marginLeft: 5,
  alignSelf: 'center',
},
button: {
  backgroundColor: '#0782F9',
  width: '25%',
  padding: 5,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10,
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 18,
},
viewText: {
  fontSize: 17,
  fontWeight: '700',
  alignContent: 'center',
  justifyContent: 'center',
},
createdEventsView: {
  height: '71%',
  justifyContent: 'center',
  alignItems:'center',
  backgroundColor: '#89cff0'
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
})