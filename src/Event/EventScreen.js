import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, {useEffect, useState} from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase/firebase-config';
import { Timestamp } from "firebase/firestore";
import 'react-native-get-random-values';
import { setEventDetails, updateEventDetails, setSpeakerOnEvent, setReviewersOnConference, 
  setAuthorsOnConference, setLocationDetailsForEvent } from '../../firebase/dbSetFunctions';
import DateTimePicker from './DatePicker';
import { getEventByEventIdForEdit } from '../../firebase/dbGetFunctions';
import Modal from "react-native-modal";
import CreatePollsComponent from '../Polls/CreatePollsComponent';
import CreateAgendaComponent from '../Agenda/CreateAgendaComponent';
import SendPushNotificationsComponent from '../PushNotificationsService/SendPushNotificationsComponent';
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import utilsService from '../Common/UtilsService';
import * as Device from 'expo-device';
import Checkbox from 'expo-checkbox';
import SendPushNotificationsIcon from 'react-native-vector-icons/Ionicons';
import AgendaIcon from 'react-native-vector-icons/MaterialIcons';
import PollIcon from 'react-native-vector-icons/FontAwesome5';
import LocationIcon from 'react-native-vector-icons/MaterialIcons';
import InviteIcon from 'react-native-vector-icons/Ionicons';
import AddEventIcon from 'react-native-vector-icons/MaterialIcons';

const EventScreen = (props) => {

  const dropDownMenuArray = [
    {label: 'Conference/Symposia', value: 'conference'},
    {label: 'Private Event', value: 'privateEvent'},
    {label: 'Public Event', value: 'publicEvent'}
  ];

    const [myEventName, setEventName] = useState('');
    const [myEventLocation, setEventLocation] = useState('');
    const [speakerEmail, setSpeakerEmail] = useState('');
    const [speakerFirstName, setSpeakerFirstName] = useState('');
    const [speakerLastName, setSpeakerLastName] = useState('');
    const [reviewerEmail, setReviewerEmail] = useState('');
    const [reviewerFirstName, setReviewerFirstName] = useState('');
    const [reviewerLastName, setReviewerLastName] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [authorFirstName, setAuthorFirstName] = useState('');
    const [authorLastName, setAuthorLastName] = useState('');
    const [conferenceInstitution, setConferenceInstitution] = useState('');
    const [conferenceLink, setConferenceLink] = useState('');
    const [locationDetails, setLocationDetails] = useState('');
    const [cityDetails, setCityDetails] = useState('');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

    const [areSpeakersAllowed, setAreSpeakersAllowed] = useState(false);
    const [areReviewersAllowed, setAreReviewersAllowed] = useState(false);
    const [areAuthorsAllowed, setAreAuthorsAllowed] = useState(false);
    const [isPollingAllowed, setIsPollingAllowed] = useState(false);
    const [isPollingAllowedForUsers, setIsPollingAllowedForUsers] = useState(false);
    const [areStatisticsAllowed, setAreStatisticsAllowed] = useState(false);
    const [areStatisticsAllowedForUsers, setAreStatisticsAllowedForUsers] = useState(false);
    const [showEventLocation, setShowEventLocation] = useState(false);
    const [arePostsAllowed, setArePostsAllowed] = useState(false);
    const [areCommentsAllowed, setAreCommentsAllowed] = useState(false);
    const [allowUsersToChatAmongThemselves, setAllowUsersToChatAmongThemselves] = useState(false);
    const [allowUsersToChatWithSpeakers, setAllowUsersToChatWithSpeakers] = useState(false);
    const [allowUsersToChatWithReviewers, setAllowUsersToChatWithReviewers] = useState(false);
    const [allowUsersToChatWithAuthors, setAllowUsersToChatWithAuthors] = useState(false);
    const [allowUsersToAskQuestions, setAllowUsersToAskQuestions] = useState(false);
    const [showEventLocationDetails, setShowEventLocationDetails] = useState(false);

    const [isPollsModalVisible, setPollsModalVisible] = useState(false);
    const [isAgendaModalVisible, setAgendaModalVisible] = useState(false);
    const [isPushNotificationModalVisible, setIsPushNotificationModalVisible] = useState(false);

    const [open, setOpen] = useState(false);
    const [eventTypeValue, setEventTypeValue] = useState(null);
    const [items, setItems] = useState(dropDownMenuArray);

    const [eventImageURL, setEventImageURL] = useState(null);
    const [uploading, setUploading] = useState(false);

    const togglePollsModal = () => {
      setPollsModalVisible(!isPollsModalVisible);
    };

    const toggleAgendaModal = () => {
      setAgendaModalVisible(!isAgendaModalVisible);
    };

    const togglePushNotificationsModal = () => {
      setIsPushNotificationModalVisible(!isPushNotificationModalVisible);
    };

    function addEvent() {
      if(myEventName === ''){
        showEventNameAlert();
        return
      }

      if(myEventLocation === ''){
        showEventLocationAlert();
        return
      }

      if(startDate.getFullYear() === endDate.getFullYear()  
      && startDate.getMonth() + 1 === endDate.getMonth() + 1  
      && startDate.getDate() === endDate.getDate()
      && startDate.getHours() === endDate.getHours()
      && startDate.getMinutes() === endDate.getMinutes()){
        showEventSelectStartDateEndDateAlert();
        return
      }

      if(eventTypeValue === null){
        showEventTypeAlert();
        return
      }

      setEventDetails(
        myEventName,
        myEventLocation,
        startDate,
        endDate,
        eventTypeValue,
        conferenceInstitution,
        conferenceLink,
        showAddEventSuccessMessage,
        props.navigation.goBack
        );
    };

    function updateEvent(imageUrl = '') {
      updateEventDetails(
        myEventName,
        myEventLocation,
        startDate,
        endDate,
        imageUrl,
        props.route.params.eventId,
        areSpeakersAllowed,
        areReviewersAllowed,
        areAuthorsAllowed,
        isPollingAllowed,
        isPollingAllowedForUsers,
        areStatisticsAllowed,
        areStatisticsAllowedForUsers,
        showEventLocation,
        arePostsAllowed,
        areCommentsAllowed,
        allowUsersToChatAmongThemselves,
        allowUsersToChatWithSpeakers,
        allowUsersToChatWithReviewers,
        allowUsersToChatWithAuthors,
        allowUsersToAskQuestions,
        showEventLocationDetails,
        conferenceInstitution,
        conferenceLink,
        showUpdateEventSuccessMessage,
        editEventRetrieved
        );
    };

    const eventId = props.route.params.eventId;

    function setSpeakersEventHandler(){
      setSpeakerOnEvent(
        eventId,
        speakerEmail, 
        speakerFirstName,
        speakerLastName,
        showSpeakerAlreadyExistsAlert)
          setSpeakerEmail('');
          setSpeakerFirstName('');
          setSpeakerLastName('');
    };

    function showSpeakerAlreadyExistsAlert() {
      Alert.alert(
        'Speaker already set',
        'User already set as speaker!',
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

    function setReviewersEventHandler(){
      setReviewersOnConference(
        eventId,
        reviewerEmail, 
        reviewerFirstName,
        reviewerLastName,
        showReviewerAlreadyExistsAlert)
          setReviewerEmail('');
          setReviewerFirstName('');
          setReviewerLastName('');
    };

    function showReviewerAlreadyExistsAlert() {
      Alert.alert(
        'Reviewer already set',
        'User already set as reviewer!',
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

    function setAuthorsEventHandler(){
      setAuthorsOnConference(
        eventId,
        authorEmail, 
        authorFirstName,
        authorLastName,
        showAuthorAlreadyExistsAlert)
          setAuthorEmail('');
          setAuthorFirstName('');
          setAuthorLastName('');
    };

    function showAuthorAlreadyExistsAlert() {
      Alert.alert(
        'Author already set',
        'User already set as author!',
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

    function showEventTypeAlert() {
      Alert.alert(
        'Event type was not selected',
        'Select event type!',
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

    function showEventNameAlert() {
      Alert.alert(
        'Event name was not selected',
        'Select event name!',
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

    function showEventLocationAlert() {
      Alert.alert(
        'Event location was not selected',
        'Select event location!',
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

    function showEventSelectStartDateEndDateAlert() {
      Alert.alert(
        'Event start date and end date have not been selected',
        'Select event start date and end date!',
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

    function setLocationDetailstHandler(){
      setLocationDetailsForEvent(
        locationDetails, 
        cityDetails,
        eventId)
          setLocationDetails('');
          setCityDetails('');
    };

    const showAddEventSuccessMessage = () => {
        showMessage({
        message: "Your event has been created!",
        type: "success",
      });
    };

    const showUpdateEventSuccessMessage = () => {
        showMessage({
        message: "Your event has been updated!",
        type: "success",
      });
    };

    useEffect(() => {
      if(props.route.params.eventId && props.route.params.eventDisplayMode === 'editEvent'){
        getData();
      }
    }, []);
    
    function getData(){
      getEventByEventIdForEdit(editEventRetrieved, props.route.params.eventId)
    };
    
    const showStartDatePicker = () => {
      setStartDatePickerVisibility(true);
    };

    const onConfirmStartDate = (date) => {
      setStartDate(date);
      onCancelStartDate();
    };
    const onCancelStartDate = () => {
      setStartDatePickerVisibility(false);
    };

    const showEndDatePicker = () => {
      setEndDatePickerVisibility(true);
    };

    const showEndDateAlert = () => {
      Alert.alert(
        'Invalid event end date',
        'The end date has to be after start date!',
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

    const showEndDateBeforeCurrentTimeAlert = () => {
      Alert.alert(
        'Invalid event end date',
        'Can not set end date on current time!',
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

    const showEndDateCurrentDateAlert = () => {
      Alert.alert(
        'Invalid event end date',
        'Please select different hours for start date and end date!',
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

    const onConfirmEndDate = (date) => {
      if(date < startDate){
        showEndDateAlert();
        onCancelEndDate();
        return
      } 
      if(date <= new Date() ){
        showEndDateBeforeCurrentTimeAlert();
        onCancelEndDate();
        return
      } 
      if(date.getFullYear() === new Date().getFullYear()  
        && date.getMonth() + 1 === new Date().getMonth() + 1  
        && date.getDate() === new Date().getDate()
        && date.getHours() === new Date().getHours()){
          showEndDateCurrentDateAlert();
          onCancelEndDate();
          return
      }

      setEndDate(date);
      onCancelEndDate();
    };

    const onCancelEndDate = () => {
      setEndDatePickerVisibility(false);
    };

    const getFormattedDate = (fDate) => {
       return fDate.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    };

    function getFormattedJSDateFromFirebaseTimestamp(timestampSeconds, timestampNanoseconds) {
      const timestamp = new Timestamp(timestampSeconds, timestampNanoseconds);

      return timestamp.toDate()
    };

    function editEventRetrieved(returnedEventObject){
      
      const startFormattedDate = getFormattedJSDateFromFirebaseTimestamp(returnedEventObject.eventStartDate.seconds, 
        returnedEventObject.eventStartDate.nanoseconds);
      const endFormattedDate = getFormattedJSDateFromFirebaseTimestamp(returnedEventObject.eventEndDate.seconds, 
        returnedEventObject.eventEndDate.nanoseconds);
      setEventName(returnedEventObject.eventName);
      setEventLocation(returnedEventObject.eventLocation);
      setStartDate(startFormattedDate);
      setEndDate(endFormattedDate);
      setEventImageURL(returnedEventObject.eventImageURL);
      setAreSpeakersAllowed(returnedEventObject.areSpeakersAllowed);
      setAreReviewersAllowed(returnedEventObject.areReviewersAllowed);
      setAreAuthorsAllowed(returnedEventObject.areAuthorsAllowed);
      setIsPollingAllowed(returnedEventObject.isPollingAllowed);
      setIsPollingAllowedForUsers(returnedEventObject.isPollingAllowedForUsers);
      setAreStatisticsAllowed(returnedEventObject.areStatisticsAllowed);
      setAreStatisticsAllowedForUsers(returnedEventObject.areStatisticsAllowedForUsers);
      setShowEventLocation(returnedEventObject.showEventLocation);
      setArePostsAllowed(returnedEventObject.arePostsAllowed);
      setAreCommentsAllowed(returnedEventObject.areCommentsAllowed);
      setAllowUsersToChatAmongThemselves(returnedEventObject.allowUsersToChatAmongThemselves);
      setAllowUsersToChatWithSpeakers(returnedEventObject.allowUsersToChatWithSpeakers);
      setAllowUsersToChatWithReviewers(returnedEventObject.allowUsersToChatWithReviewers);
      setAllowUsersToChatWithAuthors(returnedEventObject.allowUsersToChatWithAuthors);
      setAllowUsersToAskQuestions(returnedEventObject.allowUsersToAskQuestions);
      setShowEventLocationDetails(returnedEventObject.showEventLocationDetails);
      setConferenceInstitution(returnedEventObject.conferenceInstitution);
      setConferenceLink(returnedEventObject.conferenceLink);
    };

    async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (Device.isDevice) {
      if (!result.canceled) {
        setEventImageURL(result.assets[0].uri);
        }
    } else {
      if (!result.canceled) {
        setEventImageURL(result.uri);
      }
    }
  };
  
  async function uploadImage() {
    if(!eventImageURL) {
      updateEvent();
      return;
    }
    const blob = await new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();
        xhr.onload = function() {
        resolve(xhr.response);
        };
        xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', eventImageURL, true);
        xhr.send(null);
    })

    const imageName = 'Image_' + props.route.params.eventId + '_' + utilsService.getRandomNumber();
    const storageRef  = ref(storage, `/EventsBanner/${imageName}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploading(true)
      },
      (error) => {
        setUploading(false)
        console.log(error)
        blob.close()
        return 
      },
      () => {
        
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setUploading(false)
          setEventImageURL(url)
          blob.close()
          updateEvent(url);
        }).catch((error) => {
          console.log(error);
        })
      }
    );
  };

  return (
  <React.Fragment>
    {/* ADD EVENT MODE */}
    {props.route.params.eventDisplayMode === 'addEvent' ?
    <KeyboardAwareScrollView style={styles.addEventContainer}>

      {/* PAGE TITLE - ADD EVENT MODE */}
      <Text style={styles.textTitlePage}>Add Events</Text>

     <View style={styles.addEventInputContainer}>
        <Text style={styles.textInputsTitle}>Event name</Text>
        <TextInput
          placeholder="Event name"
          value={myEventName}
          onChangeText={text => setEventName(text)}
          style={styles.input}
        />

        <Text style={styles.textInputsTitle}>Location</Text>
        <TextInput
          placeholder="Location"
          value={myEventLocation}
          onChangeText={text => setEventLocation(text)}
          style={styles.input}
        />

        {/* PICK START DATE */}
        <Text style={styles.textInputsTitle}>Start date</Text>
        <TouchableOpacity onPress={() => showStartDatePicker()}>
          <View>
            <View pointerEvents="none">
              <TextInput
                placeholder="Start date"
                value={startDate? getFormattedDate(startDate) : ''}
                showSoftInputOnFocus={false}
                style={styles.input}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* PICK END DATE */}
        <Text style={styles.textInputsTitle}>End date</Text>
        <TouchableOpacity onPress={() => showEndDatePicker()}>
          <View>
            <View pointerEvents="none">
              <TextInput
                placeholder="End date"
                value={endDate? getFormattedDate(endDate) : ''}
                showSoftInputOnFocus={false}
                style={styles.input}
              />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.dropDownPicker}>
        <Text style={styles.textInputsTitle}>Event type</Text>
          <DropDownPicker
            open={open}
            value={eventTypeValue}
            items={items}
            setOpen={setOpen}
            setValue={setEventTypeValue}
            setItems={setItems}
            placeholder="Select event type"
          /> 
        </View>

        { eventTypeValue === 'conference' ?
        <View>
          <Text style={styles.textInputsTitle}>Institution</Text>
          <TextInput
            placeholder="Institution"
            value={conferenceInstitution}
            onChangeText={text => setConferenceInstitution(text)}
            style={styles.input}
          />

          <Text style={styles.textInputsTitle}>Conference link</Text>
          <TextInput
            placeholder="Conference link"
            value={conferenceLink}
            onChangeText={text => setConferenceLink(text)}
            style={styles.input}
          />
        </View>
        : null
        }
        

        {/* DATE PICKER - START DATE */}
        <DateTimePicker 
          isVisible={isStartDatePickerVisible}
          mode={'datetime'}
          currentDate={startDate}
          onConfirm={onConfirmStartDate}
          onCancel={onCancelStartDate}
          is24Hour={true}
        />

        {/* DATE PICKER - END DATE */}
        <DateTimePicker
          isVisible={isEndDatePickerVisible}
          mode={'datetime'}
          currentDate={endDate}
          onConfirm={onConfirmEndDate}
          onCancel={onCancelEndDate}
          is24Hour={true}
        />
      </View>


      {/* ADD EVENT BUTTON - ADD EVENT MODE */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress = {addEvent}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Add event</Text>
          </TouchableOpacity>
        </View>

        <FlashMessage
          position={"top"}
        />
    </KeyboardAwareScrollView>
  :

  // EDIT EVENT MODE
    <KeyboardAwareScrollView
      style={styles.container}
      behavior="padding"
    > 
      {/* PAGE TITLE - EDIT EVENT MODE */}
      <Text style={styles.textTitlePage}>Edit events</Text>

      {/* TEXT INPUTS FOR EVENT DETAILS */}
      <View style={styles.editEventInputContainer}>
        <Text style={styles.textInputsTitle}>Event name</Text>
        <TextInput
          placeholder="Event name"
          value={myEventName}
          onChangeText={text => setEventName(text)}
          style={styles.input}
        />

        <Text style={styles.textInputsTitle}>Location</Text>
        <TextInput
          placeholder="Location"
          value={myEventLocation}
          onChangeText={text => setEventLocation(text)}
          style={styles.input}
        />

        {/* PICK START DATE */}
        <Text style={styles.textInputsTitle}>Start date</Text>
        <TouchableOpacity onPress={() => showStartDatePicker()}>
          <View>
            <View pointerEvents="none">
              <TextInput
                placeholder="Start date"
                value={startDate? getFormattedDate(startDate) : ''}
                showSoftInputOnFocus={false}
                style={styles.input}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* PICK END DATE */}
        <Text style={styles.textInputsTitle}>End date</Text>
        <TouchableOpacity onPress={() => showEndDatePicker()}>
          <View>
            <View pointerEvents="none">
              <TextInput
                placeholder="End date"
                value={endDate? getFormattedDate(endDate) : ''}
                showSoftInputOnFocus={false}
                style={styles.input}
              />
            </View>
          </View>
        </TouchableOpacity>
        { props.route.params.eventExtraSettings.eventType === 'conference' ?
        <View>
          <Text style={styles.textInputsTitle}>Institution</Text>
          <TextInput
            placeholder="Institution"
            value={conferenceInstitution}
            onChangeText={text => setConferenceInstitution(text)}
            style={styles.input}
          />

          <Text style={styles.textInputsTitle}>Conference link</Text>
          <TextInput
            placeholder="Conference link"
            value={conferenceLink}
            onChangeText={text => setConferenceLink(text)}
            style={styles.input}
          />
        </View>
        : null }
      </View>

      <View style={styles.imageContainer}>
        {eventImageURL ?
          <View style={styles.image}>
            <TouchableOpacity
            onPress = {pickImage}
            >
              {eventImageURL && <Image source={{uri: eventImageURL}} style={{width: 280 , height: 150}}/>}
            </TouchableOpacity>
          </View>
        : 
          <View style={styles.image}>
            <TouchableOpacity
            onPress = {pickImage}
            >
              {<Image source={require('../img/uploadImage.jpg')} style={{width: 280 , height: 150}}/>}
            </TouchableOpacity>
          </View>
        }
      </View> 

      <View style={styles.sendPushNotificationContainer}>
        <TouchableOpacity 
        onPress = {() => {togglePushNotificationsModal()}}
        style={styles.sendPushNotificationButton}
        >
          <View style={styles.centerTextIconOnButton}>
            <SendPushNotificationsIcon name="notifications" size={30} color="white" />
            <Text style={styles.sendPushNotificationButtonText}>Send reminder</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* CHECKBOXES FOR EDIT SCREEN ONLY*/}
      <View style={styles.checkboxButtonsContainer}>
        
         {/* CREATE AGENDA */}
         <View style={styles.checkboxButtonBorder}>
            <View style={styles.checkboxButton}>
                  <Text style={styles.checkboxButtonText}>Create agenda on event</Text>
            </View>

            {/* CREATE AGENDA BUTTON - OPEN MODAL */}
                <View style={styles.alignButton}>
                  <TouchableOpacity
                      onPress = {() => {toggleAgendaModal()}}
                      style={styles.createPollButton}
                    > 
                      <View style={styles.centerTextIconOnButton}>
                        <AgendaIcon name="view-agenda" size={30} color="white" />
                        <Text style={styles.createPollButtonText}>Create agenda</Text>
                      </View>
                  </TouchableOpacity>
                </View>
          </View>

        {/* SPEAKERS CHECKBOXES CATEGORY */}
        { props.route.params.eventExtraSettings.eventType === 'conference' || props.route.params.eventExtraSettings.eventType === 'publicEvent' ?
        <View style={[styles.checkboxButtonBorder]}>
          <View >
            <TouchableOpacity 
            style={styles.checkboxButton}
            onPress = {() => {
              if(areSpeakersAllowed === true){
                setAllowUsersToAskQuestions(false);
                setAllowUsersToChatWithSpeakers(false);
              }
              setAreSpeakersAllowed(!areSpeakersAllowed)
            
            }}>
              <Checkbox
                style={styles.checkbox}
                value={areSpeakersAllowed}
                onValueChange={() => {
                  if(areSpeakersAllowed === true){
                    setAllowUsersToAskQuestions(false);
                    setAllowUsersToChatWithSpeakers(false);
                  }
                  setAreSpeakersAllowed(!areSpeakersAllowed)
                }}
                color={areSpeakersAllowed ? '#0782F9' : undefined}
              />
              <Text style={styles.checkboxButtonText}>Allow speakers on event</Text>
            </TouchableOpacity>

        {/* INVITE SPEAKER CHECKBOX*/}
        { areSpeakersAllowed ?
          <View>
            <View style={styles.inputSpeakersContainer}>
              <Text style={styles.textInputsTitleSRA}>Invite speaker on event</Text>
                <View style={styles.speakersContainer}>
                <TextInput
                  placeholder="Speaker first name"
                  value={speakerFirstName}
                  onChangeText={text => setSpeakerFirstName(text)}
                  style={styles.inputSpeakers}
                />
                <TextInput
                  placeholder="Speaker last name"
                  value={speakerLastName}
                  onChangeText={text => setSpeakerLastName(text)}
                  style={styles.inputSpeakers}
                />
                <TextInput
                  placeholder="Speaker email"
                  value={speakerEmail}
                  onChangeText={text => setSpeakerEmail(text)}
                  style={styles.inputSpeakers}
                />
                <TouchableOpacity
                  onPress = {() => {setSpeakersEventHandler()}}
                  style={styles.inviteButton}
                >
                  <View style={styles.centerTextIconOnButton}>
                    <InviteIcon name="person-add" size={25} color="white" />
                    <Text style={styles.inviteButtonText}>Invite</Text>
                  </View>
              </TouchableOpacity>
              </View>
            </View>

            {/* USERS CHAT WITH SPEAKERS CHECKBOX*/}
            <View>
              <TouchableOpacity 
              style={styles.checkboxButton}
              onPress = {() => setAllowUsersToChatWithSpeakers(!allowUsersToChatWithSpeakers)}>
                <Checkbox
                  style={styles.checkbox}
                  value={allowUsersToChatWithSpeakers}
                  onValueChange={() => setAllowUsersToChatWithSpeakers(!allowUsersToChatWithSpeakers)}
                  color={allowUsersToChatWithSpeakers ? '#0782F9' : undefined}
                />
                <Text style={styles.checkboxButtonText}>Allow users to chat with speakers</Text>
              </TouchableOpacity>
            </View>

            {/* USERS ASK QUESTIONS CHECKBOX*/}
            <View >
              <TouchableOpacity 
                style={styles.checkboxButton}
                onPress = {() => setAllowUsersToAskQuestions(!allowUsersToAskQuestions)}>
                <Checkbox
                  style={styles.checkbox}
                  value={allowUsersToAskQuestions}
                  onValueChange={() => setAllowUsersToAskQuestions(!allowUsersToAskQuestions)}
                  color={allowUsersToAskQuestions ? '#0782F9' : undefined}
                />
                <Text style={styles.checkboxButtonText}>Allow users to ask questions</Text>
              </TouchableOpacity>
            </View>
          </View>
          : 
          null
        }
          </View>
        </View>
        : null
      }

        {/* REVIEWERS CHECKBOXES CATEGORY */}
        { props.route.params.eventExtraSettings.eventType === 'conference' ?
        <View style={[styles.checkboxButtonBorder]}>
          <View>
            <TouchableOpacity 
              style={styles.checkboxButton}
              onPress = {() => {
                if(areReviewersAllowed === true){
                  setAllowUsersToChatWithReviewers(false);
                }
                setAreReviewersAllowed(!areReviewersAllowed)
              }}>
              <Checkbox
                  style={styles.checkbox}
                  value={areReviewersAllowed}
                  onValueChange={() => {
                    if(areReviewersAllowed === true){
                      setAllowUsersToChatWithReviewers(false);
                    }
                    setAreReviewersAllowed(!areReviewersAllowed)
                  }}
                  color={areReviewersAllowed ? '#0782F9' : undefined}
                />
              <Text style={styles.checkboxButtonText}>Allow reviewers on event</Text>
            </TouchableOpacity>
            

        {/* INVITE REVIEWER CHECKBOX*/}
        { areReviewersAllowed && props.route.params.eventExtraSettings.eventType === 'conference' ?
          <View>
            <View style={styles.inputSpeakersContainer}>
              <Text style={styles.textInputsTitleSRA}>Invite reviewer on event</Text>
                <View style={styles.speakersContainer}>
                <TextInput
                  placeholder="Reviewer first name"
                  value={reviewerFirstName}
                  onChangeText={text => setReviewerFirstName(text)}
                  style={styles.inputSpeakers}
                />
                <TextInput
                  placeholder="Reviewer last name"
                  value={reviewerLastName}
                  onChangeText={text => setReviewerLastName(text)}
                  style={styles.inputSpeakers}
                />
                <TextInput
                  placeholder="Reviewer email"
                  value={reviewerEmail}
                  onChangeText={text => setReviewerEmail(text)}
                  style={styles.inputSpeakers}
                />
                <TouchableOpacity
                  onPress = {() => {setReviewersEventHandler()}}
                  style={styles.inviteButton}
                >
                  <View style={styles.centerTextIconOnButton}>
                    <InviteIcon name="person-add" size={25} color="white" />
                    <Text style={styles.inviteButtonText}>Invite</Text>
                  </View>
              </TouchableOpacity>
              </View>
            </View>

            {/* USERS CHAT WITH REVIEWERS CHECKBOX*/}
            <View>
              <TouchableOpacity 
                style={styles.checkboxButton}
                onPress = {() => setAllowUsersToChatWithReviewers(!allowUsersToChatWithReviewers)}>
                <Checkbox
                  style={styles.checkbox}
                  value={allowUsersToChatWithReviewers}
                  onValueChange={() => setAllowUsersToChatWithReviewers(!allowUsersToChatWithReviewers)}
                  color={allowUsersToChatWithReviewers ? '#0782F9' : undefined}
                />
                <Text style={styles.checkboxButtonText}>Allow users to chat with reviewers</Text>
              </TouchableOpacity>
            </View>
          </View>
          : null
        }
          </View>
        </View>
        : null
      }

        {/* AUTHORS CHECKBOXES CATEGORY */}
        { props.route.params.eventExtraSettings.eventType === 'conference' ?
        <View style={[styles.checkboxButtonBorder]}>
          <View>
            <TouchableOpacity 
              style={styles.checkboxButton}
              onPress = {() => { 
                if(areAuthorsAllowed === true){
                setAllowUsersToChatWithAuthors(false);
                }
                setAreAuthorsAllowed(!areAuthorsAllowed)
              }}>
              <Checkbox
                style={styles.checkbox}
                value={areAuthorsAllowed}
                onValueChange={() => {
                  if(areAuthorsAllowed === true){
                    setAllowUsersToChatWithAuthors(false);
                  }
                  setAreAuthorsAllowed(!areAuthorsAllowed)
                }}
                color={areAuthorsAllowed ? '#0782F9' : undefined}
              />
            <Text style={styles.checkboxButtonText}>Allow authors on event</Text>
          </TouchableOpacity>
           
        {/* INVITE AUTHOR CHECKBOX*/}
        { areAuthorsAllowed && props.route.params.eventExtraSettings.eventType === 'conference' ?
          <View>
            <View style={styles.inputSpeakersContainer}>
              <Text style={styles.textInputsTitleSRA}>Invite author on event</Text>
                <View style={styles.speakersContainer}>
                <TextInput
                  placeholder="Author first name"
                  value={authorFirstName}
                  onChangeText={text => setAuthorFirstName(text)}
                  style={styles.inputSpeakers}
                />
                <TextInput
                  placeholder="Author last name"
                  value={authorLastName}
                  onChangeText={text => setAuthorLastName(text)}
                  style={styles.inputSpeakers}
                />
                <TextInput
                  placeholder="Author email"
                  value={authorEmail}
                  onChangeText={text => setAuthorEmail(text)}
                  style={styles.inputSpeakers}
                />
                <TouchableOpacity
                  onPress = {() => {setAuthorsEventHandler()}}
                  style={styles.inviteButton}
                >
                  <View style={styles.centerTextIconOnButton}>
                    <InviteIcon name="person-add" size={25} color="white" />
                    <Text style={styles.inviteButtonText}>Invite</Text>
                  </View>
              </TouchableOpacity>
              </View>
            </View>

            {/* USERS CHAT WITH AUTHORS CHECKBOX*/}
            <View>
              <TouchableOpacity 
                style={styles.checkboxButton}
                onPress = {() => setAllowUsersToChatWithAuthors(!allowUsersToChatWithAuthors)}>
                <Checkbox
                  style={styles.checkbox}
                  value={allowUsersToChatWithAuthors}
                  onValueChange={() => setAllowUsersToChatWithAuthors(!allowUsersToChatWithAuthors)}
                  color={allowUsersToChatWithAuthors ? '#0782F9' : undefined}
                />
                <Text style={styles.checkboxButtonText}>Allow users to chat with authors</Text>
              </TouchableOpacity>
            </View>
          </View>
          : null
        }
          </View>
        </View>
        : null
      }

          {/* POLLS CHECKBOXES CATEGORY */}
          { props.route.params.eventExtraSettings.eventType !== 'conference' ?
          <View style={[styles.checkboxButtonBorder]}>
            <View>
              <TouchableOpacity 
                style={styles.checkboxButton}
                onPress = {() => {
                  if(isPollingAllowed === true){
                    setAreStatisticsAllowed(false);
                    setIsPollingAllowedForUsers(false);
                    setAreStatisticsAllowedForUsers(false);
                  }
                  setIsPollingAllowed(!isPollingAllowed)
                }}>
                <Checkbox
                  style={styles.checkbox}
                  value={isPollingAllowed}
                  onValueChange={() => {
                    if(isPollingAllowed === true){
                      setAreStatisticsAllowed(false);
                      setIsPollingAllowedForUsers(false);
                      setAreStatisticsAllowedForUsers(false);
                    }
                    setIsPollingAllowed(!isPollingAllowed)
                  }}
                  color={isPollingAllowed ? '#0782F9' : undefined}
                />
                <Text style={styles.checkboxButtonText}>Allow polls on event</Text>
              </TouchableOpacity>
            </View>

            {/* CREATE POLL BUTTON - OPEN MODAL */}
            { isPollingAllowed ?
            <View>
              <View style={styles.alignButton}>
                <TouchableOpacity
                    onPress = {() => {togglePollsModal()}}
                    style={styles.createPollButton}
                  >
                    <View style={styles.centerTextIconOnButton}>
                      <PollIcon name="poll" size={30} color="white" />
                      <Text style={styles.createPollButtonText}>Create poll</Text>
                    </View>
                </TouchableOpacity>
              </View>

             {/* STATISTICS FOR POLLS BY ADMIN CHECKBOX*/}
             <View>
              <TouchableOpacity 
                  style={styles.checkboxButton}
                  onPress = {() => setAreStatisticsAllowed(!areStatisticsAllowed)}>
                  <Checkbox
                    style={styles.checkbox}
                    value={areStatisticsAllowed}
                    onValueChange={() => setAreStatisticsAllowed(!areStatisticsAllowed)}
                    color={areStatisticsAllowed ? '#0782F9' : undefined}
                  />
                  <Text style={styles.checkboxButtonText}>Allow statistics on event</Text>
              </TouchableOpacity>
            </View>

              {/* USERS CREATE POLLS RADIO BUTTTON*/}
              <View>
                <TouchableOpacity 
                  style={styles.checkboxButton}
                  onPress = {() => setIsPollingAllowedForUsers(!isPollingAllowedForUsers)}>
                  <Checkbox
                    style={styles.checkbox}
                    value={isPollingAllowedForUsers}
                    onValueChange={() => setIsPollingAllowedForUsers(!isPollingAllowedForUsers)}
                    color={isPollingAllowedForUsers ? '#0782F9' : undefined}
                  />
                  <Text style={styles.checkboxButtonText}>Allow users to create polls on event</Text>
                </TouchableOpacity>
              </View>

              {/* STATISTICS FOR POLLS BY USERS CHECKBOX*/}
              <View>
                <TouchableOpacity 
                  style={styles.checkboxButton}
                  onPress = {() => setAreStatisticsAllowedForUsers(!areStatisticsAllowedForUsers)}>
                  <Checkbox
                    style={styles.checkbox}
                    value={areStatisticsAllowedForUsers}
                    onValueChange={() => setAreStatisticsAllowedForUsers(!areStatisticsAllowedForUsers)}
                    color={areStatisticsAllowedForUsers ? '#0782F9' : undefined}
                  />
                  <Text style={styles.checkboxButtonText}>Allow users to see polls statistics</Text>
                </TouchableOpacity>
              </View>
            </View>
            :null 
            }
          </View>
          :null
        }

        {/* EVENT LOCATION CHECKBOX */}
        <View style={styles.checkboxButtonBorder}>
          <View>
            <TouchableOpacity 
              style={styles.checkboxButton}
              onPress = {() => {
                if(showEventLocation === true){
                  setShowEventLocationDetails(false);
                }
                setShowEventLocation(!showEventLocation)
              }}>
                <Checkbox
                  style={styles.checkbox}
                  value={showEventLocation}
                  onValueChange={() => {
                    if(showEventLocation === true){
                      setShowEventLocationDetails(false);
                    }
                    setShowEventLocation(!showEventLocation)
                  }}
                  color={showEventLocation ? '#0782F9' : undefined}
                />
                <Text style={styles.checkboxButtonText}>Show event location</Text>
            </TouchableOpacity>
          </View>

          { showEventLocation ?
          <View>
            <View style={styles.alignButton}>
              <TouchableOpacity
                  onPress = {() => {props.navigation.navigate("Set Location", {eventId: eventId})}}
                  style={styles.createPollButton}
                >
                  <View style={styles.centerTextIconOnButton}>
                      <LocationIcon name="location-on" size={30} color="white" />
                    <Text style={styles.createPollButtonText}>Set location</Text>
                  </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.checkboxButton}
              onPress = {() => setShowEventLocationDetails(!showEventLocationDetails)}>  
              <Checkbox
                style={styles.checkbox}
                value={showEventLocationDetails}
                onValueChange={() => setShowEventLocationDetails(!showEventLocationDetails)}
                color={showEventLocationDetails ? '#0782F9' : undefined}
              />
              <Text style={styles.checkboxButtonText}>Show event location and city details</Text>
            </TouchableOpacity>

            {showEventLocationDetails ?
              <View style={styles.inputSpeakersContainer}>
                <Text style={styles.textInputsTitleSRA}>Details about location and city</Text>
                  <View style={styles.speakersContainer}>
                  <TextInput
                    placeholder="Details About Location"
                    value={locationDetails}
                    onChangeText={text => setLocationDetails(text)}
                    maxLength={100}
                    style={styles.inputLocation}
                  />
                  <TextInput
                    placeholder="Details About The City"
                    value={cityDetails}
                    onChangeText={text => setCityDetails(text)}
                    maxLength={100}
                    style={styles.inputLocation}
                  />
                  <TouchableOpacity
                    onPress = {() => {setLocationDetailstHandler()}}
                    style={styles.saveButton}
                  >
                    <View style={styles.centerTextIconOnButton}>
                      <AddEventIcon name="add" size={30} color="white" />
                      <Text style={styles.inviteButtonText}>Save details</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            : 
              null 
            }
          </View>
          : null 
          }
        </View>

        {/* POSTS CHECKBOX CATEGORY */}
        {props.route.params.eventExtraSettings.eventType !== 'conference' ?
          <View style={styles.checkboxButtonBorder}>
          <View>
            <TouchableOpacity 
              style={styles.checkboxButton}
              onPress = {() => {
                if(arePostsAllowed === true){
                  setAreCommentsAllowed(false);
                }
                setArePostsAllowed(!arePostsAllowed)
              }}>
              <Checkbox
                style={styles.checkbox}
                value={arePostsAllowed}
                onValueChange={() => {
                  if(arePostsAllowed === true){
                    setAreCommentsAllowed(false);
                  }
                  setArePostsAllowed(!arePostsAllowed)
                }}
                color={arePostsAllowed ? '#0782F9' : undefined}
              />
              <Text style={styles.checkboxButtonText}>Allow posts on event</Text>
            </TouchableOpacity>
          </View>
        
        {/* COMMENTS CHECKBOX */}
          { arePostsAllowed && props.route.params.eventExtraSettings.eventType !== 'conference' ?
            <View>
              <View>
                <TouchableOpacity 
                style={styles.checkboxButton}
                onPress = {() => setAreCommentsAllowed(!areCommentsAllowed)}>
                  <Checkbox
                    style={styles.checkbox}
                    value={areCommentsAllowed}
                    onValueChange={() => setAreCommentsAllowed(!areCommentsAllowed)}
                    color={areCommentsAllowed ? '#0782F9' : undefined}
                  />
                  <Text style={styles.checkboxButtonText}>Allow comments on event</Text>
                </TouchableOpacity>
              </View>
            </View>
            :null
          }
        </View>
        :null
        }

        {/* USERS CHAT AMONG THEMSELVES CHECKBOX*/}
        <View >
          <View>
          <TouchableOpacity 
            style={styles.checkboxButton}
            onPress = {() => setAllowUsersToChatAmongThemselves(!allowUsersToChatAmongThemselves)}>
              <Checkbox
                style={styles.checkbox}
                value={allowUsersToChatAmongThemselves}
                onValueChange={() => setAllowUsersToChatAmongThemselves(!allowUsersToChatAmongThemselves)}
                color={allowUsersToChatAmongThemselves ? '#0782F9' : undefined}
              />
              <Text style={styles.checkboxButtonText}>Allow users to chat</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>


      {/* UPDATE BUTTON - EDIT EVENT MODE */}
        <View style={styles.buttonContainer}>
        <TouchableOpacity
            onPress = {uploadImage}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>

      {/* DATE PICKER - START DATE */}
      <DateTimePicker 
        isVisible={isStartDatePickerVisible}
        mode={'datetime'}
        currentDate={startDate}
        onConfirm={onConfirmStartDate}
        onCancel={onCancelStartDate}
        is24Hour={true}
      />

      {/* DATE PICKER - END DATE */}
      <DateTimePicker
        isVisible={isEndDatePickerVisible}
        mode={'datetime'}
        currentDate={endDate}
        onConfirm={onConfirmEndDate}
        onCancel={onCancelEndDate}
        is24Hour={true}
      />

      {/* POLLS MODAL  */}
      { isPollingAllowed ?
      <Modal isVisible={isPollsModalVisible}
      avoidKeyboard={false}
      animationInTiming={500}
      animationOutTiming={1000}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={1000}
      style={{
        justifyContent: 'flex',
        margin: 20,
        position:'absolute',
        width: '90%',
        height:'95%'
      }}
      >
        <View style={styles.container}>
          <CreatePollsComponent
          eventId={props.route.params.eventId}
          togglePollsModalHandler={togglePollsModal}
          />
        </View>
      </Modal>
      : null
      }

      {/* AGENDA MODAL  */}
      <Modal isVisible={isAgendaModalVisible}
      avoidKeyboard={false}
      animationInTiming={500}
      animationOutTiming={1000}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={1000}
      style={{
        justifyContent: 'flex',
        margin: 20,
        position:'absolute',
        width: '90%',
        height:'95%'
      }}
      >
        <View style={styles.container}>
          <CreateAgendaComponent
          eventId={props.route.params.eventId}
          toggleAgendaModalHandler={toggleAgendaModal}
          />
        </View>
      </Modal>

      <Modal isVisible={isPushNotificationModalVisible}
      >
        <View style={styles.container}>
          <SendPushNotificationsComponent
          eventId={props.route.params.eventId}
          togglePushNotificationsModalHandler={togglePushNotificationsModal}
          navigationObj={props.navigation}
          />
        </View>
      </Modal>

      <FlashMessage
      position={"bottom"}
      />
      
    </KeyboardAwareScrollView>
    }
    </React.Fragment>
  )
}

export default EventScreen

const styles = StyleSheet.create({
  textTitlePage: {
    fontSize: 23,
    fontWeight: "700",
    paddingLeft: 130,
    marginTop: 5,
  },
  addEventContainer: {
    flex: 1,
    backgroundColor: '#89cff0',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#89cff0',
    flexBasis: 'auto',
  },
  textInputsTitle: {
    fontSize: 17,
    fontWeight: "600",
    paddingLeft: 3,
    marginTop: 5,
  },
  textInputsTitleSRA: {
    fontSize: 17,
    fontWeight: "600",
    paddingLeft: 3,
    marginTop: 5,
    marginBottom: 5,
    alignSelf: 'center',
  },
  addEventInputContainer: {
    width: '95%',
    margin: 5,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingBottom: 30,
  },
  editEventInputContainer: {
    width: '100%',
    margin: 5,
    paddingLeft: 10,
    paddingRight: 23,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 18,
  },
  inputSpeakersContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputSpeakers: {
    backgroundColor: 'white',
    width: '75%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 17,
  },
  inputLocation: {
    backgroundColor: 'white',
    width: '75%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 17,
    height: 60,
  },
  imageContainer: {
    marginTop: 10,
    backgroundColor: '#89cff0',
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    margin: 5,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendPushNotificationButton: {
    backgroundColor: '#0782F9',
    width: '50%',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
    flexBasis: 'auto',
  },
  sendPushNotificationButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17,
  },
  sendPushNotificationContainer: {
    flexDirection: 'row', 
    flexWrap:'wrap',
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
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
  checkboxButtonsContainer: {
    margin:5,
  },
  checkboxButton: {
    flexDirection: 'row', 
    flexWrap:'wrap',
    padding: 5,
    marginLeft:5,
    marginTop:3,
  },
  checkboxButtonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#0782F9',
    width: '40%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  inviteButton: {
    backgroundColor: '#0782F9',
    width: '25%',
    padding: 3,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17,
  },
  speakersContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 15,
  },
  createPollButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17,
  },
  checkboxButtonBorder:{
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginTop: 5,
  },
  dropDownPicker: {
    marginTop: 5,
  },
  checkbox: {
    margin: 8,
  },
  centerTextIconOnButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})