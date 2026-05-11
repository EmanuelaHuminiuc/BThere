import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import React, {useEffect, useState} from 'react';
import { getSpeakers } from '../../firebase/dbGetFunctions';
import AskedQuestionsForSpeakers from './AskedQuestionsForSpeakers';
import Modal from "react-native-modal";
import QuestionIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const SpeakersEvent = (props) => {

  const [ speakersList, setSpeakersList] = useState();
  const [ currentSpeakerId, setCurrentSpeakerId] = useState();
  const [isQuestionModalVisible, setQuestionModalVisible] = useState(false);

  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getSpeakers(speakersRetrieved, props.route.params.eventId);
  };
  
  function speakersRetrieved(speakersList){
    setSpeakersList(speakersList);
  };

  const toggleQuestionsModal = () => {
    setQuestionModalVisible(!isQuestionModalVisible);
  };

  const SpeakersItem = ({
    speakerFirstName, speakerLastName, speakerImageURL, speakerEmail, speakerId
  }) => (
    
    <View style={styles.eachSpeaker}>
      <View style={styles.userImageDetailsContainer}>
        <View style={styles.imageUserContainer}>
        {speakerImageURL ?
          <View>
            {speakerImageURL && <Image source={{uri: speakerImageURL}} style={{width: 100 , height: 100, borderRadius: 100 /2}}/>}
          </View>
          :
        <View>
          {<Image source={require('../img/default-profile-image.jpg')} style={{width: 100 , height: 100, borderRadius: 100 /2}}/>}
        </View>
        }
        </View>

        <View style={styles.userDetailsContainer}>
          <View style={styles.flatListItem}> 
              <Text style={styles.flatListItemText}>{speakerFirstName + ' ' + speakerLastName}</Text>
              <Text style={styles.flatListItemText}>{speakerEmail}</Text>
          </View>
        </View>
      </View>
      <View style={styles.chatEmailButtonsContainer}>

          { props.route.params.eventExtraSettings.allowUsersToAskQuestions ?
          <View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  toggleQuestionsModal(true);
                  setCurrentSpeakerId(speakerId);
                }}>
              <View style={styles.centerTextIconOnButton}> 
                <QuestionIcon name="comment-question" size={30} color="white" />
                <Text style={styles.createPollButtonText}>Ask question</Text>
              </View>  
            </TouchableOpacity> 
          </View>
          : null 
        }
      </View>
    </View>
  );

  return (
    <React.Fragment>
      { JSON.stringify(speakersList) !== JSON.stringify([]) ?
          <View>
            {/* SPEAKERS VIEW */}
            <View style={styles.participantssContainer}>
              
            {/* SPEAKERS FLAT LIST */}
            <FlatList style = {styles.flatList}
              data={speakersList}
              keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
              renderItem={({item})  =>
              <SpeakersItem
                eventId={item.eventId}
                speakerEmail={item.speakerEmail}
                speakerId={item.speakerId}
                speakerFirstName={item.userDetails.firstName}
                speakerLastName={item.userDetails.lastName}
                speakerImageURL={item.userDetails.userImageURL}
              />}
            />
              {/* ADD QUESTIONS MODAL  */}
              { props.route.params.eventExtraSettings.allowUsersToAskQuestions ?
                  <Modal isVisible={isQuestionModalVisible}
                  statusBarTranslucent={true}>
                    <View style={styles.container}>
                      <AskedQuestionsForSpeakers
                      toggleQuestionsModalHandler={toggleQuestionsModal}
                      eventId={props.route.params.eventId}
                      speakerId={currentSpeakerId}
                      />
                    </View>
                  </Modal>
                : null
              }
                  
            </View>
          </View>
      : 
        <View style={styles.createdEventsView}>
          <Text style={styles.viewText}>No speakers yet.</Text>
          <Text style={styles.viewText}>Check again later.</Text>
        </View>
      }    
    </React.Fragment>
  )
}

export default SpeakersEvent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#89cff0',
    justifyContent: 'center',
    alignItems: 'center',
  },
participantssContainer:{
  backgroundColor: '#89cff0',
  paddingLeft: 10,
  paddingRight: 10,
},
participantsTitleText: {
  fontSize: 20,
  fontWeight: "700",
  paddingLeft: 13,
},
flatList  : {
  backgroundColor : '#89cff0',
  height : "100%",
},
item: {
  backgroundColor: '#89cff0',
  justifyContent: 'center',
  alignContent:'center',
  margin: 10,
},
item2nd: {
  backgroundColor: 'white',
  justifyContent: 'center',
  margin: 5,
  fontSize: 14,
},
button: {
  backgroundColor: '#0782F9',
  width: '60%',
  padding: 10,
  borderRadius: 10,
  alignSelf: 'center',
  marginTop: 11,
  marginBottom: 11,
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
},
flatListItem: {
  justifyContent: 'center',
},
flatListItemText: {
  justifyContent: 'center',
  marginTop: 7,
  fontSize: 20,
  marginLeft: 5,
  marginRight: 5,
},
userImageDetailsContainer: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  width: '100%',
  marginTop: 5,
},
imageUserContainer: {
  marginTop: 5,
  justifyContent: 'center',
  alignItems: 'center',
  width: '30%',
},
userDetailsContainer: {
  width: '70%',
  justifyContent: 'center',
},
chatEmailButton: {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  marginTop: 10,
  justifyContent: 'center',
  alignItems: 'center',
},
chatEmailButtonsContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 5,
},
eachSpeaker: {
  borderStyle: 'dashed',
  borderBottomWidth: 1,
  borderBottomColor: 'black',
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
})