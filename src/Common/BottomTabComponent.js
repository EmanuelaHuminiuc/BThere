import { StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TimelineScreen from '../Timeline/TimelineScreen';
import MyProfileScreen from '../MyProfile/MyProfileScreen';
import UsersEvent from '../Events/UsersEvent';
import AgendaScreen from '../Agenda/AgendaScreen';
import AgendaIcon from 'react-native-vector-icons/FontAwesome5';
import TimelineIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import UsersIcon from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

const BottomTabComponent = (props) => {
  console.log('props');
  console.log(props);

  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen 
          name="TimelineScreen" 
          component={TimelineScreen} 
          options={{
            tabBarLabel: 'Timeline',
            tabBarIcon: ({ color, size }) => (
              <TimelineIcon name="timeline" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen 
          name="Agenda" 
          options={{
            tabBarLabel: 'Agenda',
            tabBarIcon: ({ color, size }) => (
              <AgendaIcon name="calendar" color={color} size={size} />
            ),
          }}
          children={()=><AgendaScreen
            eventId={props.route.params.params.selectedEventId}
            navigationObj={props.navigation}
            />}
        />

        <Tab.Screen 
          name="Users" 
          options={{
            tabBarLabel: 'Users',
            tabBarIcon: ({ color, size }) => (
              <UsersIcon name="users" color={color} size={size} />
            ),
          }}
          children={()=><UsersEvent 
            eventId={props.route.params.params.selectedEventId}
            eventType={props.route.params.params.selectedEventExtraSettings.eventType}
            navigationObj={props.navigation}
          />}
        
        />

        <Tab.Screen 
          name="Profile" 
          component={MyProfileScreen} 
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <UsersIcon name="user-alt" color={color} size={size} />
            ),
      }}
        />
    </Tab.Navigator>    
  )
}

export default BottomTabComponent

const styles = StyleSheet.create({})