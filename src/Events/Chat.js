import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { auth } from '../../firebase/firebase-config';
import { setMessagesInFirestoreDb } from '../../firebase/dbSetFunctions';
import { getMessagesFromDb, getProfileById } from '../../firebase/dbGetFunctions';
import { Timestamp } from "firebase/firestore";

const Chat = (props) => {

  const user = auth.currentUser;
  const senderUserId = user.uid;
  let foundMessage;

  const [ messages, setMessages ] = useState([])
  const [ messagesList, setMessagesList ] = useState();
  const [ senderProfileObj, setSenderProfileObj ] = useState({});
  const [ receiverProfileObj, setReceiverProfileObj ] = useState({});
  const [ messagesWritten, setMessagesWriten ] = useState(0);
  const [ messagesSent, setMessagesSent ] = useState([]);
  const sentRef = useRef(messagesSent);

  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {
    if(messagesWritten > 0){
      storeMessageInFirestoreDb();  
    }
  }, [messagesWritten])

  useEffect(() => {
    const interval = setInterval(() => {
      getMessagesFromDb(messagesRetrieved, props.route.params.eventId, senderUserId, props.route.params.receiverUserId)
    }, 3000);
    return () => clearInterval(interval);
  }, [])

  function getData() {
    getMessagesFromDb(messagesRetrieved, props.route.params.eventId, senderUserId, props.route.params.receiverUserId)
    getProfileById(senderUserId).then((senderProfileObj) => {
      setSenderProfileObj(senderProfileObj[0]);
    })
    getProfileById(props.route.params.receiverUserId).then((receiverProfileObj) => {
      setReceiverProfileObj(receiverProfileObj[0]);
    })
  }
  
  function getFormattedJSDateFromFirebaseTimestamp(timestampSeconds, timestampNanoseconds) {
    const timestamp = new Timestamp(timestampSeconds, timestampNanoseconds);

    return timestamp.toDate()
  };

  function messagesRetrieved(messagesList) {
    if(messagesList !== undefined){
      setMessagesList(messagesList);
      const filteredSent = sentRef.current.filter((message) => {
        if (messagesList[0]){ 
          foundMessage = messagesList[0].messagesArray.find((storedMessage) => {
            return storedMessage._id === message._id;
          });
        }
        return !foundMessage;
      });
      sentRef.current = filteredSent;

      if (messagesList[0]){
      const messagesArray = messagesList[0].messagesArray;
      messagesArray.forEach((object) => {
        const formatedCreatedAtDate = getFormattedJSDateFromFirebaseTimestamp(object.createdAt.seconds, 
          object.createdAt.nanoseconds);
          object.createdAt = formatedCreatedAtDate;
      });
      setMessages(messagesArray);
    } else {
      setMessages([]);
    }
  }
  }

  function storeMessageInFirestoreDb(){
    setMessagesInFirestoreDb(GiftedChat.append(messages, sentRef.current), props.route.params.eventId, senderUserId, props.route.params.receiverUserId, receiverProfileObj, senderProfileObj);
  }

  const onSend = useCallback((messages1 = []) => {
    sentRef.current = GiftedChat.append(sentRef.current, messages1);
    setMessagesWriten(messagesWritten => messagesWritten + 1);
  }, [])

  return (
    <GiftedChat
      messages={GiftedChat.append(messages, sentRef.current)}
      onSend={(messages) => {
        onSend(messages);
      }}
      user={{
        _id: senderUserId,
        name: senderProfileObj.firstName && senderProfileObj.lastName ? senderProfileObj.firstName + ' ' + senderProfileObj.lastName : '',
        avatar: senderProfileObj.userImageURL ? senderProfileObj.userImageURL : '',
      }}
    />
  )
}

export default Chat