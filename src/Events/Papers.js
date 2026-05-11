import {StyleSheet, TouchableOpacity, Text, View, FlatList, Image } from 'react-native';
import React, {useEffect, useState} from 'react';
import { auth } from '../../firebase/firebase-config';
import { getPapersForUsers } from '../../firebase/dbGetFunctions';
import * as WebBrowser from 'expo-web-browser';

const Papers = (props) => {
  
    const [papersList, setPapersList] = useState();
    const user = auth.currentUser;
    const uid = user.uid; 

    useEffect(() => {
      getData();
    }, [])

    function getData(){
        getPapersForUsers(papersRetrieved, props.route.params.eventId);
    };
    
    function papersRetrieved(papersList){
        setPapersList(papersList);
    };

    //FLAT LIST ITEM
    const PapersItem = ({paperTitle, paperFileName, paperURL, finalVersion, userFirstName, userLastName,  userImageURL, eventId
    }) => (
         
        <View style={styles.containerEvents}>
        { finalVersion === true ?
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
                </View>
                <View>
                
                  <Text style={styles.mailSubjectStyle}>
                    <Text style={styles.flatListItemTitleText}>Paper title: </Text>
                    <Text style={styles.flatListItemText}>{paperTitle}</Text>
                  </Text>
                  <TouchableOpacity onPress={()=>{WebBrowser.openBrowserAsync(paperURL)}} >
                    <Text>
                        <Text style={styles.flatListItemTitleText}>Open paper: </Text>
                        <Text style={styles.flatListItemText}>{paperFileName}</Text>
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
          : null }
    </View>
  );

  return (
    <React.Fragment>
      { JSON.stringify(papersList) !== JSON.stringify([]) ?
          <View style={styles.content}>
          {/* PAPERS FLAT LIST */}
          <FlatList style = {styles.flatList}
            data={papersList}
            keyExtractor={(item) => item.id}
            renderItem={({item}) =>
            <PapersItem
              finalVersion={item.finalVersion}
              paperTitle={item.title}
              paperFileName={item.paperFileName}
              paperURL={item.paperURL}
              userId={item.userId}
              userFirstName={item.userDetails.firstName}
              userLastName={item.userDetails.lastName}
              userImageURL={item.userDetails.userImageURL}
            />}
          />
        </View>
      : 
        <View style={styles.createdEventsView}>
          <Text style={styles.viewText}>There are no papers for now.</Text>
          <Text style={styles.viewText}>Check again later.</Text>
        </View>
      }
  </React.Fragment>
  )
}

export default Papers

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