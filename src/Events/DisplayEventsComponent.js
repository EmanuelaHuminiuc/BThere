import {StyleSheet, TouchableOpacity, Text, View, FlatList, Image, Alert } from 'react-native';
import React, {useEffect, useState} from 'react';
import { auth } from '../../firebase/firebase-config';
import { setIsExpired } from '../../firebase/dbGetFunctions';
import { getEventsParticipations, getAvailableEvents, getCreatedEvents, getJoinedEvents, 
  getExpiredEvents, getEventsWhereUserParticipate, getConferences } from '../../firebase/dbGetFunctions';
import { deleteEvent, deleteCommentsByEventId, deletePostByEventId, 
  leaveEventbyEventId } from '../../firebase/dbDeleteFunctions';
import { joinEvent } from '../../firebase/dbSetFunctions';
import utilsService from '../Common/UtilsService';
import EditEventsIcon from 'react-native-vector-icons/FontAwesome';
import DeleteIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SendInvitesIcon from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';

const DisplayEventsComponent = (props) => {

  const dropDownMenuArray = [
    {label: 'My Events', value: 'allParticipateEvents'},
  ];

  if(props.displayEvents === "myEvents") {
    dropDownMenuArray.push({label: 'Conferences', value: 'conferenceEvents'})
    dropDownMenuArray.push({label: 'Created by Me', value: 'createdEvents'})
    dropDownMenuArray.push({label: 'Available Events', value: 'availableEvents'})
    dropDownMenuArray.push({label: 'Enrolled Events', value: 'joinedEvents'})
    dropDownMenuArray.push({label: 'Finished Events', value: 'expiredEvents'})
  }
  
    const [eventsList, setEventsList] = useState([]);
    const [displayEventsMode, setEventDisplayEventsMode] = useState('allParticipateEvents');

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(dropDownMenuArray);

    const [isLoading, setLoading] = useState(true);

    const user = auth.currentUser;
    const uid = user.uid; 

    useEffect(() => {
      getData();
    }, [])

    function getData(){
      props.navigationObj.addListener(
        'focus',
        payload => { 
          setValue('allParticipateEvents')
          getAllEventsWhereUserParticipates() 
        }
      );
    };

    function showNotParticipantAtConferenceAlert() {
      Alert.alert(
        'You are not enrolled on this event',
        'Please check your e-mail for your invitation or contact the event admin!',
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

    function showNotParticipantAtAvailableEventsAlert() {
      Alert.alert(
        'You are not enrolled on this event',
        'Please press the enroll button!',
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

    async function getAllEventsWhereUserParticipates(){
      const finalEvents = [];
      const tempEventList = await getEventsWhereUserParticipate();
      setLoading(false);
      if(tempEventList && tempEventList.length != 0){
      tempEventList.forEach((event) => {
        event.userIsParticipant = true;
        if( compareTime(event.eventEndDate) ){
          setIsExpired(event.id)
        } else {
          finalEvents.push(event);
        }
      })
      const formattedEventList = utilsService.getEventExtraSettingsAsObj(finalEvents);
      setEventsList(formattedEventList);
    }
    }

    function compareTime (timestamp){
      let date = timestamp.toDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();

      if(year <= new Date().getFullYear() && month <= new Date().getMonth() + 1 && day <= new Date().getDate()) {
        if (year === new Date().getFullYear() && month === new Date().getMonth() + 1 && day === new Date().getDate()) {
        return hours <= new Date().getHours() && minutes <= new Date().getMinutes();
        } else if (year === new Date().getFullYear() && month === new Date().getMonth() + 1 && day < new Date().getDate()) {
          return year === new Date().getFullYear() && month === new Date().getMonth() + 1 && day < new Date().getDate();
        } else if (year === new Date().getFullYear() && month < new Date().getMonth() + 1 && day < new Date().getDate()) {
          return year === new Date().getFullYear() && month < new Date().getMonth() + 1 && day < new Date().getDate();
        } else if (year < new Date().getFullYear() && month < new Date().getMonth() + 1 && day < new Date().getDate()) {
          return year < new Date().getFullYear() && month < new Date().getMonth() + 1 && day < new Date().getDate()
        }
      }
    };

    async function eventsRetrieved(eventsList){
      const formattedEventList = utilsService.getEventExtraSettingsAsObj(eventsList);
      const participations = await getEventsParticipations(uid);
      setLoading(false);
      formattedEventList.forEach((event) => {
        if(participations.some((element) => {
          return element.eventId === event.id
        })) {
          event.userIsParticipant = true;
        }
      })
      setEventsList(formattedEventList);
    };

    function convertTimestamp (timestamp){
      let date = timestamp.toDate();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();
      date = day + '/' + month + '/' + year;
      return date;
    };

    function convertTimestampWithHour (timestamp){
      let date = timestamp.toDate();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      date = day + '/' + month + '/' + year + ' - ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
      return date;
    };

    function editEventPressHandler(eventId, eventExtraSettings){
        props.navigationObj.navigate('EventScreen', {eventDisplayMode: 'editEvent', eventId, eventExtraSettings});
    };
    function sendInvitesPressHandler(eventId, eventExtraSettings){
        props.navigationObj.navigate('Send Invites', {eventId, eventExtraSettings});
    };
   
    function deleteEventHandler(eventId){
        deleteEvent(eventId).then(() => {
          getCreatedEvents(eventsRetrieved);
          deleteCommentsByEventId(eventId);
          deletePostByEventId(eventId)
      })
    };

    function joinEventHandler(eventId){
      joinEvent(eventId, false).then(() => {
        getAvailableEvents(eventsRetrieved);
      })
    };

    function leaveEventHandler(eventId){
      leaveEventbyEventId(eventId).then(() => {
        getJoinedEvents(eventsRetrieved);
    })
    };

    async function allParticipateEventsPressHandler() {
      setEventDisplayEventsMode('allParticipateEvents');
      getAllEventsWhereUserParticipates();
    };

    function conferencesEventsPressHandler() {
      setEventDisplayEventsMode('conferenceEvents');
      getConferences(eventsRetrieved)
    };

    function availableEventsPressHandler() {
      setEventDisplayEventsMode('availableEvents');
      getAvailableEvents(eventsRetrieved)
    };

    function createdEventsHandler(){
      setEventDisplayEventsMode('createdEvents');
      getCreatedEvents(eventsRetrieved)
    };

    function joinedEventsHandler(){
      setEventDisplayEventsMode('joinedEvents');
      getJoinedEvents(eventsRetrieved)
    };

    function expiredEventsHandler(){
      setEventDisplayEventsMode('expiredEvents');
      getExpiredEvents(eventsRetrieved)
    };

    function onDropDownChange(value) {
      if(value === 'allParticipateEvents') {
        allParticipateEventsPressHandler();
      }
      if(value === 'conferenceEvents') {
        conferencesEventsPressHandler();
      }
      if(value === 'createdEvents') {
        createdEventsHandler();
      }
      if(value === 'availableEvents') {
        availableEventsPressHandler();
      }
      if(value === 'joinedEvents') {
        joinedEventsHandler();
      }
      if(value === 'expiredEvents') {
        expiredEventsHandler();
      }
  }

    

    //FLAT LIST ITEM
    const Item = ({eventStartDate, eventId, eventEndDate, eventName,
      eventLocation, eventOrganizer, eventExtraSettings, eventImageURL, conferenceLink, adminId, isUserParticipant,
      conferenceInstitution
    }) => (
      
    <View style={styles.containerEvents}>
        <TouchableOpacity activeOpacity={0.9} style={styles.item} onPress={() => {
              if (isUserParticipant){
              const showEvent = {
                selectedEventName: eventName,
                selectedEventStartDate: convertTimestamp(eventStartDate),
                selectedEventEndDate: convertTimestamp(eventEndDate),
                selectedEventLocation: eventLocation,
                selectedEventOrganizer: eventOrganizer,
                selectedEventId: eventId,
                selectedEventExtraSettings: eventExtraSettings,
                selectedEventImageURL: eventImageURL,
                selectedConferenceLink: conferenceLink,
                selectedConferenceInstitution: conferenceInstitution,
                selectedAdminId: adminId,
              };

              props.navigationObj.navigate('Timeline', {
                screen: 'TimelineScreen',
                params: showEvent, eventExtraSettings,
              });
            } else if (displayEventsMode === "conferenceEvents"){
              showNotParticipantAtConferenceAlert();
            } else if (displayEventsMode === "availableEvents"){
              showNotParticipantAtAvailableEventsAlert();
            }
          }
      }>
        
          {eventImageURL && <Image source={{uri: eventImageURL}} style={{width: 280 , height: 150, justifyContent: 'center', alignSelf: 'center'}}/>}
          <Text style={styles.item2nd}>{eventName}</Text>
          <Text style={styles.item2nd}>{convertTimestampWithHour(eventStartDate)} - {convertTimestampWithHour(eventEndDate)}</Text>
         {eventOrganizer ?
            <Text style={styles.item2nd}>{eventOrganizer} - {eventLocation}</Text>
          :
            <Text style={styles.item2nd}>{eventLocation}</Text>
         }
    
        </TouchableOpacity>  

      {/* EDIT & DELETE EVENT BUTTONS - MY EVENTS MODE*/}
      {displayEventsMode === 'createdEvents' || displayEventsMode === 'allParticipateEvents' && adminId === uid || displayEventsMode === 'joinedEvents' && adminId === uid? 
        <View style={styles.eventButtonsContainer}>
      
        {/* EDIT EVENT BUTTON - MY EVENTS MODE*/}
        <TouchableOpacity
          style={styles.editEventButton}
          onPress={() => {editEventPressHandler(eventId, eventExtraSettings)}}
          >
          <EditEventsIcon name="edit" size={30} color="white" />
          <Text style={styles.editEventButtonText}>Edit event</Text>
        </TouchableOpacity> 
    
        {/* DELETE EVENT BUTTON - MY EVENTS MODE*/}
        <TouchableOpacity
          style={styles.editEventButton}
          onPress={ () => {deleteEventHandler(eventId)} }>
          <DeleteIcon name="delete" size={30} color="white" />
          <Text style={styles.editEventButtonText}>Delete event</Text>
        </TouchableOpacity> 
        
        {/* SEND INVITES BUTTON - MY EVENTS MODE*/}
        { eventExtraSettings.eventType === 'privateEvent' ?
          <TouchableOpacity
            style={styles.editEventButton}
            onPress={() => {sendInvitesPressHandler(eventId)}}
            >
            <SendInvitesIcon name="add" size={30} color="white" />
            <Text style={styles.editEventButtonText}>Invites</Text>
          </TouchableOpacity> 
        :null }

        </View>
        : null 
      }

      {/* JOIN EVENT BUTTON - AVAILABLE EVENTS MODE*/}
      { displayEventsMode === 'availableEvents' ?
        <View style={styles.eventButtonsContainer}> 
          <TouchableOpacity style={styles.joinEventButton}
          onPress={ () => {joinEventHandler(eventId)} }>
            <Text style={styles.joinEventButtonText}>Enroll event</Text>
          </TouchableOpacity>
        </View>
      : null
      }

      {/* LEAVE EVENT BUTTON - MY EVENTS MODE - joinedEvents MODE*/}
      { displayEventsMode === 'joinedEvents' && adminId !== uid ?
        <View style={styles.eventButtonsContainer}> 
          <TouchableOpacity style={styles.joinEventButton}
          onPress={ () => {leaveEventHandler(eventId)} }>
            <Text style={styles.joinEventButtonText}>Leave event</Text>
          </TouchableOpacity>

        </View>
      : null
      }
    </View>
  );

  return (
    <View style={styles.content}>
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
      { isLoading ?
      <View>
        {<Image source={require('../img/spinner.gif')} style={{width: 50 , height: 50, borderRadius: 150 /2, alignSelf: 'center'}}/>}
        <Text style={styles.viewText}>Getting the events!</Text>
      </View>
      :
      <View>
        
      { JSON.stringify(eventsList) !== JSON.stringify([]) ?
          <View>
              {/* EVENTS FLAT LIST */}
                <FlatList style = {styles.flatList}
                data={eventsList}
                keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                renderItem={({item})  =>
                !item.eventExtraSettings.eventType === 'publicEvent' && props.displayEvents === 'availableEvents' && !item.eventExtraSettings.isExpired === false? 
                null
                : <Item
                  eventName={item.eventName}
                  eventStartDate={item.eventStartDate}
                  eventEndDate={item.eventEndDate}
                  eventLocation={item.eventLocation}
                  eventOrganizer={item.eventOrganizer}
                  key={item.id}
                  eventId={item.id}
                  adminId={item.adminId}
                  eventExtraSettings={item.eventExtraSettings}
                  eventImageURL={item.eventImageURL}
                  conferenceLink={item.conferenceLink}
                  isUserParticipant={item.userIsParticipant}
                  conferenceInstitution={item.conferenceInstitution}
                />}
              />
            </View>
        : 
          null 
      }

      { JSON.stringify(eventsList)==JSON.stringify([]) && displayEventsMode === "allParticipateEvents" ?
          <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>You are not participating in any events.</Text>
            <Text style={styles.viewText}>You can create events on Add Event page</Text>
            <Text style={styles.viewText}>or you can join</Text>
            <Text style={styles.viewText}>an event in Available Events page.</Text>
          </View>
        : 
          null
      }

      { JSON.stringify(eventsList)==JSON.stringify([]) && displayEventsMode === "conferenceEvents" ?
          <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>No conferences available.</Text>
            <Text style={styles.viewText}>You can check your email or</Text>
            <Text style={styles.viewText}>you can come back here soon.</Text>
          </View>
        : 
          null
      }

      { JSON.stringify(eventsList)==JSON.stringify([]) && displayEventsMode === "createdEvents" ?
          <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>You have no created events.</Text>
            <Text style={styles.viewText}>You can create events on Add Event page.</Text>
          </View>
        : 
          null
      }

      { JSON.stringify(eventsList)==JSON.stringify([]) && displayEventsMode === "availableEvents" ?
          <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>No available events.</Text>
            <Text style={styles.viewText}>You can come back here soon.</Text>
          </View>
        : 
          null
      }

      { JSON.stringify(eventsList)==JSON.stringify([]) && displayEventsMode === "joinedEvents" ?
          <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>You are not enrolled on events.</Text>
            <Text style={styles.viewText}>You can enroll on Available Events page.</Text>
          </View>
        : 
          null
      }

      { JSON.stringify(eventsList)==JSON.stringify([]) && displayEventsMode === "expiredEvents" ?
          <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>There are no expired events yet.</Text>
          </View>
        : 
          null
      }
        </View>
      }
    </View>
  )
}

export default DisplayEventsComponent

const styles = StyleSheet.create({
    flatList  : {
        backgroundColor : '#89cff0',
        paddingLeft :  10,
        paddingRight : 10,
    },
    content : {
        paddingTop : 10,
        backgroundColor : '#89cff0',
        height: '100%',
        paddingBottom: 80,
    },
    containerEvents:{
      borderStyle: 'dashed',
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
    viewText: {
      fontSize: 17,
      fontWeight: '700',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    createdEventsView: {
      height: '100%',
      justifyContent: 'center',
      alignItems:'center',
    },
    item: {
      backgroundColor: '#89cff0',
      justifyContent: 'center',
      alignContent:'center',
      margin: 15,
    },
    item2nd: {
      justifyContent: 'center',
      alignSelf: 'center',
      margin: 5,
      fontSize: 18,
      fontWeight: '600',
    },
    editEventButton: {
      backgroundColor: '#0782F9',
      width: '35%',
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 9,
      marginRight: 9,
    },
    editEventButtonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 17,
    },
    invitesEventButton: {
      backgroundColor: '#0782F9',
      width: '35%',
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 2,
      marginBottom: 5,
      marginLeft: 120,
    },
    invitesEventButtonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 17,
    },
    joinEventButton: {
      backgroundColor: '#0782F9',
      width: '35%',
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 2,
      marginBottom: 5,
    },
    joinEventButtonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 17,
    },
    createdEventsButton: {
      backgroundColor: '#0782F9',
      width: '35%',
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10,
    },
    createdEventsButtonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 17,
      alignSelf: 'center',
    },
    joinedEventsButton: {
      backgroundColor: '#0782F9',
      width: '35%',
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 30,
    },
    joinedEventsButtonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 17,
      alignItems: 'center',
    },
    eventButtonsContainer: {
      flexDirection: 'row', 
      flexWrap:'wrap',
      alignContent: 'center',
      justifyContent: 'center',
    },
    eachEvent: {
      alignItems: 'center',
      justifyContent: 'center',
    }
  })