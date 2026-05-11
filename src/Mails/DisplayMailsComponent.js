import {StyleSheet, TouchableOpacity, Text, View, FlatList, Image } from 'react-native';
import React, {useEffect, useState} from 'react';
import { auth } from '../../firebase/firebase-config';
import { getEmailsByUserIdForReceiver } from '../../firebase/dbGetFunctions';

const DisplayMailsComponent = (props) => {
  
    const [emailsList, setEmailsList] = useState();
    const user = auth.currentUser;
    const uid = user.uid; 

    useEffect(() => {
      getData();
    }, [])

    function getData(){
      getEmailsByUserIdForReceiver(emailsRetrieved, props.route.params.eventId);
        props.navigation.addListener(
            'focus',
            payload => {
              getEmailsByUserIdForReceiver(emailsRetrieved, props.route.params.eventId);
            }
        )
    };
    
    function emailsRetrieved(emailsList){
        setEmailsList(emailsList);
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

    //FLAT LIST ITEM
    const EmailsItem = ({emailSubject, email, answer, currentEmailId, userFirstName, userLastName,  userImageURL, date, eventId
    }) => (
        <View style={styles.containerEvents}>
          <TouchableOpacity activeOpacity={0.9} style={styles.item} onPress={() => {
              const showEmail = {
                  currentEventId: eventId,
                  currentEmailSubject: emailSubject,
                  currentEmail: email,
                  currentAnswer: answer,
                  currentEmailId: currentEmailId,
                  currentUserFirstName: userFirstName,
                  currentUserLastName: userLastName,
                  currentUserImageURL: userImageURL,
                  currentEmailDate: convertTimestampWithHour(date),
              };

              props.navigation.navigate('AnswerMails', {
                  showEmail,
              });
            }}>
              <View style={styles.imageUserDetailsContainer}>
                { userImageURL ?
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
                      <Text style={styles.detailsText}>{convertTimestampWithHour(date)}</Text>
                  </View>
                  <View>
                  
                    <Text style={styles.mailSubjectStyle}>
                      <Text style={styles.flatListItemTitleText}>E-mail subject: </Text>
                      <Text style={styles.flatListItemText}>{emailSubject}</Text>
                    </Text>
                  </View>
              </View>
          </TouchableOpacity>  
        </View>
      );

  return (
    <React.Fragment>
      { JSON.stringify(emailsList) !== JSON.stringify([]) ?
        <View style={styles.content}>

          {/* MAILS FLAT LIST */}
          <FlatList style = {styles.flatList}
            data={emailsList}
            keyExtractor={(item) => item.id}
            renderItem={({item}) =>
            <EmailsItem
              email={item.email}
              emailSubject={item.emailSubject}
              eventId={item.eventId}
              userId={item.userId}
              speakerId={item.speakerId}
              currentEmailId={item.id}
              answer={item.answer}
              date={item.date}
              userFirstName={item.userDetails.firstName}
              userLastName={item.userDetails.lastName}
              userImageURL={item.userDetails.userImageURL}
            />}
          />
        </View>

      : 
        <View style={styles.createdEventsView}>
          <Text style={styles.viewText}>You did not received any e-mails by now.</Text>
          <Text style={styles.viewText}>Check again later.</Text>
        </View>
      }
  </React.Fragment>
  )
}

export default DisplayMailsComponent

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
    },
    containerEvents:{
      borderStyle: 'dashed',
      borderBottomWidth: 1,
      borderBottomColor: 'black',
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