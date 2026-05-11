import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, {useEffect, useState} from 'react';
import { auth } from '../../firebase/firebase-config';
import { getQuestionsBySpeakerId } from '../../firebase/dbGetFunctions';
import { setAnswerBySpeaker } from '../../firebase/dbSetFunctions';
import SendQuestionIcon from 'react-native-vector-icons/FontAwesome';

const AnswerQuestions = (props) => {

    const [ questionsList, setQuestionsList] = useState();
    const [ answersObj, setAnswersObj] = useState({});
    const user = auth.currentUser;
    const uid = user.uid;

    useEffect(() => {
        getData()
      }, [])
    
    function getData(){
        getQuestionsBySpeakerId(questionsRetrieved, props.route.params.eventId);
    };
      
    function questionsRetrieved(questionsList){
        setQuestionsList(questionsList);
        questionsList.forEach((question) => {
          answersObj[question.id] = '';
        })
        setAnswersObj(answersObj);
    };

    function addAnswer(currentQuestionId) {
        setAnswerBySpeaker(
          answersObj,
          props.route.params.eventId,
          setAnswersObj,
          currentQuestionId,
          questionsRetrieved);
    };

    const QuestionsItem = ({
        question, answer, currentQuestionId, userFirstName, userLastName,  userImageURL
      }) => (
    <View style={styles.eachQuestion}>
         <View style={styles.imageUserDetailsContainer}>
          {userImageURL ?
                <View style={styles.imageContainer}>
                    {userImageURL && <Image source={{uri: userImageURL}} style={{width: 55 , height: 55, borderRadius: 55 /2}}/>}
                </View>
            :
                <View style={styles.imageContainer}>
                    {<Image source={require('../img/default-profile-image.jpg')} style={{width: 55 , height: 55, borderRadius: 55 /2}}/>}
                </View>
          }
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailsText}>{userFirstName + ' ' + userLastName}</Text>
                </View>
                <View>
                  <Text>
                    <Text style={styles.flatListItemTitleText}>Question: </Text>
                    <Text style={styles.flatListItemText}>{question}</Text>
                  </Text>
                  { answer !== '' ?
                  <Text>
                    <Text style={styles.flatListItemTitleText}>Answer: </Text>
                    <Text style={styles.flatListItemText}>{answer}</Text>
                  </Text>
                  : null 
                  }
              </View>
          </View>
            

        {/* TEXT INPUT FOR ANSWERING QUESTIONS */}
        { answer === '' ? 
        <View style={styles.secondContainer}>
            <TextInput
                key={currentQuestionId}
                placeholder="Answer"
                value={answersObj.currentQuestionId}
                onChangeText={(text) => {
                  answersObj[currentQuestionId] = text;
                  setAnswersObj(answersObj)
                }}
                style={styles.input}
                multiline={true}
                numberOfLines={10}
            />

            <TouchableOpacity
            onPress = {() => {addAnswer(currentQuestionId)}}
            style={styles.button}
            >
              <View style={styles.centerTextIconOnButton}>
                <SendQuestionIcon name="send" size={25} color="white" />
                <Text style={styles.createPollButtonText}>Send</Text>
              </View>
            </TouchableOpacity>
        </View>
        : null }
      </View>
    );

  return (

    <React.Fragment>
      { JSON.stringify(questionsList) !== JSON.stringify([]) ?
        <View style={styles.container}>
          
          {/* QUESTIONS VIEW */}
          <Text style={styles.participantsTitleText}>Answer questions</Text>
            
          {/* QUESTIONS FLAT LIST */}
          <FlatList 
            data={questionsList}
            keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            renderItem={({item}) =>
            <QuestionsItem
              question={item.question}
              eventId={item.eventId}
              userId={item.userId}
              speakerId={item.speakerId}
              currentQuestionId={item.id}
              answer={item.answer}
              userFirstName={item.userDetails.firstName}
              userLastName={item.userDetails.lastName}
              userImageURL={item.userDetails.userImageURL}
            />}
          />
        
        </View>
        
      :
        null
      }

      { JSON.stringify(questionsList)==JSON.stringify([]) ?
          <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>No questions yet.</Text>
            <Text style={styles.viewText}>Check later for new questions.</Text>
          </View>
        : 
          null
      }
    </React.Fragment>
  )
}

export default AnswerQuestions

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#89cff0',
      height: '100%',
  },
  participantsTitleText: {
    fontSize: 20,
    fontWeight: "700",
    paddingLeft: 13,
  },
  item: {
    backgroundColor: '#89cff0',
    justifyContent: 'center',
    alignContent:'center',
    margin: 10,
  },
  flatListItemTitleText: {
    justifyContent: 'center',
    margin: 5,
    fontSize: 19,
    fontWeight: "700",
  },
  flatListItemText: {
    justifyContent: 'center',
    margin: 5,
    fontSize: 19,
  },
  secondContainer: {
    backgroundColor: '#89cff0',
    flexBasis:'auto',
    flexDirection: 'row', 
    flexWrap:'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 20,
    marginBottom: 10,
    width: '60%',
    height: 70,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '25%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  eachQuestion: {
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    backgroundColor: '#89cff0',
    justifyContent: 'center',
    alignContent:'center',
    margin: 10,
    flexBasis:'auto',
  },
  imageUserDetailsContainer: {
    flexDirection: 'row', 
    flexWrap:'wrap',
    width: '100%',
    marginTop: 5,
    flexBasis: 'auto',
  },
  imageContainer: {
    flexBasis: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flexBasis: 'auto',
    justifyContent: 'center',
  },
  detailsText: {
    marginLeft: 5,
    fontSize: 17,
    fontWeight: '700',
  },
  viewText: {
    fontSize: 17,
    fontWeight: '700',
    alignContent: 'center',
    justifyContent: 'center',
  },
  createdEventsView: {
    height: '100%',
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