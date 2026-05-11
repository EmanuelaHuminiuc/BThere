import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import React, {useEffect, useRef, useState} from 'react';
import * as Notifications from 'expo-notifications';
import PushNotificationService from '../PushNotificationsService/PushNotificationsService';
import DashboardScreen from '../Dashboard/DashboardScreen';
import EventScreen from '../Event/EventScreen';
import MyProfileScreen from '../MyProfile/MyProfileScreen';
import MyEventsScreen from '../Events/MyEventsScreen';
import RegisterScreen from '../Register/RegisterScreen';
import LoginScreen from '../Login/LoginScreen';
import BottomTabComponent from './BottomTabComponent';
import LocationScreen from "../Location/LocationScreen";
import DisplayEventsComponent from "../Events/DisplayEventsComponent";
import AddCommentsComponent from "../Posts/AddCommentsComponent";
import AvailableEventsScreen from "../Events/AvailableEventsScreen";
import UsersEvent from "../Events/UsersEvent";
import SpeakersEvent from "../Events/SpeakersEvent";
import SendInvites from "../Events/SendInvites";
import DisplayPollComponent from "../Polls/DisplayPollComponent";
import DisplayPollsComponent from "../Polls/DisplayPollsComponent";
import CreatePollsComponent from "../Polls/CreatePollsComponent";
import PollStatisticsComponent from "../Polls/PollStatisticsComponent";
import AskedQuestionsForSpeakers from "../Events/AskedQuestionsForSpeakers";
import AnswerQuestions from "../Events/AnswerQuestions";
import ReviewersConference from "../Events/ReviewersConference";
import AuthorsConference from "../Events/AuthorsConference";
import AgendaScreen from "../Agenda/AgendaScreen";
import CreateAgendaComponent from "../Agenda/CreateAgendaComponent";
import AuthorUploadsPapers from "../Events/AuthorUploadsPapers";
import ReviewPaper from "../Events/ReviewPaper";
import ReviewsDisplayComponent from "../Events/ReviewsDisplayComponent";
import Notes from "../Events/Notes";
import Chat from "../Events/Chat";
import SendPushNotificationsComponent from "../PushNotificationsService/SendPushNotificationsComponent";
import CreateLocationComponent from "../Location/CreateLocationComponent";
import Statistics from "../Events/Statistics";
import SpeakerEditsAgendaItem from "../Agenda/SpeakerEditsAgendaItem";
import SendMail from "../Mails/SendMail";
import AnswerMails from "../Mails/AnswerMails";
import DisplayMailsComponent from "../Mails/DisplayMailsComponent";
import Papers from "../Events/Papers";

const Stack = createNativeStackNavigator();

const createContainer = () => {

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
      if(notification.request.content.data?.type === 'uploadDocument' || notification.request.content.data?.type === 'updateDocument') {
        for (let i = 3, j=1; i >= 1; i--, j++) {
          let title, description;
          if(notification.request.content.data?.type === 'uploadDocument') {
            title = "Paper to review";
            description = "You have " + i + " days left to review the paper: " + notification.request.content.data?.paperTitle;
          } else if (notification.request.content.data?.type === 'updateDocument') {
            title = "Paper to update";
            description = "You have " + i + " days left to update the paper: " + notification.request.content.data?.paperTitle;
          }
          PushNotificationService.schedulePushNotification(title, description, j);
        }
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.cancelAllScheduledNotificationsAsync();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
  }),
  {/* END OF PUSH NOTIFICATIONS CODE  */}

    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name="Dashboard" component={DashboardScreen}  />
            <Stack.Screen name="EventScreen" component={EventScreen} />
            <Stack.Screen name="AvailableEvents" component={AvailableEventsScreen} />
            <Stack.Screen name="MyEvents" component={MyEventsScreen} />
            <Stack.Screen name="Timeline" component={BottomTabComponent} />
            <Stack.Screen name="AddCommentsComponent" component={AddCommentsComponent} />
            <Stack.Screen name="MyProfile" component={MyProfileScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Location" component={LocationScreen} />
            <Stack.Screen name="DisplayEvents" component={DisplayEventsComponent} />
            <Stack.Screen name="UsersEvent" component={UsersEvent} />
            <Stack.Screen name="Speakers" component={SpeakersEvent} />
            <Stack.Screen name="Send Invites" component={SendInvites} />
            <Stack.Screen name="DisplayPollComponent" component={DisplayPollComponent} />
            <Stack.Screen name="DisplayPollsComponent" component={DisplayPollsComponent} />
            <Stack.Screen name="CreatePollsComponent" component={CreatePollsComponent} />
            <Stack.Screen name="PollStatisticsComponent" component={PollStatisticsComponent} />
            <Stack.Screen name="AskedQuestionsForSpeakers" component={AskedQuestionsForSpeakers} />
            <Stack.Screen name="AnswerQuestions" component={AnswerQuestions} />
            <Stack.Screen name="Reviewers" component={ReviewersConference} />
            <Stack.Screen name="Authors" component={AuthorsConference} />
            <Stack.Screen name="AgendaScreen" component={AgendaScreen} />
            <Stack.Screen name="CreateAgendaComponent" component={CreateAgendaComponent} />
            <Stack.Screen name="AuthorUploadsPapers" component={AuthorUploadsPapers} />
            <Stack.Screen name="ReviewPaper" component={ReviewPaper} />
            <Stack.Screen name="ReviewsDisplayComponent" component={ReviewsDisplayComponent} />
            <Stack.Screen name="Notes" component={Notes} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="SendPushNotificationsComponent" component={SendPushNotificationsComponent} />
            <Stack.Screen name="Set Location" component={CreateLocationComponent} />
            <Stack.Screen name="Statistics" component={Statistics} />
            <Stack.Screen name="SpeakerEditsAgendaItem" component={SpeakerEditsAgendaItem} />
            <Stack.Screen name="SendMail" component={SendMail} />
            <Stack.Screen name="AnswerMails" component={AnswerMails} />
            <Stack.Screen name="DisplayMailsComponent" component={DisplayMailsComponent} />
            <Stack.Screen name="Papers" component={Papers} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

const StackNavigator = createNativeStackNavigator();

export default createContainer;