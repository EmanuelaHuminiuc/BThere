import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image} from 'react-native';
import { getParticipantsById, getPosts } from '../../firebase/dbGetFunctions';
import Modal from "react-native-modal";
import AddPostsComponent from '../Posts/AddPostsComponent';
import AddCommentsComponent from '../Posts/AddCommentsComponent';
import TimelinePostItem from './TimelinePostItem';
import DropDownPicker from 'react-native-dropdown-picker';
import * as WebBrowser from 'expo-web-browser';
import AddPostIcon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../../firebase/firebase-config';
import Accordion from 'react-native-collapsible/Accordion';

const TimelineScreen = (props) => {

  const dropDownMenuArray = [
    {label: 'Timeline', value: 'TimelineScreen'},
    {label: 'E-mails', value: 'DisplayMailsComponent'},
    {label: 'Notes', value: 'Notes'},
    {label: 'Statistics', value: 'Statistics'},
    {label: 'Users', value: 'UsersEvent'},
    {label: 'Agenda', value: 'AgendaScreen'}
  ];

  if(props.route.params.selectedEventExtraSettings.isPollingAllowed) {
    dropDownMenuArray.push({label: 'Polls', value: 'DisplayPollsComponent'})
  }

  if(props.route.params.selectedEventExtraSettings.showEventLocation) {
    dropDownMenuArray.push({label: 'Location', value: 'Location'})
  }
  if(props.route.params.selectedEventExtraSettings.areReviewersAllowed && props.route.params.selectedEventExtraSettings.eventType === 'conference') {
    dropDownMenuArray.push({label: 'Reviewers', value: 'Reviewers'})
  }
  
  if(props.route.params.selectedEventExtraSettings.areAuthorsAllowed && props.route.params.selectedEventExtraSettings.eventType === 'conference') {
    dropDownMenuArray.push({label: 'Authors', value: 'Authors'})
  }

  if(props.route.params.selectedEventExtraSettings.areAuthorsAllowed && props.route.params.selectedEventExtraSettings.eventType === 'conference') {
    dropDownMenuArray.push({label: 'Papers', value: 'Papers'})
  }

  const { route } = props;
  const [postsList, setPostsList] = useState();
  const [userData, setUserData] = useState({});
  const [participantsData, setParticipantsData] = useState({});

  const [isPostsModalVisible, setPostsModalVisible] = useState(false);
  const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);

  const [currentActivePostId, setCurrentActivePostId] = useState('');
  const eventId = route.params.selectedEventId;
  const eventExtraSettings = props.route.params.selectedEventExtraSettings;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(dropDownMenuArray);
  
  const [sections, setSections] = useState([]);
  const [activeSections, setActiveSections] = useState([]);

  const user = auth.currentUser;
  const uid = user.uid;

  const togglePostsModal = () => {
    setPostsModalVisible(!isPostsModalVisible);
  };
  const toggleCommentsModal = () => {
    setCommentsModalVisible(!isCommentsModalVisible);
  };

  useEffect(() => {
    getPostsData();
    getUserData();
  }, []);

  function getPostsData(){
    getPosts(postsRetrieved, route?.params?.selectedEventId);
    props.navigation.addListener(
      'focus',
      payload => {
        setValue('TimelineScreen')
        getPosts(postsRetrieved, route?.params?.selectedEventId);
      }
  )};

  function getUserData(){
    getParticipantsById(uid, eventId).then((response) => {
      setUserData(response[0]);
      if(props.route.params.selectedEventExtraSettings.areSpeakersAllowed && !response[0]?.isSpeaker && props.route.params.selectedEventExtraSettings.eventType === 'conference' || props.route.params.selectedEventExtraSettings.eventType === 'publicEvent') {
        dropDownMenuArray.push({label: 'Speakers', value: 'Speakers'})
      }
    
      if(props.route.params.selectedEventExtraSettings.areSpeakersAllowed && response[0]?.isSpeaker) {
        dropDownMenuArray.push({label: 'Answer users questions', value: 'AnswerQuestions'})
      }

      if(props.route.params.selectedEventExtraSettings.eventType === 'conference' && response[0]?.isAuthor) {
        dropDownMenuArray.push({label: 'Upload/Update papers', value: 'AuthorUploadsPapers'})
      }

      if(props.route.params.selectedEventExtraSettings.eventType === 'conference' && response[0]?.isReviewer) {
        dropDownMenuArray.push({label: 'Review papers', value: 'ReviewsDisplayComponent'})
      }
    })
  }

  function postsRetrieved(postsList){
    setPostsList(postsList);
    createSectionsFromAuthorPaperList()
  };

  function getCurrentPostIdData(){
    if(!postsList){
      return [];
    }
    return postsList.find( (post) => {
      return post.id === currentActivePostId;
    })
  };

  function onDropDownChange(value) {
      if(value === 'AnswerQuestions') {
        props.navigation.navigate(value, {eventId, eventExtraSettings, userData, participantsData});
      }
      if(value !== 'TimelineScreen') {
        props.navigation.navigate(value, {eventId, eventExtraSettings});
      }
  }

  function createSectionsFromAuthorPaperList(){
    const sectionsArray = [];
      sectionsArray.push({
        title: route?.params?.selectedEventName, 
        organizer: route?.params?.selectedEventOrganizer,
        location: route?.params?.selectedEventLocation, 
        startDate: route?.params?.selectedEventStartDate,
        endDate: route?.params?.selectedEventEndDate,
        conferenceLink: route?.params.selectedConferenceLink,
        conferenceInstitution: route?.params.selectedConferenceInstitution,
      });
    setSections(sectionsArray);
  }

  const renderHeader = (section) => {
      return (
      <View style={styles.header}>
        { route?.params?.selectedEventImageURL ?
          <View>
            {route?.params?.selectedEventImageURL && <Image source={{uri: route?.params?.selectedEventImageURL}} style={{width: 200 , height: 100, alignSelf: 'center'}}/>}
          </View>
        : 
          null 
        } 
          <Text style={styles.headerText}>{section.title}</Text>
      </View>
      );
  };

  const renderContent = (section) => {
      return (
        <View style={styles.eventDetailsContainer}>
          <View style={styles.currentEventContent}>
            {route?.params?.selectedConferenceLink ?
              <TouchableOpacity style={styles.textCurrentEvent} onPress={()=>{WebBrowser.openBrowserAsync(route?.params?.selectedConferenceLink)}}><Text style={styles.linkText}>Website link</Text></TouchableOpacity>
            : 
              null
            }
            {route?.params?.selectedConferenceInstitution ?
              <Text style={styles.textCurrentEvent}>{section.conferenceInstitution} - {section.location}</Text>
            : 
            <Text style={styles.textCurrentEvent}>{section.location}</Text>
            }
              <Text style={styles.textCurrentEvent}>{section.startDate} - {section.endDate}</Text>
              <Text style={styles.textCurrentEvent}>{section.organizer}</Text>
        </View>
      </View>
      );
  };

  const updateSections = (activeSections) => {
      setActiveSections(activeSections);
  };

return (
    <View style={styles.timelineContainer}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={(value) => {onDropDownChange(value)}}
        style={{
          backgroundColor: "white",
        }}
        labelStyle={{
          fontWeight: "bold",
          backgroundColor: "white"
        }}
        listItemContainer={{
          height: 1000,
        }}
        listItemLabelStyle={{
          color: "#000"
        }}
        customItemContainerStyle={{
          backgroundColor: "red",
          fontWeight: "bold"
        }}
      />

      <Accordion
        sections={sections}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateSections}
      />

       {/* ADD POSTS MODAL  */}
       { props.route.params.selectedEventExtraSettings.arePostsAllowed || props.route.params.selectedAdminId === uid ?
          <Modal isVisible={isPostsModalVisible}
          statusBarTranslucent={true}>
            <View style={styles.container}>
              <AddPostsComponent
              selectedEventId={route.params.selectedEventId}
              togglePostsModalHandler={togglePostsModal}
              getPostsHandler={getPosts}
              postsRetrievedHandler={postsRetrieved}
              />
            </View>
          </Modal>
        : 
          null
        }

        {/* ADD COMMENTS MODAL  */}
        { props.route.params.selectedEventExtraSettings.areCommentsAllowed ?
          <Modal isVisible={isCommentsModalVisible}
          >
            <View style={styles.container}>
              <AddCommentsComponent 
              postData={getCurrentPostIdData()}
              postIdForComments={currentActivePostId}
              toggleCommentsModalHandler={toggleCommentsModal}
              />
            </View>
          </Modal>
        : 
          null
        }
    
        { JSON.stringify(postsList) !== JSON.stringify([]) ?
          <View style={styles.postsContainer}>
            {/* POSTS FLAT LIST */}
            <FlatList style = {styles.flatList}
              data={postsList}
              keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
              renderItem={({item})  =>
                <TimelinePostItem
                  postsRetrieved={postsRetrieved}
                  selectedEventId={route.params.selectedEventId}
                  currentActivePostId={currentActivePostId}
                  setCurrentActivePostId={setCurrentActivePostId}
                  toggleCommentsModalHandler={toggleCommentsModal}
                  item={item}
                  selectedEventExtraSettings={route.params.selectedEventExtraSettings}
                  selectedAdminId={route.params.selectedAdminId}
                />
              }
              />
          </View>
        :
          <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>Nothing to see for now.</Text>
            <Text style={styles.viewText}>Check again later.</Text>
          </View>
        }

          {/* ADD POST BUTTON */}
          { props.route.params.selectedEventExtraSettings.arePostsAllowed || props.route.params.selectedAdminId === uid?
              <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    togglePostsModal(true);
                  }}>
                  <AddPostIcon name="post-add" size={30} color="white" />
                  <Text style={styles.buttonText}>Post</Text>
              </TouchableOpacity>  
          : 
            null
          }
    </View>
  )
}

export default TimelineScreen

const styles = StyleSheet.create({
timelineContainer: {
  backgroundColor: '#89cff0',
  flex: 1,
  width: "100%",
  height : "100%",
  paddingTop : 10,
},
secondContainer: {
  alignItems: 'center',
},
flatList: {
    backgroundColor : '#89cff0',
    paddingBottom: 10,
    paddingLeft:  20,
    paddingRight: 20,
    marginBottom: 10,
    margin: 5
},
eventDetailsContainer: {
  alignItems: 'center',
  justifyContent: 'center',
},
currentEventContent: {
    backgroundColor : '#0782F9',
    border: 15,
    width: '100%',
    marginBottom: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
},
textCurrentEvent: {
  fontSize: 17,
  fontWeight: "500",
  color: 'white',
},
container: {
  flex: 1,
  backgroundColor: '#89cff0',
  justifyContent: 'center',
  alignItems: 'center',
},
button: {
  backgroundColor: 'rgba(7, 130, 249, 0.7)',
  width: '20%',
  padding: 15,
  borderRadius: 100,
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  width: 72,
  height: 72,
  position: 'absolute',
  bottom: 10,
  right: 10,
  marginBottom: 10,
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
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
linkText: {
  justifyContent: 'center',
  color: 'blue',
  marginTop: 7,
  fontSize: 17,
  marginLeft: 5,
  marginRight: 5,
  textDecorationLine: 'underline',
},
viewText: {
  fontSize: 17,
  fontWeight: '700',
  alignContent: 'center',
  justifyContent: 'center',
},
createdEventsView: {
  height: '50%',
  justifyContent: 'center',
  alignItems:'center',
  backgroundColor: '#89cff0'
},
title: {
  textAlign: 'center',
  fontSize: 22,
  fontWeight: '300',
  marginBottom: 20,
},
header: {
  backgroundColor: '#0782F9',
  padding: 10,
},
headerText: {
  textAlign: 'center',
  fontSize: 16,
  fontWeight: '500',
  color: 'white',
},
content: {
  padding: 20,
  backgroundColor: '#89cff0',
},
postsContainer: {
  paddingBottom: 200,
},
});