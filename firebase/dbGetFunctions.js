import { db, auth } from './firebase-config';
import { collection, doc, getDocs, getDoc, orderBy, query, where, limit, updateDoc } from "firebase/firestore";
import { setReviews } from './dbSetFunctions';

export async function getAgenda(agendaRetrieved, eventId){
    var agendaList = []
    const querySnapshot = await getDocs(query(collection(db, "agenda"), where("eventId", "==", eventId), orderBy("agendaTime")));
    querySnapshot.forEach((doc) => {
        const agendaDoc = doc.data()
        agendaDoc.id = doc.id
        agendaList.push(agendaDoc)
    })
    agendaRetrieved(agendaList);
}

export async function getAgendaForAgendaItemsScreen(eventId){
    var agendaList = []
    const querySnapshot = await getDocs(query(collection(db, "agenda"), where("eventId", "==", eventId), orderBy("agendaTime")));
    querySnapshot.forEach((doc) => {
        const agendaDoc = doc.data()
        agendaDoc.id = doc.id
        agendaList.push(agendaDoc)
    })
    return agendaList;
}

export async function getEvents(eventsRetrieved){
    var eventsList = []
    const querySnapshot = await getDocs(collection(db, "events"));
    querySnapshot.forEach((doc) => {
        const eventsDoc = doc.data()
        eventsDoc.id = doc.id
        eventsList.push(eventsDoc)
    })
    eventsRetrieved(eventsList)
}

export async function getEventByEventIdForEdit(editEventRetrieved, eventId){
    const querySnapshot = await getDoc(doc(db, "events", eventId));
    editEventRetrieved(querySnapshot.data())
}

export async function getAvailableEvents(availableEventsRetrieved){
    var availableEventsList = []
    var userJoinedEventsIdsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    await getDocs(query(collection(db, "participants"), where ("userId", "==", uid)))
    .then( async (response) => {
        response.forEach((doc) => {
            userJoinedEventsIdsList.push(doc.data().eventId)
        })
        await getDocs(query(collection(db, "events"), where("adminId", "==", uid)))
            .then( async (response) => {
                response.forEach((doc) => {
                    userJoinedEventsIdsList.push(doc.id)
                })
                setTimeout( async () => {
                    if(userJoinedEventsIdsList.length != 0 ){
                        const userJoinedEventsQuerySnapshot = await getDocs(query(collection(db, "events"), where ("__name__", "not-in", userJoinedEventsIdsList), where("isExpired", "==", false), where("eventType", "==", "publicEvent")))
                        userJoinedEventsQuerySnapshot.forEach((doc) => {
                            const availableEventsDoc = doc.data()
                            availableEventsDoc.id = doc.id
                            if( availableEventsDoc.eventEndDate > new Date() && availableEventsDoc.isExpired === false){
                                availableEventsDoc.isExpired=true
                                setIsExpired(availableEventsDoc.id)
                            }
                            availableEventsList.push(availableEventsDoc);
                        })} else {
                            const userJoinedEventsQuerySnapshot = await getDocs(query(collection(db, "events"), where("isExpired", "==", false), where("eventType", "==", "publicEvent")))
                            userJoinedEventsQuerySnapshot.forEach((doc) => {
                            const availableEventsDoc = doc.data()
                            availableEventsDoc.id = doc.id
                            if( availableEventsDoc.eventEndDate > new Date() && availableEventsDoc.isExpired === false){
                                availableEventsDoc.isExpired=true
                                setIsExpired(availableEventsDoc.id)
                            }
                            availableEventsList.push(availableEventsDoc);
                        })}

                    availableEventsRetrieved(availableEventsList)
                }, 500)
            })
    })
}

export async function setIsExpired(eventId){
    updateDoc(doc(db, "events", eventId), {
        isExpired: true,
      })
}

export async function getConferences(eventsRetrieved){
    var conferencesList = []
    const querySnapshot = await getDocs(query(collection(db, "events"), where("eventType", "==", "conference"), where("isExpired", "==", false)));
    querySnapshot.forEach((doc) => {
        const conferencesDoc = doc.data()
        conferencesDoc.id = doc.id
        if( conferencesDoc.eventEndDate > new Date() && conferencesDoc.isExpired === false){
            conferencesDoc.isExpired=true
            setIsExpired(conferencesDoc.id)
        }
        conferencesList.push(conferencesDoc)
    })
    eventsRetrieved(conferencesList)
}

export async function getCreatedEvents(createdEventsRetrieved){
    var createdEventsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const querySnapshot = await getDocs(query(collection(db, "events"), where("adminId", "==", uid), where("isExpired", "==", false)));
    querySnapshot.forEach((doc) => {
        const createdEventsDoc = doc.data()
        createdEventsDoc.id = doc.id
        if( createdEventsDoc.eventEndDate > new Date() && createdEventsDoc.isExpired === false){
            createdEventsDoc.isExpired=true
            setIsExpired(createdEventsDoc.id)
        }
        createdEventsList.push(createdEventsDoc)  
    })
    createdEventsRetrieved(createdEventsList)
}

export async function getExpiredEventsWhereUserIsParticipant(userJoinedEventsIdsList) {
    const expiredEventsList = [];
    const userJoinedEventsQuerySnapshot = await getDocs(query(collection(db, "events"), where ("__name__", "in", userJoinedEventsIdsList), where("isExpired", "==", true)))
    userJoinedEventsQuerySnapshot.forEach((doc) => {
        const expiredEventsDoc = doc.data()
        expiredEventsDoc.id = doc.id
        if( expiredEventsDoc.eventEndDate > new Date() && expiredEventsDoc.isExpired === false){
            expiredEventsDoc.isExpired=true
            setIsExpired(expiredEventsDoc.id)
        }
        expiredEventsList.push(expiredEventsDoc)
    })
    return expiredEventsList;
}

export async function getExpiredEventsWhereUserIsAdmin(expiredEventsList) {
    const user = auth.currentUser;
    const uid = user.uid;
    const userCreatedEventsList = await getDocs(query(collection(db, "events"), where("adminId", "==", uid), where("isExpired", "==", true)));
    userCreatedEventsList.forEach((doc) => {
        const createdEventsDoc = doc.data()
        createdEventsDoc.id = doc.id
        if( createdEventsDoc.eventEndDate > new Date() && createdEventsDoc.isExpired === false){
            createdEventsDoc.isExpired=true
            setIsExpired(createdEventsDoc.id)
        }
        if(!expiredEventsList.some(e => e.id === doc.id)){
            expiredEventsList.push(createdEventsDoc);
        }
    })
    return expiredEventsList;
}

export async function getExpiredEvents(expiredEventsRetrieved){
    var expiredEventsList = []
    var userJoinedEventsIdsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    await getDocs(query(collection(db, "participants"), where ("userId", "==", uid)))
    .then( async (response) => {
        response.forEach((doc) => {
            userJoinedEventsIdsList.push(doc.data().eventId)
        })
        if(userJoinedEventsIdsList.length != 0){
            expiredEventsList = await getExpiredEventsWhereUserIsParticipant (userJoinedEventsIdsList);
            expiredEventsList = await getExpiredEventsWhereUserIsAdmin(expiredEventsList);
        }
        expiredEventsRetrieved(expiredEventsList)
    })
}

export async function getJoinedEvents(joinedEventsRetrieved){
    var joinedEventsList = []
    var userJoinedEventsIdsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    await getDocs(query(collection(db, "participants"), where ("userId", "==", uid)))
    .then( async (response) => {
        response.forEach((doc) => {
            userJoinedEventsIdsList.push(doc.data().eventId);
        })
        setTimeout( async () => {
            if(userJoinedEventsIdsList.length != 0){
                const userJoinedEventsQuerySnapshot = await getDocs(query(collection(db, "events"), where ("__name__", "in", userJoinedEventsIdsList), where("isExpired", "==", false)))
                userJoinedEventsQuerySnapshot.forEach((doc) => {
                    const joinedEventsDoc = doc.data();
                    joinedEventsDoc.id = doc.id;
                    if(joinedEventsDoc.adminId === uid){
                        return;
                    }
                    if( joinedEventsDoc.eventEndDate > new Date() && joinedEventsDoc.isExpired === false){
                        joinedEventsDoc.isExpired=true;
                        setIsExpired(joinedEventsDoc.id);
                    }
                    joinedEventsList.push(joinedEventsDoc);
            })}
            joinedEventsRetrieved(joinedEventsList);
        }, 500);
    })
}

export async function getuserJoinedEvents(userJoinedEventsIdsList){
    const user = auth.currentUser;
    const uid = user.uid;
    const eventList = [];
    const userJoinedEventsQuerySnapshot = await getDocs(query(collection(db, "events"), where ("__name__", "in", userJoinedEventsIdsList), where("isExpired", "==", false)))
    userJoinedEventsQuerySnapshot.forEach((doc) => {
        const joinedEventsDoc = doc.data();
        joinedEventsDoc.id = doc.id;
        eventList.push(joinedEventsDoc);
    })
    return eventList;
}

export async function getUserCreatedEvents(allJoinedEventsList) {
    const user = auth.currentUser;
    const uid = user.uid;
    const userCreatedEventsQuerySnapshot = await getDocs(query(collection(db, "events"), where("adminId", "==", uid), where("isExpired", "==", false)))
    userCreatedEventsQuerySnapshot.forEach((doc) => {
        const createdEventsDoc = doc.data()
        createdEventsDoc.id = doc.id
        if(!allJoinedEventsList.some(e => e.id === doc.id)){
            allJoinedEventsList.push(createdEventsDoc);
        }
    })
    return allJoinedEventsList;
}

export async function getEventsWhereUserParticipate(){
    var allJoinedEventsList = []
    var userJoinedEventsIdsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const returnValue = await getDocs(query(collection(db, "participants"), where ("userId", "==", uid)))
    .then( async (response) => {
        response.forEach((doc) => {
            userJoinedEventsIdsList.push(doc.data().eventId)
        })
        if(userJoinedEventsIdsList.length != 0){
            allJoinedEventsList = await getuserJoinedEvents(userJoinedEventsIdsList);
            return allJoinedEventsList = await getUserCreatedEvents(allJoinedEventsList)
        }
    }) 
    return returnValue;
}

export async function getProfile(profileRetrieved){
    var profileList = []
    const user = auth.currentUser;
    const uid = user.uid;  
    const querySnapshot = await getDocs(query(collection(db, "users"), where("userUid", "==", uid)));
    querySnapshot.forEach((doc) => {
        const profileDoc = doc.data()
        profileDoc.id = doc.id
        profileList.push(profileDoc)
    })
    profileRetrieved(profileList)
}

export async function getProfileById(userId){
    var profileList = []
    const querySnapshot = await getDocs(query(collection(db, "users"), where("__name__", "==", userId)));
    querySnapshot.forEach((doc) => {
        const profileDoc = doc.data()
        profileDoc.id = doc.id
        profileList.push(profileDoc)
    })
    return profileList;
}

export async function getPosts(postsRetrieved, selectedEventId){
    var postsList = []
    const querySnapshot = await getDocs(query(collection(db, "posts"), where("eventId", "==", selectedEventId), orderBy("date", "desc")));
    querySnapshot.forEach( async (doc) => {
        const postsDoc = doc.data()
        postsDoc.id = doc.id
        await getProfileById(postsDoc.userId)
        .then((userProfile) => {
            postsDoc.userDetails = userProfile[0]
            postsList.push(postsDoc)
        })
    });
    setTimeout( () => {
        postsRetrieved(postsList)
}, 1000 )
}

export async function getComments(commentsRetrieved, postId){
    var commentsList = []
    const querySnapshot = await getDocs(query(collection(db, "comments"), where("postId", "==", postId), orderBy("date", "desc")));
    querySnapshot.forEach( async (doc) => {
        const commentsDoc = doc.data()
        commentsDoc.id = doc.id
        await getProfileById(commentsDoc.userId)
        .then((userProfile) => {
            commentsDoc.userDetails = userProfile[0]
            commentsList.push(commentsDoc)
        })
    });
    setTimeout( () => {
        commentsRetrieved(commentsList)
}, 1000 )
}
export async function getLike(postId, userId){
    var likeList = []
    const querySnapshot = await getDocs(query(collection(db, "likes"), where("postId", "==", postId), where("userId", "==", userId)));
    querySnapshot.forEach((doc) => {
        const likeDoc = doc.data()
        likeDoc.id = doc.id
        likeList.push(likeDoc)
    });
    return likeList;
}

export async function getParticipants(participantsRetrieved, eventId){
    const user = auth.currentUser;
    const uid = user.uid;
    var participantsList = []
    const querySnapshot = await getDocs(query(collection(db, "participants"), where("eventId", "==", eventId)));
    querySnapshot.forEach(async (doc) => {
        const participantsDoc = doc.data()
        participantsDoc.id = doc.id
        await getProfileById(participantsDoc.userId)
        .then( async (userProfile) => {
            participantsDoc.userDetails = userProfile[0]
            participantsList.push(participantsDoc)
        })
    });

    setTimeout( () => {
        participantsRetrieved(participantsList)
    }, 1000 )
}

export async function getParticipantsById(userId, eventId){
    var participantsList = []
    const querySnapshot = await getDocs(query(collection(db, "participants"), where("userId", "==", userId), where("eventId", "==", eventId)));
    querySnapshot.forEach(async (doc) => {
        const participantsDoc = doc.data()
        participantsDoc.id = doc.id
        participantsList.push(participantsDoc)
    });
    return participantsList
    
}

export async function getEventsParticipations(userId){
    var participantsList = []
    const querySnapshot = await getDocs(query(collection(db, "participants"), where("userId", "==", userId)));
    querySnapshot.forEach(async (doc) => {
        const participantsDoc = doc.data()
        participantsDoc.id = doc.id
        participantsList.push(participantsDoc)
    });
    return participantsList
    
}

export async function getSpeakers(speakersRetrieved, eventId){
    var speakersList = []
    const querySnapshot = await getDocs(query(collection(db, "speakers"), where("eventId", "==", eventId)));
    querySnapshot.forEach( async (doc) => {
        const speakersDoc = doc.data()
        speakersDoc.id = doc.id
        await getProfileById(speakersDoc.speakerId)
        .then((userProfile) => {
            speakersDoc.userDetails = userProfile[0]
            speakersList.push(speakersDoc)
        })
    });

    setTimeout( () => {
        speakersRetrieved(speakersList)
    }, 1000 )
}

export async function getReviewers(reviewersRetrieved, eventId){
    var reviewersList = []
    const querySnapshot = await getDocs(query(collection(db, "reviewers"), where("eventId", "==", eventId)));
    querySnapshot.forEach( async (doc) => {
        const reviewersDoc = doc.data()
        reviewersDoc.id = doc.id
        await getProfileById(reviewersDoc.reviewerId)
        .then((userProfile) => {
            reviewersDoc.userDetails = userProfile[0]
            reviewersList.push(reviewersDoc)
        })
    });
    setTimeout( () => {
        reviewersRetrieved(reviewersList)
    }, 1000 )
}

export async function getRandom3Reviewers(eventId, setReviewersList){
    var reviewersList = []
    const querySnapshot = await getDocs(query(collection(db, "reviewers"), where("eventId", "==", eventId)));
    querySnapshot.forEach( async (doc) => {
        const reviewerDoc = doc.data()
        reviewerDoc.id = doc.id
        await getProfileById(reviewerDoc.reviewerId)
        .then((userProfile) => {
            reviewerDoc.userDetails = userProfile[0]
            reviewersList.push(reviewerDoc)
        })
    });
    setTimeout( () => {
        setReviewersList(reviewersList);
    }, 1000 )
}

export async function getAuthors(authorsRetrieved, eventId){
    var authorsList = []
    const querySnapshot = await getDocs(query(collection(db, "authors"), where("eventId", "==", eventId)));
    querySnapshot.forEach( async (doc) => {
        const authorsDoc = doc.data()
        authorsDoc.id = doc.id
        await getProfileById(authorsDoc.authorId)
        .then((userProfile) => {
            authorsDoc.userDetails = userProfile[0]
            authorsList.push(authorsDoc)
        })
    });
    setTimeout( () => {
        authorsRetrieved(authorsList)
    }, 1000 )
}

export async function getUserByEmail(userEmail){
    var usersList = []
    const querySnapshot = await getDocs(query(collection(db, "users"), where("userEmail", "==", userEmail)));
    querySnapshot.forEach((doc) => {
        const usersDoc = doc.data()
        usersDoc.id = doc.id
        usersList.push(usersDoc)
    });
    return usersList
}

export async function getUserByUid(){
    const user = auth.currentUser;
    const uid = user.uid;
    var usersList = []
    const querySnapshot = await getDocs(query(collection(db, "users"), where("userUid", "==", uid)));
    querySnapshot.forEach((doc) => {
        const usersDoc = doc.data()
        usersDoc.id = doc.id
        usersList.push(usersDoc)
    });
    return usersList
}

export async function getAllPolls(allPollsRetrieved, eventId){
    var allPollsList = []
    const querySnapshot = await getDocs(query(collection(db, "polls"), where("eventId", "==", eventId)));
    querySnapshot.forEach((doc) => {
        const allPollsDoc = doc.data()
        allPollsDoc.id = doc.id
        allPollsList.push(allPollsDoc)
    });
    allPollsRetrieved(allPollsList)
}

export async function getPoll(pollRetrieved, setPollAnswered, currentPollId){
    var pollList = []
    getAnsweredPoll(currentPollId).then( async (isPollAnswered) => {
        if(!isPollAnswered){
            const querySnapshot = await getDocs(query(collection(db, "polls"), where("__name__", "==", currentPollId)));
            querySnapshot.forEach((doc) => {
                const pollDoc = doc.data()
                pollDoc.id = doc.id
                pollList.push(pollDoc)
            });
            pollRetrieved(pollList)
        } else {
            setPollAnswered(true);
        }
    });
}
export async function getPollResult(pollResultRetrieved, currentPollId){
    var pollResultList = []
    getAnsweredPoll(currentPollId).then( async () => {
        const querySnapshot = await getDocs(query(collection(db, "polls"), where("__name__", "==", currentPollId)));
        querySnapshot.forEach((doc) => {
            const pollResultDoc = doc.data()
            pollResultDoc.id = doc.id
            pollResultList.push(pollResultDoc)
        });
        pollResultRetrieved(pollResultList)
    });
}

export async function getAnsweredPoll(currentPollId){
    var answeredPollList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const querySnapshot = await getDocs(query(collection(db, "answeredPolls"), where("pollId", "==", currentPollId), where("userId", "==", uid)));
    querySnapshot.forEach((doc) => {
        const answeredPollDoc = doc.data()
        answeredPollDoc.id = doc.id
        answeredPollList.push(answeredPollDoc)
    });
    if (answeredPollList.length !== 0){
        return true;
    }
    return false;
}

export async function getQuestionsForSpeaker(questionsRetrieved, eventId, speakerId){
    var questionsList = []
    const querySnapshot = await getDocs(query(collection(db, "speakerQuestions"), where("eventId", "==", eventId), where("speakerId", "==", speakerId), orderBy("date", "desc")));
    querySnapshot.forEach((doc) => {
        const questionsDoc = doc.data()
        questionsDoc.id = doc.id
        questionsList.push(questionsDoc)
    });
    questionsRetrieved(questionsList)
}

export async function getQuestionsBySpeakerId(questionsRetrieved, eventId){
    var questionsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const querySnapshot = await getDocs(query(collection(db, "speakerQuestions"), where("eventId", "==", eventId), where("speakerId", "==", uid )));
    querySnapshot.forEach( async (doc) => {
        const questionsDoc = doc.data()
        questionsDoc.id = doc.id
        await getProfileById(questionsDoc.userId)
        .then((userProfile) => {
            questionsDoc.userDetails = userProfile[0]
            questionsList.push(questionsDoc)
        })
    });
    setTimeout( () => {
        questionsRetrieved(questionsList)
    }, 1000 )
}

export async function getPapersForCurrentAuthor(papersRetrieved, eventId){
    var papersList = []
    var reviewsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    getDocs(query(collection(db, "authorsPapers"), where("eventId", "==", eventId), where("userId", "==", uid)))
    .then((authorsPapersResponse) => {
        authorsPapersResponse.forEach((doc) => {
            const papersDoc = doc.data()
            papersDoc.id = doc.id
            papersList.push(papersDoc)
        });

        setTimeout( async () => {
            await getPapersReviewsForCurrentAuthor(eventId).then((papersReviewsResponse) => {
                papersReviewsResponse.forEach((papersReview) => {
                });
                papersList.forEach((paper) => {
                    papersReviewsResponse.forEach((review) => {
                        if(review.paperId === paper.id){
                            paper.reviewContentText1 = review.review1Text;
                            paper.reviewContentText2 = review.review2Text;
                            paper.reviewContentText3 = review.review3Text;
                        }
                    });
                });
            })
            papersRetrieved(papersList);
        }, 500)
    })
}

export async function getPapersReviewsForCurrentAuthor(eventId){
    var reviewsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const querySnapshot = await getDocs(query(collection(db, "paperReviews"), where("eventId", "==", eventId)))
    querySnapshot.forEach((doc) => {
        const papersReviewsDoc = doc.data()
        papersReviewsDoc.id = doc.id
        reviewsList.push(papersReviewsDoc)
    });
    return reviewsList
}

export async function getMyReviewForCurrentPaper(currentPaperId){
    var reviewsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const querySnapshot = await getDocs(query(collection(db, "paperReviews"), where("paperId", "==", currentPaperId), where("reviewerId", "==", uid)))
    querySnapshot.forEach((doc) => {
        const papersReviewsDoc = doc.data()
        papersReviewsDoc.id = doc.id
        reviewsList.push(papersReviewsDoc)
    });
    return reviewsList
}

export async function getCurrentReviewToDisplay(papersRetrieved, currentPaperId){
    var reviewsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const querySnapshot = await getDocs(query(collection(db, "paperReviews"), where("paperId", "==", currentPaperId), where("reviewerId", "==", uid)))
    querySnapshot.forEach((doc) => {
        const papersReviewsDoc = doc.data()
        papersReviewsDoc.id = doc.id
        reviewsList.push(papersReviewsDoc)
    });
    setTimeout( () => {
        papersRetrieved(reviewsList)
    }, 1000 )
}

export async function getMyReviews(eventId){
    var reviewsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const querySnapshot = await getDocs(query(collection(db, "paperReviews"), where("eventId", "==", eventId), where("reviewerId", "==", uid)))
    querySnapshot.forEach((doc) => {
        const papersReviewsDoc = doc.data()
        papersReviewsDoc.id = doc.id
        reviewsList.push(papersReviewsDoc)
    });
    return reviewsList
}

export async function getPapersForUsers(papersRetrieved, eventId){
    var papersList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const querySnapshot = await getDocs(query(collection(db, "authorsPapers"), where("eventId", "==", eventId), where("isRecommendationYes", "==", true), where("finalVersion", "==", true)));
    querySnapshot.forEach( async (doc) => {
        const papersDoc = doc.data()
        papersDoc.id = doc.id
        await getProfileById(papersDoc.userId)
        .then((userProfile) => {
            papersDoc.userDetails = userProfile[0]
            papersList.push(papersDoc)
        })
    });
    setTimeout( () => {
        papersRetrieved(papersList)
    }, 1000 )
}


export async function getAuthorsPapersToFillLimit(eventId, limitNumber) {
    return getDocs(query(collection(db, "authorsPapers"), where("eventId", "==", eventId), where("neverReviewed", "==", true), limit(limitNumber)));
}


export async function getAuthorsPaper(eventId, paperId) {
    return getDocs(query(collection(db, "authorsPapers"), where("eventId", "==", eventId), where("__name__", "==", paperId)));
}


export async function getPapersForReview(papersRetrieved, eventId){
    var papersForReviewsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    getMyReviews(eventId).then( async (reviewsList) => {
        if (reviewsList.length > 0){
            if(reviewsList.length !== 3 && reviewsList.length < 3){
                const limit = 3 - reviewsList.length;
                const authorsPapersToFillLimit = await getAuthorsPapersToFillLimit(eventId, limit);
                authorsPapersToFillLimit.forEach( async(doc) => {
                    const papersDoc = doc.data()
                    papersDoc.id = doc.id
                    if(reviewsList.some(e => e.id === papersDoc.id)){
                        return;
                    }
                    papersDoc.myReview1 = '';
                    papersDoc.myReview2 = '';
                    papersDoc.myReview3 = '';
                    papersForReviewsList.push(papersDoc)
                    setReviews(eventId, doc.id);
                });
                reviewsList.forEach( async (doc) => { 
                    const authorsPapersResponse = await getAuthorsPaper(eventId, doc.paperId);
                    authorsPapersResponse.forEach( async (doc) => {
                        const myReview = await getMyReviewForCurrentPaper(doc.id);
                        const papersDoc = doc.data()
                        papersDoc.id = doc.id
                        if (myReview.length > 0){
                            papersDoc.myReview1 = myReview[0].review1Text;
                            papersDoc.myReview2 = myReview[0].review2Text;
                            papersDoc.myReview3 = myReview[0].review3Text;
                        }
                        if(!papersForReviewsList.some(e => e.id === doc.id)){
                            papersForReviewsList.push(papersDoc);
                        }
                    });
                });

                setTimeout( () => {
                    papersRetrieved(papersForReviewsList);
                }, 1500)
            } else {
                reviewsList.forEach( async (doc) => {
                    getDocs(query(collection(db, "authorsPapers"), where("eventId", "==", eventId), where("__name__", "==", doc.paperId)))
                    .then((authorsPapersResponse) => {
                        authorsPapersResponse.forEach( async (doc) => {
                            const myReview = await getMyReviewForCurrentPaper(doc.id);
                            const papersDoc = doc.data()
                            papersDoc.id = doc.id
                            if (myReview.length > 0){
                                papersDoc.myReview1 = myReview[0].review1Text;
                                papersDoc.myReview2 = myReview[0].review2Text;
                                papersDoc.myReview3 = myReview[0].review3Text;
                            }
                            papersForReviewsList.push(papersDoc)
                        });
                    })
                });
                setTimeout( async () => {
                    papersRetrieved(papersForReviewsList);
                }, 1000)
            }

        } else {
            getDocs(query(collection(db, "authorsPapers"), where("eventId", "==", eventId), where("neverReviewed", "==", true), limit(3)))
            .then((authorsPapersResponse) => {
                authorsPapersResponse.forEach( async (doc) => {
                    const papersDoc = doc.data()
                    papersDoc.id = doc.id
                    papersForReviewsList.push(papersDoc)
                });
                setTimeout(() => {
                    papersRetrieved(papersForReviewsList);
                    papersForReviewsList.forEach( async (paper) => {
                        setReviews(eventId, paper.id);
                    })
                }, 500)
            })
        }
    }) 
}

export async function getNotesByUserId(notesRetrieved, eventId){
    var notesList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const querySnapshot = await getDocs(query(collection(db, "notes"), where("eventId", "==", eventId), where("userId", "==", uid )));
    querySnapshot.forEach( async (doc) => {
        const notesDoc = doc.data()
        notesDoc.id = doc.id
        await getProfileById(notesDoc.userId)
        .then((userProfile) => {
            notesDoc.userDetails = userProfile[0]
            notesList.push(notesDoc)
        })
    });
    setTimeout( () => {
        notesRetrieved(notesList)
    }, 1000 )
}

export async function getMessagesFromDb(messagesRetrieved, eventId, senderUserId, receiverUserId){
    var messagesList = []
    const querySnapshot = await getDocs(query(collection(db, "chat"), where("eventId", "==", eventId), where("usersArray", "array-contains", senderUserId)))
    querySnapshot.forEach((doc) => {
        const messagesDoc = doc.data()
        messagesDoc.id = doc.id
        if(messagesDoc.usersArray.includes(receiverUserId)){
            messagesList.push(messagesDoc)
        }
    })
    messagesRetrieved(messagesList);
}

export async function getMessagesForCurrentChat(eventId, senderUserId, receiverUserId){
    var messagesList = []
    const querySnapshot = await getDocs(query(collection(db, "chat"), where("eventId", "==", eventId), where("usersArray", "array-contains", senderUserId)));
    querySnapshot.forEach((doc) => {
        const messagesDoc = doc.data()
        messagesDoc.id = doc.id
        if(messagesDoc.usersArray.includes(receiverUserId)){
            messagesList.push(messagesDoc)
        }
    });
    return messagesList
}

export async function getEventLocation(locationRetrieved, eventId){
    var locationList = []
    const querySnapshot = await getDocs(query(collection(db, "location"), where("eventId", "==", eventId)))
    querySnapshot.forEach((doc) => {
        const locationDoc = doc.data()
        locationDoc.id = doc.id
        locationList.push(locationDoc)
    })
    setTimeout( () => {
        locationRetrieved(locationList);
    }, 500 )
}

export async function getEventLocationDetails(locationDetailsRetrieved, eventId){
    var locationDetailsList = []
    const querySnapshot = await getDocs(query(collection(db, "locationDetails"), where("eventId", "==", eventId)))
    querySnapshot.forEach((doc) => {
        const locationDetailsDoc = doc.data()
        locationDetailsDoc.id = doc.id
        locationDetailsList.push(locationDetailsDoc)
    })
    setTimeout( () => {
        locationDetailsRetrieved(locationDetailsList);
    }, 500 )
}

export async function getEventLocationByEventId(eventId){
    var locationList = []
    const querySnapshot = await getDocs(query(collection(db, "location"), where("eventId", "==", eventId)))
    querySnapshot.forEach((doc) => {
        const locationDoc = doc.data()
        locationDoc.id = doc.id
        locationList.push(locationDoc)
    })
    return locationList;
}

export async function getPollsStatistics(statisticsRetrieved, eventId, currentPollId){
    var statisticsList = []
    const querySnapshot = await getDocs(query(collection(db, "polls"), where("eventId", "==", eventId), where("__name__", "==", currentPollId)))
    querySnapshot.forEach((doc) => {
        const statisticsDoc = doc.data()
        statisticsDoc.id = doc.id
        statisticsList.push(statisticsDoc)
    })
        statisticsRetrieved(statisticsList);
}

export async function getParticipantsStatistics(statisticsRetrieved, eventId){
    var statisticsList = []
    const querySnapshot = await getDocs(query(collection(db, "events"), where("__name__", "==", eventId)))
    querySnapshot.forEach((doc) => {
        const statisticsDoc = doc.data()
        statisticsDoc.id = doc.id
        statisticsList.push(statisticsDoc)
    })
    setTimeout( () => {
        statisticsRetrieved(statisticsList);
    }, 1000 )
}

export async function getEmailsByUserIdForReceiver(emailsRetrieved, eventId){
    var mailsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const querySnapshot = await getDocs(query(collection(db, "mails"), where("eventId", "==", eventId), where("receiverId", "==", uid ), orderBy("date", "desc")));
    querySnapshot.forEach( async (doc) => {
        const mailsDoc = doc.data()
        mailsDoc.id = doc.id
        await getProfileById(mailsDoc.senderId)
        .then((userProfile) => {
            mailsDoc.userDetails = userProfile[0]
            mailsList.push(mailsDoc)
        })
    });
    setTimeout( () => {
        emailsRetrieved(mailsList)
    }, 1000 )
}

export async function getEmailsByUserIdForSender(emailsRetrieved, eventId){
    var mailsList = []
    const user = auth.currentUser;
    const uid = user.uid;
    const querySnapshot = await getDocs(query(collection(db, "mails"), where("eventId", "==", eventId), where("senderId", "==", uid ), orderBy("date")));
    querySnapshot.forEach( async (doc) => {
        const mailsDoc = doc.data()
        mailsDoc.id = doc.id
        await getProfileById(mailsDoc.senderId)
        .then((userProfile) => {
            mailsDoc.userDetails = userProfile[0]
            mailsList.push(mailsDoc)
        })
    });
    setTimeout( () => {
        emailsRetrieved(mailsList)
    }, 1000 )
}

export async function getEmailsForCurrentUsers(emailsRetrieved, eventId, currentUserId, receiverId){
    var mailsList = []
    const querySnapshot = await getDocs(query(collection(db, "mails"), where("eventId", "==", eventId), where("usersIds", "array-contains", currentUserId), orderBy("date", "desc")));
    querySnapshot.forEach( async (doc) => {
        const mailsDoc = doc.data()
        mailsDoc.id = doc.id
        if(mailsDoc.usersIds.includes(receiverId)){
            mailsList.push(mailsDoc)
        }
    });
    emailsRetrieved(mailsList)
}