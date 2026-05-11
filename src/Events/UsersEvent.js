import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import React, {useEffect, useState} from 'react';
import { getParticipants, getEventByEventIdForEdit } from '../../firebase/dbGetFunctions';
import * as WebBrowser from 'expo-web-browser';
import ChatIcon from 'react-native-vector-icons/FontAwesome';
import EmailIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminAccountIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SpeakerIcon from 'react-native-vector-icons/Foundation';
import ReviewerUserIcon from 'react-native-vector-icons/FontAwesome5';
import ReviewerIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthorIcon from 'react-native-vector-icons/Ionicons';
import { auth } from '../../firebase/firebase-config';
import SendMail from '../Mails/SendMail';
import Modal from "react-native-modal";

const UsersEvent = (props) => {

  const [ participantsList, setParticipantsList] = useState([]);
  const [ eventList, setEventList] = useState([]);
  const user = auth.currentUser;
  const uid = user.uid;
  const currentEventId = props.route ? props.route.params.eventId : props.eventId;
  const navigation = props.route ? props.navigation.navigate : props.navigationObj.navigate;
  const [isMailModalVisible, setIsMailModalVisible] = useState(false);
  const [ receiverId, setReceiverId ] = useState();
  const [ receiverImageURL, setReceiverImageURL ] = useState();
  const [ receiverFirstName, setReceiverFirstName ] = useState();
  const [ receiverLastName, setReceiverLastName ] = useState();

  const [ myImageURL, setMyImageURL ] = useState();
  const [ myFirstName, setMyFirstName ] = useState();
  const [ myLastName, setMyLastName ] = useState();

  const toggleMailModal = () => {
    setIsMailModalVisible(!isMailModalVisible);
  };

  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getParticipants(participantsRetrieved, currentEventId);
    getEventByEventIdForEdit(eventRetrieved, currentEventId);
  };

  function participantsRetrieved(participantsList){
    setParticipantsList(participantsList);
    participantsList.forEach((participant) => {
      if(participant.userId === uid) {
        setMyImageURL(participant.userDetails.userImageURL);
        setMyFirstName(participant.userDetails.firstName);
        setMyLastName(participant.userDetails.lastName);
      }
    });
  };

  function eventRetrieved(eventList){
    setEventList(eventList);
  };

  function chatHandler(receiverUserId, eventId){
    navigation("Chat", {receiverUserId, eventId});
  }

  const ParticipantsItem = ({
    userImageURL, userFirstName, userLastName, email, showCV, cv, showEmail, showImage, isPrivateProfile, 
    isSpeaker, isReviewer, isAuthor, userId, eventId, isAdmin
  }) => (
    <View style={styles.eachUser}>
      <View style={styles.userImageDetailsContainer}>
        <View style={styles.imageUserContainer}>
          {userImageURL && showImage && isPrivateProfile === false ?
          <View>
            {userImageURL && <Image source={{uri: userImageURL}} style={{width: 100 , height: 100, borderRadius: 100 /2}}/>}
          </View>
          :
          <View>
            {<Image source={require('../img/default-profile-image.jpg')} style={{width: 100 , height: 100, borderRadius: 100 /2}}/>}
          </View>
          }
        </View>
        <View style={styles.userDetailsContainer}>
          <TouchableOpacity activeOpacity={0.9} style={styles.flatListItem}> 
              <Text>
                <Text>   </Text>
                {isSpeaker ? 
                  <SpeakerIcon name="megaphone" size={30} color="black" />
                : null }

                {isReviewer ?
                  <ReviewerIcon name="magnify" size={35} color="black" />
                : null }

                {isAuthor ?
                  <AuthorIcon name="book-sharp" size={30} color="black" />
                : null }

                {!isSpeaker && !isReviewer && !isAuthor && !isAdmin ?
                  <ReviewerUserIcon name="user-alt" size={30} color="black" />
                : null }

                { isAdmin ?
                  <AdminAccountIcon name="account-star" size={40} color="black" />
                : null }


                <Text style={styles.flatListItemText}>{'  ' + userFirstName + ' ' + userLastName}</Text>
              </Text>
              {showEmail && isPrivateProfile === false ?
              <Text style={styles.flatListItemText}>{email}</Text>
              : null 
              }
              {showCV && props.eventType === 'conference' && isPrivateProfile === false ? 
              <TouchableOpacity onPress={()=>{WebBrowser.openBrowserAsync(cv)}}><Text style={styles.linkText}>Latest CV</Text></TouchableOpacity>
              : null
              }
          </TouchableOpacity>
        </View>
      </View>
      { userId !== uid ? 
        <View style={styles.chatEmailButtonsContainer}>
          { isReviewer && eventList.allowUsersToChatWithReviewers || isAuthor && eventList.allowUsersToChatWithAuthors || isSpeaker && eventList.allowUsersToChatWithSpeakers ?
            <TouchableOpacity
            style={styles.chatButton}
            onPress={() => {chatHandler(userId, eventId)}}
            >
              <View style={styles.centerTextIconOnButton}>
                <ChatIcon name="wechat" size={30} color="white" />
                <Text style={styles.createPollButtonText}>Send message</Text>
              </View>
            </TouchableOpacity>
            :  null 
          }
          {
            eventList.allowUsersToChatAmongThemselves && !isSpeaker && !isReviewer && !isAuthor ?
            <TouchableOpacity
            style={styles.chatButton}
            onPress={() => {chatHandler(userId, eventId)}}
            >
              <View style={styles.centerTextIconOnButton}>
                <ChatIcon name="wechat" size={30} color="white" />
                <Text style={styles.createPollButtonText}>Send message</Text>
              </View>
            </TouchableOpacity>
            : null
          }
            <TouchableOpacity
            onPress = {() => {
              toggleMailModal()
              setReceiverImageURL(userImageURL);
              setReceiverFirstName(userFirstName);
              setReceiverLastName(userLastName);
              setReceiverId(userId);
            }}
            style={styles.chatEmailButton}
            >
              <View style={styles.centerTextIconOnButton}>
                <EmailIcon name="email" size={30} color="white"/>
                <Text style={styles.createPollButtonText}>Send e-mail</Text>
              </View>
            </TouchableOpacity>
    
        </View>
        : null 
      }
    </View>
  );


  return (
    <React.Fragment>
      { JSON.stringify(participantsList) !== JSON.stringify([]) ?
        <View style={styles.container}>
          {/* USERS VIEW */}
          <View style={styles.participantssContainer}>
            <Text style={styles.participantsTitleText}>Users</Text>
          
            {/* USERS FLAT LIST */}
            <FlatList style = {styles.flatList}
              data={participantsList}
              keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
              renderItem={({item}) =>
              <ParticipantsItem
                userFirstName={item.userDetails.firstName}
                userLastName={item.userDetails.lastName}
                email={item.userDetails.userEmail}
                date={item.date}
                key={item.userId}
                showCV={item.userDetails.showCV}
                showEmail={item.userDetails.showEmail}
                showImage={item.userDetails.showImage}
                isPrivateProfile={item.userDetails.isPrivateProfile}
                cv={item.userDetails.userCvURL}
                cvName={item.userDetails.cvFileName}
                userImageURL={item.userDetails.userImageURL}
                isSpeaker={item.isSpeaker}
                isReviewer={item.isReviewer}
                isAuthor={item.isAuthor}
                userId={item.userDetails.userUid}
                eventId={item.eventId}
                isAdmin={item.isAdmin}
              />}
            />
          </View>

          <Modal isVisible={isMailModalVisible}
          >
            <View style={styles.container}>
              <SendMail
              eventId={currentEventId}
              toggleMailModalHandler={toggleMailModal}
              receiverId={receiverId}
              receiverImageURL={receiverImageURL}
              receiverFirstName={receiverFirstName}
              receiverLastName={receiverLastName}
              myImageURL={myImageURL}
              myFirstName={myFirstName}
              myLastName={myLastName}
              myUid={uid}
              />
            </View>
          </Modal>
        </View>

      : 
        <View style={styles.createdEventsView}>
          <Text style={styles.viewText}>No users for now.</Text>
          <Text style={styles.viewText}>Check again later.</Text>
        </View>
      }
    </React.Fragment>
  )
}

export default UsersEvent

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#89cff0',
  height: '100%',
  marginBottom: 20,
},
participantssContainer:{
  backgroundColor: '#89cff0',
  margin: 5,
  paddingLeft: 10,
  paddingRight: 10,
},
participantsTitleText: {
  fontSize: 20,
  fontWeight: "700",
  paddingLeft: 13,
},
flatList  : {
  height : "100%",
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
linkText: {
  justifyContent: 'center',
  color: 'blue',
  marginTop: 7,
  fontSize: 20,
  marginLeft: 5,
  marginRight: 5,
  textDecorationLine: 'underline',
},
userImageDetailsContainer: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  width: '100%',
  marginTop: 5,
},
imageUserContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  width: '30%',
  marginBottom: 6,
},
userDetailsContainer: {
  width: '70%',
  justifyContent: 'center',
},
chatButton: {
  backgroundColor: '#0782F9',
  width: '38%',
  padding: 5,
  borderRadius: 10,
  marginTop: 10,
  marginLeft: 9,
  marginRight: 9,
  justifyContent: 'center',
  alignItems: 'center',
},
chatEmailButton: {
  backgroundColor: '#0782F9',
  width: '35%',
  padding: 5,
  borderRadius: 10,
  marginTop: 10,
  marginLeft: 9,
  marginRight: 9,
  justifyContent: 'center',
  alignItems: 'center',
},
chatEmailButtonsContainer: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 5,
},
eachUser: {
  borderStyle: 'dashed',
  borderBottomWidth: 1,
  borderBottomColor: 'black',
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