import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import React, {useEffect, useState} from 'react';
import { getEmailsForCurrentUsers } from '../../firebase/dbGetFunctions';
import { setEmails } from '../../firebase/dbSetFunctions';
import SaveNoteIcon from 'react-native-vector-icons/FontAwesome';
import CloseModalIcon from 'react-native-vector-icons/Ionicons';
import { auth } from '../../firebase/firebase-config';

const SendMail = (props) => {

  const [ emailsList, setEmailsList] = useState();
  const [ email, setEmail] = useState('');
  const [ emailSubject, setEmailSubject ] = useState('');
  const user = auth.currentUser;
  const currentUserId = user.uid;

  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getEmailsForCurrentUsers(emailsRetrieved, props.eventId, currentUserId, props.receiverId);
  };
  
  function emailsRetrieved(emailsList){
    setEmailsList(emailsList);
  };

  function convertTimestamp (timestamp){
    let date = timestamp.toDate();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    date = day + '/' + month + '/' + year + ' - ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
    return date;
  };

  const EmailItem = ({
    emailSubject, email, date, answer, senderId
  }) => (
    <View style={styles.imageUserDetailsContainer}>
      { props.myUid === senderId ?
        <View style={styles.imageContainer}>
          {props.myImageURL && <Image source={{uri: props.myImageURL}} style={{width: 55 , height: 55, borderRadius: 55 /2}}/>}
        </View>
        :  
        <View style={styles.imageContainer}>
          {props.receiverImageURL && <Image source={{uri: props.receiverImageURL}} style={{width: 55 , height: 55, borderRadius: 55 /2}}/>}
        </View>
      }

      { !props.myImageURL || !props.receiverImageURL ?
        <View style={styles.imageContainer}>
          {<Image source={require('../img/default-profile-image.jpg')} style={{width: 55 , height: 55, borderRadius: 55 /2}}/>}
        </View>
      :
        null
      }

      { props.myUid === senderId?
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>{props.myFirstName + ' ' + props.myLastName}</Text>
          <Text style={styles.detailsText}>{convertTimestamp(date)}</Text>
        </View>
      : 
        <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>{props.receiverFirstName + ' ' + props.receiverLastName}</Text>
            <Text style={styles.detailsText}>{convertTimestamp(date)}</Text>
        </View>
      }
        <View style={styles.mailContainer}>
            <Text>
                <Text style={styles.item2ndTitle}>Email subject: </Text>
                <Text style={styles.item2nd}>{emailSubject}</Text>
            </Text>
            <Text style={styles.item2ndTitleMail}>Email: </Text>
            <Text style={styles.item2nd}>{email}</Text>
            {answer !== '' ?
                <View>
                    <Text style={styles.item2ndTitle}>Answer:</Text>
                    <Text style={styles.item2nd}>{answer}</Text>
                </View>
            : null }
        </View>
    </View>
  );

    function addEmail() {
        setEmails(
        emailSubject,
        email,
        props.eventId,
        props.receiverId,
        emailsRetrieved,
        setEmail,
        setEmailSubject,
        props.toggleMailModalHandler
        );
    };

  return (
    <View style={styles.container}>

        <View style={styles.headerContainer}>
            <TouchableOpacity
            style={styles.buttonCloseAddPolls}
            onPress={() => {
                props.toggleMailModalHandler(true);
            }}>
            <CloseModalIcon name="close-sharp" size={30} color="black" />
            </TouchableOpacity> 
        </View>

        <Text style={styles.textInputsTitle}>Add e-mail</Text>

      {/* TEXT INPUT FOR SEND E-MAILS */}
      <View style={styles.secondContainer}>
        <TextInput
            placeholder="Subject"
            value={emailSubject}
            onChangeText={text => setEmailSubject(text)}
            style={styles.inputTitle}
        />
        <TouchableOpacity
          onPress = {() => {addEmail()}}
          style={styles.button}
          >
            <View style={styles.centerTextIconOnButton}>
              <SaveNoteIcon name="send" size={25} color="white" />
              <Text style={styles.createPollButtonText}>Send</Text>
            </View>
        </TouchableOpacity>

        <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            multiline={true}
            numberOfLines={10}
        />
      </View>
  
        
       {/* MAILS FLAT LIST */}
    { JSON.stringify(emailsList) !== JSON.stringify([]) ?
      <FlatList style = {styles.flatList}
        data={emailsList}
        keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        renderItem={({item})  =>
        <EmailItem
          emailSubject={item.emailSubject}
          email={item.email}
          eventId={item.eventId}
          senderId={item.senderId}
          date={item.date}
          answer={item.answer}
          />}
      />
    : 
      <View style={styles.createdEventsView}>
        <Text style={styles.viewText}>No e-mails yet.</Text>
        <Text style={styles.viewText}>Send an e-mail or check again later.</Text>
      </View>
    }
    </View>
  )
}

export default SendMail

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#89cff0',
    height: '100%',
},
headerContainer:{
    backgroundColor: '#89cff0',
    height: '9.5%',
},
flatList  : {
  backgroundColor : '#89cff0',
  height: '56.5%',
},
buttonCloseAddPolls: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    top: 5,
},
item: {
  backgroundColor: '#89cff0',
  justifyContent: 'center',
  alignContent:'center',
  margin: 10,
  marginBottom: 5,
  borderStyle: 'dashed',
  borderBottomWidth: 1,
  borderBottomColor: 'black',
},
item2ndTitle: {
  justifyContent: 'center',
  fontSize: 21,
  fontWeight: '700',
},
item2ndTitleMail: {
  justifyContent: 'center',
  fontSize: 21,
  fontWeight: '700',
},
item2nd: {
  justifyContent: 'center',
  margin: 3,
  fontSize: 19,
},
secondContainer: {
  backgroundColor: '#89cff0',
  flexDirection: 'row', 
  flexWrap:'wrap',
  borderStyle: 'dashed',
  borderBottomWidth: 1,
  borderBottomColor: 'black',
  height: '34%'
},
inputTitle: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  marginTop: 10,
  marginLeft: 13,
  fontSize: 20,
  marginBottom: 10,
  width: '70.8%',
},
input: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  marginTop: 10,
  marginLeft: 13,
  fontSize: 20,
  marginBottom: 10,
  width: '93%',
  height: 100,
},
textInputsTitle: {
  fontSize: 21,
  fontWeight: "700",
  paddingLeft: 13,
  marginLeft: 5,
},
button: {
  backgroundColor: '#0782F9',
  width: '19%',
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
imageUserDetailsContainer: {
    flexDirection: 'row', 
    flexWrap:'wrap',
    width: '100%',
    marginTop: 5,
    flexBasis: 'auto',
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
},
imageContainer: {
    flexBasis: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
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
mailContainer: {
  width: '100%',
},
viewText: {
  fontSize: 17,
  fontWeight: '700',
  alignContent: 'center',
  justifyContent: 'center',
},
createdEventsView: {
  height: '56.5%',
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