import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { auth } from '../../firebase/firebase-config';
import { setAnswerBySender } from '../../firebase/dbSetFunctions';
import SendMailIcon from 'react-native-vector-icons/FontAwesome';

const AnswerMails = (props) => {

    const [ answer, setAnswer] = useState('');
    const [ tempAnswer, setTempAnswer] = useState();
    const [ mailAnswered, setMailAnswered] = useState(props.route.params.showEmail.currentAnswer ? true : false );
    const currentEmailId = props.route.params.showEmail.currentEmailId;
    const user = auth.currentUser;
    const uid = user.uid;

    function addAnswer(currentEmailId) {
        setAnswerBySender(
          tempAnswer,
          currentEmailId,
          setAnswer,
          setMailAnswered)
    };

  return (
    <React.Fragment>
      { JSON.stringify(props.route.params.showEmail) !== JSON.stringify([]) ?
        <View style={styles.container}>
          
          {/* MAIL VIEW */}
          <View style={styles.eachMail}>
          <View style={styles.imageUserDetailsContainer}>
              { props.route.params.showEmail.currentUserImageURL ?
                  <View style={styles.imageContainer}>
                      {props.route.params.showEmail.currentUserImageURL && <Image source={{uri: props.route.params.showEmail.currentUserImageURL}} style={{width: 55 , height: 55, borderRadius: 55 /2}}/>}
                  </View>
              : 
                  <View style={styles.imageContainer}>
                      {<Image source={require('../img/default-profile-image.jpg')} style={{width: 55 , height: 55, borderRadius: 55 /2}}/>}
                  </View>
              }
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailsText}>{props.route.params.showEmail.currentUserFirstName + ' ' + props.route.params.showEmail.currentUserLastName}</Text>
                    <Text style={styles.detailsText}>{props.route.params.showEmail.currentEmailDate}</Text>
                </View>

                <View>
                  <Text style={styles.mailSubjectStyle}>
                    <Text style={styles.flatListItemTitleText}>Subject: </Text>
                    <Text style={styles.flatListItemText}>{props.route.params.showEmail.currentEmailSubject}</Text>
                  </Text>
                  
                    <Text style={styles.flatListItemTitleText}>Message: </Text>
                    <Text style={styles.flatListItemText}>{props.route.params.showEmail.currentEmail}</Text>
                  
                    { props.route.params.showEmail.currentAnswer !== '' || answer !== '' ?
                      <View>
                          <Text style={styles.flatListItemTitleText}>Answer: </Text>
                          <Text style={styles.flatListItemText}>{props.route.params.showEmail.currentAnswer || answer}</Text>
                      </View>
                    : 
                      null 
                    }
                </View>
            </View>
              
            {/* TEXT INPUT FOR ANSWERING MAILS */}
            { !mailAnswered ? 
              <View style={styles.secondContainer}>
                <TextInput
                    key={currentEmailId}
                    placeholder="Answer"
                    onChangeText={(text) => {
                      setTempAnswer(text)
                    }}
                    style={styles.input}
                    multiline={true}
                    numberOfLines={10}
                />

                <TouchableOpacity
                onPress = {() => {addAnswer(currentEmailId)}}
                style={styles.button}
                >
                  <View style={styles.centerTextIconOnButton}>
                    <SendMailIcon name="send" size={25} color="white" />
                    <Text style={styles.createPollButtonText}>Send</Text>
                  </View>
                </TouchableOpacity>
              </View>
            : 
              null 
            } 
          </View>
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

export default AnswerMails

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
    flatList  : {
      backgroundColor : '#89cff0',
    },
    item: {
      backgroundColor: '#89cff0',
      justifyContent: 'center',
      alignContent:'center',
      margin: 10,
    },
    mailSubjectStyle: {
      marginLeft: 5,
      
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
    textInputsTitle: {
      fontSize: 17,
      fontWeight: "600",
      paddingLeft: 13,
      marginLeft: 5,
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
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 18,
    },
  eachMail: {
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
  createPollButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17,
    alignSelf: 'center',
  },
  centerTextIconOnButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})