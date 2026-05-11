import { db, auth } from './firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, addDoc, collection, updateDoc, Timestamp, increment, deleteDoc } from "firebase/firestore";
import { getLike, getPosts, getProfile, getEventByEventIdForEdit, getUserByEmail, getQuestionsForSpeaker, 
  getQuestionsBySpeakerId, getPapersForReview, getMyReviewForCurrentPaper, getPapersForCurrentAuthor, 
  getPollResult, getParticipantsById, getNotesByUserId, getMessagesForCurrentChat, getEventLocationByEventId,
  getEmailsByUserIdForSender} from './dbGetFunctions';
import PushNotificationService from '../src/PushNotificationsService/PushNotificationsService';

const user = auth.currentUser;

export async function setEventDetails(
  myEventName, 
  myEventLocation,
  startDate, 
  endDate,
  eventTypeValue,
  conferenceInstitution,
  conferenceLink,
  showAddEventSuccessMessage,
  navigationGoBack){
  const user = auth.currentUser;
  const uid = user.uid;  
  console.log('user.displayName');
  console.log(user);
  const docRef  = await addDoc(collection(db, "events"), {
    eventName: myEventName,
    eventLocation: myEventLocation,
    eventStartDate: startDate,
    eventEndDate: endDate,
    eventType: eventTypeValue,
    conferenceInstitution: conferenceInstitution,
    conferenceLink: conferenceLink,
    eventOrganizer: user.displayName,
    adminId: uid,
    isExpired: false,
    areSpeakersAllowed: false,
    areReviewersAllowed: false,
    areAuthorsAllowed: false,
    isPollingAllowed: false,
    isPollingAllowedForUsers: false,
    areStatisticsAllowed: false,
    areStatisticsAllowedForUsers: false,
    showEventLocation: false,
    arePostsAllowed: false,
    areCommentsAllowed: false,
    allowUsersToChatAmongThemselves: false,
    allowUsersToChatWithSpeakers: false,
    allowUsersToChatWithReviewers: false,
    allowUsersToChatWithAuthors: false,
    allowUsersToAskQuestions: false,
    showEventLocationDetails: false,
    postsCount: 0,
    commentsCount: 0,
    participantsCount: 0,
    speakersCount: 0,
    reviewersCount: 0,
    authorsCount: 0,
  })
  .then((docRef) => {
    if(typeof showAddEventSuccessMessage === "function"){
      showAddEventSuccessMessage();
    }
    joinEvent(docRef.id, true);
    navigationGoBack();
  });
}

export async function updateEventDetails(
  myEventName,
  myEventLocation,
  startDate,
  endDate,
  eventImageURL = '',
  eventId,
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
  editEventRetrieved){
  const user = auth.currentUser;
  const displayName = user.displayName
  const uid = user.uid; 
  const docRef = doc(db, "events", eventId);
  updateDoc(docRef,{
    eventName: myEventName,
    eventLocation: myEventLocation,
    eventStartDate: startDate,
    eventEndDate: endDate,
    eventImageURL: eventImageURL,
    eventOrganizer: displayName,
    areSpeakersAllowed: areSpeakersAllowed,
    areReviewersAllowed: areReviewersAllowed,
    areAuthorsAllowed: areAuthorsAllowed,
    isPollingAllowed: isPollingAllowed,
    isPollingAllowedForUsers: isPollingAllowedForUsers,
    areStatisticsAllowed: areStatisticsAllowed,
    areStatisticsAllowedForUsers: areStatisticsAllowedForUsers,
    showEventLocation: showEventLocation,
    arePostsAllowed: arePostsAllowed,
    areCommentsAllowed: areCommentsAllowed,
    allowUsersToChatAmongThemselves: allowUsersToChatAmongThemselves,
    allowUsersToChatWithSpeakers: allowUsersToChatWithSpeakers,
    allowUsersToChatWithReviewers: allowUsersToChatWithReviewers,
    allowUsersToChatWithAuthors: allowUsersToChatWithAuthors,
    allowUsersToAskQuestions: allowUsersToAskQuestions,
    showEventLocationDetails: showEventLocationDetails,
    conferenceInstitution: conferenceInstitution,
    conferenceLink: conferenceLink,
  }).then(() => {
    if(typeof showUpdateEventSuccessMessage === "function"){
      showUpdateEventSuccessMessage();
    }
    getEventByEventIdForEdit(editEventRetrieved, eventId)
  })
}

export async function setProfile(
  userUid,
  userEmail,
  userFirstName,
  userLastName,
  pushToken,
  userAddress = '',
  userPhoneNumber = '',
  image = '',
  documentURL = '',
  fileName = '',
  isPrivateProfile = false,
  showCV = false,
  showImage = false,
  showEmail = false,
  showSuccessMessage,
  profileRetrieved){
  setDoc(doc(db, "users", userUid), {
      userUid: userUid,
      userEmail: userEmail,
      firstName: userFirstName,
      lastName: userLastName,
      pushToken: pushToken,
      address: userAddress,
      phoneNumber: userPhoneNumber,
      userImageURL: image,
      userCvURL: documentURL,
      cvFileName: fileName,
      isPrivateProfile: isPrivateProfile,
      showCV: showCV,
      showImage: showImage,
      showEmail: showEmail,
    }).then(() => {
      if(typeof showSuccessMessage === "function"){
        showSuccessMessage();
      }
      if(typeof profileRetrieved === "function"){
        getProfile(profileRetrieved);
      }
    });
}

export async function setPost(
  eventPostTitle,
  eventPostDescription,
  image,
  selectedEventId,
  togglePostsModal,
  getPosts,
  postsRetrieved){
  const user = auth.currentUser;
  const uid = user.uid;  
  addDoc(collection(db, "posts"), {
    postTitle: eventPostTitle,
    postDescription: eventPostDescription,
    postImageURL: image,
    eventId: selectedEventId,
    date: Timestamp.now(),
    userId: uid,
  }).then(() =>{
    updateDoc(doc(db, "events", selectedEventId), {
      postsCount: increment(1),
    })
    togglePostsModal(false);
    getPosts(postsRetrieved, selectedEventId);
  });
}


export async function setComments(
  postComment,
  postId,
  commentsRetrieved,
  getComments,
  setPostComment,
  eventId){
  const user = auth.currentUser;
  const uid = user.uid;  
  addDoc(collection(db, "comments"), {
    postId: postId,
    comment: postComment,
    date: Timestamp.now(),
    userId: uid,
    eventId: eventId,
  })
  .then(() =>{
    updateDoc(doc(db, "events", eventId), {
      commentsCount: increment(1),
    })
    getComments(commentsRetrieved, postId);
    setPostComment('');

  });
}

export async function onLikePress(
  postId,
  postsRetrieved,
  selectedEventId,
  setIsLiked){
  const user = auth.currentUser;
  const uid = user.uid; 
  const docRef = doc(db, "posts", postId);
  getLike(postId, uid).then((likesList) => {
  if (likesList.length > 0){
    return;
  } else {
    const currentPost =  getDoc(docRef);
    addDoc(collection(db, "likes"),{
      postId: postId,
      userId: uid,
    }).then(() => {
      updateDoc(docRef, {
        likesCount: increment(1)
      }).then(() => {
        getPosts(postsRetrieved, selectedEventId);
        setIsLiked(true);
      }) 
    }) 
  }
});
}

export async function onDislikePress(
  postId,
  postsRetrieved,
  selectedEventId,
  setIsLiked){
  const user=auth.currentUser;
  const uid=user.uid;
  const docRef=doc(db, "posts", postId);
  getLike(postId, uid).then((likeList)=>{
    if(likeList.length > 0){
      const currentPost = getDoc(docRef);
      deleteDoc(doc(db, "likes", likeList[0].id)).then(
          updateDoc(docRef,{
            likesCount: increment(-1)
          }).then(() => {
          getPosts(postsRetrieved, selectedEventId)
          setIsLiked(false);
      }));
    } else {
      return;
    }
  });
}

export async function joinEvent(eventId, isAdmin){
  const user=auth.currentUser;
  const uid=user.uid;
    addDoc(collection(db, "participants"), {
      userId: uid,
      eventId: eventId,
      isSpeaker: false,
      isReviewer: false,
      isAuthor: false,
      isAdmin: isAdmin,
    }).then(() => {
      updateDoc(doc(db, "events", eventId), {
        participantsCount: increment(1),
      })
    })
}

export async function setSpeakerOnEvent(
  eventId,
  speakerEmail,
  speakerFirstName,
  speakerLastName,
  showSpeakerAlreadyExistsAlert){
  getUserByEmail(speakerEmail).then((usersList) => {
    if(usersList.length > 0 && usersList[0].userEmail === speakerEmail){
      getParticipantsById(usersList[0].userUid, eventId).then((participantsList) => {
        if(participantsList.length > 0 && participantsList[0].isSpeaker === false){
          const docRef = doc(db, "participants", participantsList[0].id);
          updateDoc(docRef, {
            isSpeaker: true,
        })
        addDoc(collection(db, "speakers"), {
          eventId: eventId,
          speakerEmail: speakerEmail,
          speakerId: usersList[0].userUid,
        })
        updateDoc(doc(db, "events", eventId), {
          participantsCount: increment(1),
          speakersCount: increment(1),
        })
      } else if(participantsList.length > 0 && participantsList[0].isSpeaker === true){
        showSpeakerAlreadyExistsAlert();
      } else if (participantsList.length === 0){
        addDoc(collection(db, "speakers"), {
          eventId: eventId,
          speakerEmail: speakerEmail,
          speakerId: usersList[0].userUid,
        })
        addDoc(collection(db, "participants"), {
          eventId: eventId,
          userId: usersList[0].userUid,
          isSpeaker: true,
          isReviewer:  false,
          isAuthor: false,
          isAdmin: false,
        })
        updateDoc(doc(db, "events", eventId), {
          participantsCount: increment(1),
          speakersCount: increment(1),
        })
      }
    })
    } else if(usersList.length === 0) {
        createUserWithEmailAndPassword(auth, speakerEmail, "123456")
        .then((response) => {
          const userUid = response.user.uid;
          setProfile(
            response.user.uid,
            response.user.email,
            speakerFirstName,
            speakerLastName,
            '',
            '')
          addDoc(collection(db, "speakers"), {
            eventId: eventId,
            speakerEmail: speakerEmail,
            speakerId: userUid,
          })
          addDoc(collection(db, "participants"), {
            eventId: eventId,
            userId: userUid,
            isSpeaker: true,
            isReviewer:  false,
            isAuthor: false,
            isAdmin: false,
          })
          updateDoc(doc(db, "events", eventId), {
            participantsCount: increment(1),
            speakersCount: increment(1),
          })
      })
        
      } 
    })
}

export async function setReviewersOnConference(
  eventId,
  reviewerEmail,
  reviewerFirstName,
  reviewerLastName,
  showReviewerAlreadyExistsAlert){
    getUserByEmail(reviewerEmail).then((usersList) => {
      if(usersList.length > 0 && usersList[0].userEmail === reviewerEmail){
        getParticipantsById(usersList[0].userUid, eventId).then((participantsList) => {
          if(participantsList.length > 0 && participantsList[0].isReviewer === false){
            const docRef = doc(db, "participants", participantsList[0].id);
            updateDoc(docRef, {
              isReviewer: true,
          })
          addDoc(collection(db, "reviewers"), {
            eventId: eventId,
            reviewerEmail: reviewerEmail,
            reviewerId: usersList[0].userUid,
          })
          updateDoc(doc(db, "events", eventId), {
            participantsCount: increment(1),
            reviewersCount: increment(1),
          })
        } else if(participantsList.length > 0 && participantsList[0].isReviewer === true){
          showReviewerAlreadyExistsAlert();
        } else if (participantsList.length === 0){
          addDoc(collection(db, "reviewers"), {
            eventId: eventId,
            reviewerEmail: reviewerEmail,
            reviewerId: usersList[0].userUid,
          })
          addDoc(collection(db, "participants"), {
            eventId: eventId,
            userId: usersList[0].userUid,
            isSpeaker: false,
            isReviewer:  true,
            isAuthor: false,
            isAdmin: false,
          })
          updateDoc(doc(db, "events", eventId), {
            participantsCount: increment(1),
            reviewersCount: increment(1),
          })
        }
      })
      } else if(usersList.length === 0) {
          createUserWithEmailAndPassword(auth, reviewerEmail, "123456")
          .then((response) => {
            const userUid = response.user.uid;
            setProfile(
              response.user.uid,
              response.user.email,
              reviewerFirstName,
              reviewerLastName,
              '',
              '')
            addDoc(collection(db, "reviewers"), {
              eventId: eventId,
              reviewerEmail: reviewerEmail,
              reviewerId: userUid,
        
            })
            addDoc(collection(db, "participants"), {
              eventId: eventId,
              userId: userUid,
              isSpeaker: false,
              isReviewer:  true,
              isAuthor: false,
              isAdmin: false,
            })
            updateDoc(doc(db, "events", eventId), {
              participantsCount: increment(1),
              reviewersCount: increment(1),
            })
        })
          
        } 
      })
}

export async function setAuthorsOnConference(
  eventId,
  authorEmail,
  authorFirstName,
  authorLastName,
  showAuthorAlreadyExistsAlert){
  getUserByEmail(authorEmail).then((usersList) => {
    if(usersList.length > 0 && usersList[0].userEmail === authorEmail){
      getParticipantsById(usersList[0].userUid, eventId).then((participantsList) => {
        if(participantsList.length > 0 && participantsList[0].isAuthor === false){
          const docRef = doc(db, "participants", participantsList[0].id);
          updateDoc(docRef, {
            isAuthor: true,
        })
        addDoc(collection(db, "authors"), {
          eventId: eventId,
          authorEmail: authorEmail,
          authorId: usersList[0].userUid,
        })
        updateDoc(doc(db, "events", eventId), {
          participantsCount: increment(1),
          authorsCount: increment(1),
        })
      } else if(participantsList.length > 0 && participantsList[0].isAuthor === true){
        showAuthorAlreadyExistsAlert();
      } else if (participantsList.length === 0){
        addDoc(collection(db, "authors"), {
          eventId: eventId,
          authorEmail: authorEmail,
          authorId: usersList[0].userUid,
        })
        addDoc(collection(db, "participants"), {
          eventId: eventId,
          userId: usersList[0].userUid,
          isSpeaker: false,
          isReviewer:  false,
          isAuthor: true,
          isAdmin: false,
        })
        updateDoc(doc(db, "events", eventId), {
          participantsCount: increment(1),
          authorsCount: increment(1),
        })
      }
    })
    } else if(usersList.length === 0) {
        createUserWithEmailAndPassword(auth, authorEmail, "123456")
        .then((response) => {
          const userUid = response.user.uid;
          setProfile(
            response.user.uid,
            response.user.email,
            authorFirstName,
            authorLastName,
            '',
            '')
            addDoc(collection(db, "authors"), {
              eventId: eventId,
              authorEmail: authorEmail,
              authorId: userUid,
            })
          addDoc(collection(db, "participants"), {
            eventId: eventId,
            userId: userUid,
            isSpeaker: false,
            isReviewer:  false,
            isAuthor: true,
            isAdmin: false,
          })
          updateDoc(doc(db, "events", eventId), {
            participantsCount: increment(1),
            authorsCount: increment(1),
          })
        })
      } 
  })
}

export async function setInvitesEvent(
  userFirstName,
  userLastName,
  userEmail,
  eventId,
  showUserAlreadyExistsAlert,
  setUserFirstName,
  setUserLastName,
  setUserEmail){
  const user=auth.currentUser;
  const uid=user.uid;
  getUserByEmail(userEmail).then((usersList) => {
    if(usersList.length > 0 && usersList[0].userEmail === userEmail){
      getParticipantsById(usersList[0].userUid, eventId).then((participantsList) => {
        if(participantsList.length > 0 && participantsList[0].isInvited === false){
          const docRef = doc(db, "participants", participantsList[0].id);
          updateDoc(docRef, {
            isInvited: true,
        })
          addDoc(collection(db, "invites"), {
          eventId: eventId,
          userEmail: userEmail,
          userId: usersList[0].userUid,
        }).then(() => {
          setUserFirstName(''),
          setUserLastName(''),
          setUserEmail(''),
          updateDoc(doc(db, "events", eventId), {
            participantsCount: increment(1),
          })
        })
      } else if(participantsList.length > 0 && participantsList[0].isInvited === true){
        showUserAlreadyExistsAlert();
        setUserFirstName(''),
        setUserLastName(''),
        setUserEmail('')
      } else if (participantsList.length === 0){
        addDoc(collection(db, "invites"), {
          eventId: eventId,
          userEmail: userEmail,
          userId: usersList[0].userUid,
        })
        addDoc(collection(db, "participants"), {
          eventId: eventId,
          userId: usersList[0].userUid,
          isSpeaker: false,
          isReviewer: false,
          isAuthor: false,
          isAdmin: false,
          isInvited: true,
        }).then(() => {
          setUserFirstName(''),
          setUserLastName(''),
          setUserEmail(''),
          updateDoc(doc(db, "events", eventId), {
            participantsCount: increment(1),
          })
        })
      }
    })
    } else if(usersList.length === 0) {
        createUserWithEmailAndPassword(auth, userEmail, "123456")
        .then((response) => {
          const userUid = response.user.uid;
          setProfile(
            response.user.uid,
            response.user.email,
            userFirstName,
            userLastName,
            '',
            '')
            addDoc(collection(db, "invites"), {
              eventId: eventId,
              userEmail: userEmail,
              userId: userUid,
            })
            addDoc(collection(db, "participants"), {
              eventId: eventId,
              userId: userUid,
              isSpeaker: false,
              isReviewer:  false,
              isAuthor: false,
              isAdmin: false,
              isInvited: true,
            }).then(() => {
              setUserFirstName(''),
              setUserLastName(''),
              setUserEmail(''),
              updateDoc(doc(db, "events", eventId), {
                participantsCount: increment(1),
              })
            })
        })
      } 
  })
}

export async function setPoll(
    pollQuestion,
    choice1,
    choice2,
    choice3,
    eventId,
    togglePollsModalHandler){
  const user=auth.currentUser;
  const uid=user.uid;
  addDoc(collection(db, "polls"), {
    pollQuestion: pollQuestion,
    choice1Text: choice1,
    choice2Text: choice2,
    choice3Text: choice3,
    choiceId1: 1,
    choiceId2: 2,
    choiceId3: 3,
    choice1Votes: 0,
    choice2Votes: 0,
    choice3Votes: 0,
    totalVotes: 0,
    eventId: eventId,
    userId: uid,
    userName: user.displayName,
  }).then(() =>{
    togglePollsModalHandler(false);
  });
}

export async function setPollAsAnswered(
    selectedChoiceId,
    currentPollId,
    pollRetrieved){
  const user=auth.currentUser;
  const uid=user.uid;
  const docRef = doc(db, "polls", currentPollId);
  addDoc(collection(db, "answeredPolls"), {
    pollId: currentPollId,
    selectedChoiceId: selectedChoiceId,
    userId: uid,
  }).then(() => {
    const choiceToIncrement = 'choice' +  selectedChoiceId.id + 'Votes';
    updateDoc(docRef, {
      totalVotes: increment(1),
      [choiceToIncrement]: increment(1),
    }).then(() => {
      getPollResult(pollRetrieved, currentPollId);
    });
  }) 
}

export async function setQuestionsForSpeakers(
  question,
  eventId,
  speakerId,
  setQuestion,
  questionsRetrieved){
  const user = auth.currentUser;
  const uid = user.uid;  
  addDoc(collection(db, "speakerQuestions"), {
    question: question,
    eventId: eventId,
    userId: uid,
    speakerId: speakerId,
    answer: '',
    date: new Date(),
  })
  .then(() =>{
    getQuestionsForSpeaker(questionsRetrieved, eventId, speakerId);
    setQuestion('');

  });
}

export async function setAnswerBySpeaker(
  answers,
  eventId,
  setAnswersObj,
  currentQuestionId,
  questionsRetrieved){
  const docRef = doc(db, "speakerQuestions", currentQuestionId);
  const user = auth.currentUser;
  const uid = user.uid;  
  const answer = answers[currentQuestionId];
  updateDoc(docRef, {
    answer: answer,
  })
  .then(() =>{
    getQuestionsBySpeakerId(questionsRetrieved, eventId, uid);
    answers[questionsRetrieved] = '';
    setAnswersObj(answers);
  });
}

export async function setAgenda(
  title, 
  description,
  time,
  showSpeakerAtEvent,
  value,
  eventId,
  showAgendaSuccessMessage,
  toggleAgendaModalHandler){
  const user = auth.currentUser;
  const uid = user.uid;  
  addDoc(collection(db, "agenda"), {
    agendaTitle: title,
    agendaDescription: description,
    agendaTime: time,
    showSpeakerAtEvent: showSpeakerAtEvent,
    speakerId: value,
    eventId: eventId,
  }).then(() => {
    if(typeof showAgendaSuccessMessage === "function"){
      showAgendaSuccessMessage();
    }
    toggleAgendaModalHandler(false);
  });
}

export async function updateAgenda(
  title,
  description,
  agendaItemId,
  agendaTime,
  currentData,
  updateTitleDescriptionHandler){
  const user = auth.currentUser;
  const uid = user.uid;  
  updateDoc(doc(db, "agenda", agendaItemId), {
    agendaTitle: title,
    agendaDescription: description,
  })
  .then(() => {
    updateTitleDescriptionHandler(title, description, agendaTime, currentData, agendaItemId);
  });
}


export async function setPaper(
  paperTitle,
  documentURL,
  fileName,
  eventId,
  setPaperTitle,
  papersRetrieved,
  sendPushToReviewers){
  const user = auth.currentUser;
  const uid = user.uid;
  const currentDate = new Date();
  const deadlineDate = currentDate.setMonth(currentDate.getMonth() + 1);
  const current = new Date();
  addDoc(collection(db, "authorsPapers"), {
      title: paperTitle,
      paperURL: documentURL,
      paperFileName: fileName,
      eventId: eventId,
      userId: uid,
      areReferencesRelevant: false,
      isStructureFollowed: false,
      isRecommendationYes: false,
      isRecommendationReview: false,
      isRecommendationNo: false,
      isTopicFollowed: false,
      neverReviewed: true,
      reviewCounter: 0,
      finalVersion: false,
      deadlineDate: deadlineDate,
    }).then( async () => {
      setPaperTitle('');
      getPapersForCurrentAuthor(papersRetrieved, eventId);
      sendPushToReviewers(paperTitle);
    })
}

export async function updatePaper(
  title,
  paperId,
  paperURL,
  fileName,
  sendPushToReviewers){
  const user = auth.currentUser;
  const uid = user.uid;
  updateDoc(doc(db, "authorsPapers", paperId), {
      paperURL: paperURL,
      isReviewed: false,
      paperFileName: fileName,
    }).then( async () => {
      sendPushToReviewers(title);
    })
}

export async function uploadFinalPaper(
  title,
  paperId,
  paperURL,
  fileName,
  sendFinalPushToReviewers){
  const user = auth.currentUser;
  const uid = user.uid;
  updateDoc(doc(db, "authorsPapers", paperId), {
      paperURL: paperURL,
      finalVersion: true,
      paperFileName: fileName,
    }).then( async () => {
      sendFinalPushToReviewers(title);
    })
}

export async function setReviews(
  eventId,
  currentPaperId){
  const user = auth.currentUser;
  const uid = user.uid;  
  addDoc(collection(db, "paperReviews"), {
    review1Text: '',
    review2Text: '',
    review3Text: '',
    eventId: eventId,
    paperId: currentPaperId,
    reviewerId: uid,
    isTopicFollowed: false,
    isStructureFollowed: false,
    areReferencesRelevant: false,
    isRecommendationYes: false,
    isRecommendationReview: false,
    isRecommendationNo: false,
  })   
}

export async function setUpdateReviews(
  reviewsObj,
  eventId,
  currentPaperId,
  authorId,
  paperTitle,
  reviewCounter,
  isTopicFollowed,
  isStructureFollowed,
  areReferencesRelevant,
  isRecommendationYes,
  isRecommendationReview,
  isRecommendationNo,
  setReviewsObj,
  papersRetrieved,
  sendPushToAuthors){
  const docRef = doc(db, "authorsPapers", currentPaperId);
  const user = auth.currentUser;
  const uid = user.uid;  
  const review = reviewsObj[currentPaperId];

  getMyReviewForCurrentPaper(currentPaperId).then((reviewsList) => {
    if(reviewsList[0].review1Text === ''){
      updateDoc(doc(db, "paperReviews", reviewsList[0].id), {
        review1Text: review,
        isTopicFollowed: isTopicFollowed,
        isStructureFollowed: isStructureFollowed,
        areReferencesRelevant: areReferencesRelevant,
        isRecommendationYes: isRecommendationYes,
        isRecommendationReview: isRecommendationReview,
        isRecommendationNo: isRecommendationNo,
      }).then(() => {
          updateDoc(docRef, {
            reviewCounter: increment(1),
            isReviewed: true,
            neverReviewed: false,
            isTopicFollowed: isTopicFollowed,
            isStructureFollowed: isStructureFollowed,
            areReferencesRelevant: areReferencesRelevant,
            isRecommendationYes: isRecommendationYes,
            isRecommendationReview: isRecommendationReview,
            isRecommendationNo: isRecommendationNo,
          })
          getPapersForReview(papersRetrieved, eventId);
          reviewsObj[papersRetrieved] = '';
          setReviewsObj(reviewsObj);
          sendPushToAuthors(authorId, paperTitle);
      })
    } else {
      updateDoc(doc(db, "authorsPapers", currentPaperId), {
        reviewCounter: increment(1),
        isReviewed: true,
        isTopicFollowed: isTopicFollowed,
        isStructureFollowed: isStructureFollowed,
        areReferencesRelevant: areReferencesRelevant,
        isRecommendationYes: isRecommendationYes,
        isRecommendationReview: isRecommendationReview,
        isRecommendationNo: isRecommendationNo,
    }).then(() => {
        const reviewText = "review" + (reviewCounter + 1) + "Text";
        updateDoc(doc(db, "paperReviews", reviewsList[0].id), {
          [reviewText]: review,
          isTopicFollowed: isTopicFollowed,
          isStructureFollowed: isStructureFollowed,
          areReferencesRelevant: areReferencesRelevant,
          isRecommendationYes: isRecommendationYes,
          isRecommendationReview: isRecommendationReview,
          isRecommendationNo: isRecommendationNo,
        })
        getPapersForReview(papersRetrieved, eventId);
        reviewsObj[papersRetrieved] = '';
        setReviewsObj(reviewsObj);
        sendPushToAuthors(authorId, paperTitle);
      })  
    }
  });
}

export async function setNotes(
  noteTitle,
  note,
  eventId,
  notesRetrieved,
  setNoteTitle,
  setNote){
  const user = auth.currentUser;
  const uid = user.uid;  
  addDoc(collection(db, "notes"), {
    noteTitle: noteTitle,
    note: note,
    eventId: eventId,
    userId: uid,
    date: new Date(),
  })
  .then(() =>{
    getNotesByUserId(notesRetrieved, eventId);
    setNoteTitle('',)
    setNote('');
  });
}

export async function setMessagesInFirestoreDb(
  newMessagesList,
  eventId,
  senderUserId,
  receiverUserId,
  receiverProfileObj,
  senderProfileObj){
  getMessagesForCurrentChat(eventId, senderUserId, receiverUserId)
    .then((response) => {
      if(response.length !== 0){
        updateDoc(doc(db, "chat", response[0].id), {
          messagesArray: newMessagesList,
        })
      } else {
        addDoc(collection(db, "chat"), {
          messagesArray: newMessagesList,
          eventId: eventId,
          usersArray: [senderUserId, receiverUserId],
        })
      }
      const notificationTitle = 'New message from ' + senderProfileObj.firstName + ' ' + senderProfileObj.lastName;
      const notificationDescription = 'Please open conversation to see the message';
      PushNotificationService.sendPushNotification(receiverProfileObj.pushToken, notificationTitle, notificationDescription)
    }).catch((error) => {
      console.log(error)
    })
}

export async function setPushNotification(
  pushToken,
  notificationTitle,
  notificationDescription,
  eventId,
  showPushNotificationSuccessMessage,
  togglePushNotificationsModalHandler){
  const user = auth.currentUser;
  const uid = user.uid;  
  addDoc(collection(db, "pushNotifications"), {
    pushToken: pushToken,
    notificationTitle: notificationTitle,
    notificationDescription: notificationDescription,
    eventId: eventId,
  }).then(() => {
    if(typeof showPushNotificationSuccessMessage === "function"){
      showPushNotificationSuccessMessage();
    }
    togglePushNotificationsModalHandler(false);
  });
}

export async function setMap(
  eventId,
  locationRegion){
  const user = auth.currentUser;
  const uid = user.uid;  
  getEventLocationByEventId(eventId).then((location) => {
    if(location.length > 0){
      updateDoc(doc(db, "location", location[0].id), {
        location: locationRegion,
      })
    } else {
      addDoc(collection(db, "location"), {
        eventId: eventId,
        location: locationRegion,
      })
    }
  })
}

export async function setEmails(
  emailSubject,
  email,
  eventId,
  receiverId,
  emailsRetrieved,
  setEmail,
  setEmailSubject){
  
  const user = auth.currentUser;
  const uid = user.uid;  
  
  addDoc(collection(db, "mails"), {
    emailSubject: emailSubject,
    email: email,
    eventId: eventId,
    receiverId: receiverId,
    senderId: uid,
    answer:'',
    date: new Date(),
    usersIds: [receiverId, uid]
  }).then(() =>{
    getEmailsByUserIdForSender(emailsRetrieved, eventId);
    setEmailSubject('',)
    setEmail('');
  });
}

export async function setAnswerBySender(
  answer,
  currentMailId,
  setAnswer,
  setMailAnswered){
  const docRef = doc(db, "mails", currentMailId);
  const user = auth.currentUser;
  const uid = user.uid;  
  updateDoc(docRef, {
    answer: answer,
  })
  .then(() =>{
    setAnswer(answer);
    setMailAnswered(true);
  });
}

export async function setLocationDetailsForEvent(
  locationDetails, 
  cityDetails,
  eventId
){
  addDoc(collection(db, "locationDetails"), {
    locationDetails: locationDetails,
    cityDetails: cityDetails,
    eventId: eventId,
  })
}