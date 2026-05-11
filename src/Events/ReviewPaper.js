import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { auth } from '../../firebase/firebase-config';
import * as WebBrowser from 'expo-web-browser';
import { setUpdateReviews } from '../../firebase/dbSetFunctions';
import { getProfileById, getCurrentReviewToDisplay } from '../../firebase/dbGetFunctions';
import SendCommentIcon from 'react-native-vector-icons/FontAwesome';
import PushNotificationService from '../PushNotificationsService/PushNotificationsService';
import { RadioButton } from 'react-native-paper';
import RadioGroup from 'react-native-radio-buttons-group';

const ReviewPaper = (props) => {

    const user = auth.currentUser;
    const uid = user.uid;
    const eventId = props.route.params.eventId;    
    const currentPaperId = props.route.params.paper.selectedCurrentPaperId;
    const paperTitle = props.route.params.paper.selectedPaperTitle;
    const paperURL = props.route.params.paper.selectedPaperURL;
    const paperFileName = props.route.params.paper.selectedPaperFileName;
    const review1Text = props.route.params.paper.selectedReview1Text;
    const review2Text = props.route.params.paper.selectedReview2Text;
    const review3Text = props.route.params.paper.selectedReview3Text;
    const authorId = props.route.params.paper.selectedAuthorId;
    const reviewCounter = props.route.params.paper.selectedReviewCounter;
    const isReviewed = props.route.params.paper.selectedIsReviewed;

    const [papersForReviewsList, setPapersForReviewsList] = useState([]);
    const [ reviewsObj, setReviewsObj] = useState({});
    const [checked, setChecked] = React.useState('first');
    const [isTopicFollowed, setIsTopicFollowed] = useState();
    const [isStructureFollowed, setIsStructureFollowed] = useState();
    const [areReferencesRelevant, setAreReferencesRelevant] = useState();
    const [isRecommendationYes, setIsRecommendationYes] = useState(false);
    const [isRecommendationReview, setIsRecommendationReview] = useState(false);
    const [isRecommendationNo, setIsRecommendationNo] = useState(false);

    useEffect(() => {
        getData()
    }, [])

    function getData(){
      getCurrentReviewToDisplay(papersRetrieved, currentPaperId);
        props.navigation.addListener(
          'focus',
          payload => {
            getCurrentReviewToDisplay(papersRetrieved, currentPaperId);
          }
      )
    };

    function papersRetrieved(papersForReviewsList){
      setPapersForReviewsList(papersForReviewsList);
    };

    async function addReview(currentPaperId, authorId, paperTitle, reviewCounter){
      await setUpdateReviews(
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
      sendPushToAuthors);
      props.navigation.navigate('Timeline', {eventId});
    }

    function sendPushToAuthors(authorId, paperTitle) {
      getProfileById(authorId).then((author) => {
        const authorToken = author[0].pushToken;
        const title = 'Feedback received for paper: ' + paperTitle;
        const body = 'You have to update your paper!'
        PushNotificationService.sendPushNotification(
          authorToken,
          title,
          body,
          {
            type: 'updateDocument',
            paperTitle: paperTitle,
          }
        );
      })
    }

    const radioButtons = useMemo(() => ([
      {
          id: '1',
          label: 'Y - Suitable to be published',
          value: 'option1',
          color: '#0782F9',
          size: 21,
      },
      {
          id: '2',
          label: 'R - Suitable for publishing after corrections',
          value: 'option2',
          color: '#0782F9',
          size: 21,
      },
      {
          id: '3',
          label: 'N - Not suitable for publishing',
          value: 'option3',
          color: '#0782F9',
          size: 21,
      }
    ]), []);

    const [selectedId, setSelectedId] = useState();

    return (
      <React.Fragment>
          { JSON.stringify(papersForReviewsList) !== JSON.stringify([]) ?
              <ScrollView style={styles.container}>
                <View style={styles.questionsContainer}>
                    <View style={styles.eachReview}>
                      <TouchableOpacity activeOpacity={0.9} style={styles.item}> 
                          <Text>
                            <Text style={styles.item2nd}>Title: </Text>
                            <Text style={styles.item2nd}>{paperTitle}</Text>
                          </Text>
                          
                          <TouchableOpacity onPress={()=>{WebBrowser.openBrowserAsync(paperURL)}} >
                            <Text>
                              <Text style={styles.item2nd}>Open paper: </Text>
                              <Text style={styles.itemFile}>{paperFileName}</Text>
                            </Text>
                          </TouchableOpacity>
                          { review1Text ?
                            <Text style={styles.item3rd}>Review 1: {review1Text}</Text>
                          : null
                          }
                          { review2Text ?
                            <View>
                              <Text style={styles.item2nd}>Review 2: {review2Text}</Text>
                            </View>
                          : null
                          }
                          { review3Text ?
                            <View>
                              <Text style={styles.item2nd}>Review 3: {review3Text}</Text>
                            </View>
                          : null
                          }
                      </TouchableOpacity>
        
                      { !isReviewed && reviewCounter < 3 ?
                      <View style={styles.secondContainer}>
                          <View style={styles.radioButtonContainer}>
                            <Text style={styles.item2nd}>Topic</Text>

                              <View style={styles.radioButton}>
                                <RadioButton
                                  value={true}
                                  status={ isTopicFollowed === true ? 'checked' : 'unchecked' }
                                  onPress={() => setIsTopicFollowed(true)}
                                  color='#0782F9'
                                  uncheckedColor='#0782F9'
                                />
                                <Text style={styles.itemFile}>Yes</Text>
                              </View>
                              <View style={styles.radioButton}>
                                <RadioButton
                                  value={false}
                                  status={ isTopicFollowed === false ? 'checked' : 'unchecked' }
                                  onPress={() => setIsTopicFollowed(false)}
                                  color='#0782F9'
                                  uncheckedColor='#0782F9'
                                />
                                <Text style={styles.itemFile}>No</Text>
                              </View>
                          </View>

                          <View style={styles.radioButtonContainer}>
                            <Text style={styles.item2nd}>Structure</Text>

                              <View style={styles.radioButton}>
                                <RadioButton
                                  value={true}
                                  status={ isStructureFollowed === true ? 'checked' : 'unchecked' }
                                  onPress={() => setIsStructureFollowed(true)}
                                  color='#0782F9'
                                  uncheckedColor='#0782F9'
                                />
                                <Text style={styles.itemFile}>Yes</Text>
                              </View>  
                              <View style={styles.radioButton}>
                                <RadioButton
                                  value={false}
                                  status={ isStructureFollowed === false ? 'checked' : 'unchecked' }
                                  onPress={() => setIsStructureFollowed(false)}
                                  color='#0782F9'
                                  uncheckedColor='#0782F9'
                                />
                                <Text style={styles.itemFile}>No</Text>
                              </View>
                          </View>
                          
                          <View style={styles.radioButtonContainer}>
                            <Text style={styles.item2nd}>Relevant references</Text>

                              <View style={styles.radioButton}>
                                <RadioButton
                                  value={true}
                                  status={ areReferencesRelevant === true ? 'checked' : 'unchecked' }
                                  onPress={() => setAreReferencesRelevant(true)}
                                  color='#0782F9'
                                  uncheckedColor='#0782F9'
                                />
                                <Text style={styles.itemFile}>Yes</Text>
                              </View>
                              <View style={styles.radioButton}>
                                <RadioButton
                                  value={false}
                                  status={ areReferencesRelevant === false ? 'checked' : 'unchecked' }
                                  onPress={() => setAreReferencesRelevant(false)}
                                  color='#0782F9'
                                  uncheckedColor='#0782F9'
                                />
                                <Text style={styles.itemFile}>No</Text>
                              </View>
                          </View>

                          <View style={styles.radioButtonContainer}>
                            <Text style={styles.item2nd}>Recommendation</Text>

                            <RadioGroup 
                              radioButtons={radioButtons} 
                              onPress={(selectedId) => {
                                setSelectedId(selectedId)
                                switch (selectedId) {
                                  case '1':
                                    setIsRecommendationYes(true);
                                    setIsRecommendationReview(false);
                                    setIsRecommendationNo(false);
                                    break;
                                  case '2':
                                    setIsRecommendationReview(true);
                                    setIsRecommendationYes(false);
                                    setIsRecommendationNo(false);
                                    break;
                                  case '3':
                                    setIsRecommendationNo(true);
                                    setIsRecommendationReview(false);
                                    setIsRecommendationYes(false);
                                    break;
                                  default:
                                    break;
                                }
                              }}
                              selectedId={selectedId}
                              containerStyle={{ alignItems: 'left' }}
                              labelStyle={{ fontWeight: 500, color: 'black', fontSize: 17, margin: 3, justifyContent: 'center'}}
                              borderColor='#00ff00'
                              borderSize='24'                            
                              />
                          </View>
                          <View style={styles.inputContainer}>
                            <TextInput
                              key={currentPaperId}
                              placeholder="Recommendation"
                              value={reviewsObj.currentPaperId}
                              onChangeText={(text) => {
                                reviewsObj[currentPaperId] = text;
                                setReviewsObj(reviewsObj)
                              }}
                              multiline={true}
                              numberOfLines={10}
                              style={styles.input}
                            />
                          </View>
                          <View style={styles.buttonContainer}>
                            <TouchableOpacity
                            onPress = {() => {addReview(currentPaperId, authorId, paperTitle, reviewCounter)}}
                            style={styles.button}
                            >
                            <View style={styles.centerTextIconOnButton}>
                              <SendCommentIcon name="send" size={25} color="white" />
                              <Text style={styles.createPollButtonText}>Send</Text>
                            </View>
                            </TouchableOpacity>
                          </View>
                      </View>
                      : null 
                      }
                    </View>


              </View>
        </ScrollView>
        : 
        <View style={styles.createdEventsView}>
          <Text style={styles.viewText}>No papers to review for now.</Text>
          <Text style={styles.viewText}>Check again later.</Text>
        </View>
      }
    </React.Fragment>
  );
}

export default ReviewPaper

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#89cff0',
    },
    title: {
      textAlign: 'center',
      fontSize: 22,
      fontWeight: '300',
      marginBottom: 20,
    },
    header: {
      backgroundColor: '#0782F9',
      padding: 10,
    },
    headerText: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '500',
    },
    content: {
      padding: 20,
      backgroundColor: '#89cff0',
    },
    active: {
      backgroundColor: 'rgba(255,255,255,1)',
    },
    inactive: {
      backgroundColor: 'rgba(245,252,255,1)',
    },
    selectors: {
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    selector: {
      backgroundColor: '#0782F9',
      padding: 10,
    },
    activeSelector: {
      fontWeight: 'bold',
    },
    selectTitle: {
      fontSize: 14,
      fontWeight: '500',
      padding: 10,
    },
    multipleToggle: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 30,
      alignItems: 'center',
    },
    multipleToggle__title: {
      fontSize: 16,
      marginRight: 8,
    },
    inputContainer: {
      width: '95%',
      alignSelf:'center',
      padding: 10,
      height:150,
      textAlignVertical: 'top',
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      fontSize: 20,
    },
    imageContainer: {
      marginTop: 10,
      backgroundColor: '#89cff0',
    },
    imageButton: {
      backgroundColor: '#0782F9',
      width: '25%',
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 15,
      marginLeft: 65,
    },
    imageButtonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 17,
    },
    buttonContainer: {
      width: '100%',
      backgroundColor:'#89cff0',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#0782F9',
      width: '30%',
      padding:10,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 20,
      alignContent: 'center',
      justifyContent: 'center',
    },
    textInputsTitle: {
      fontSize: 16,
      fontWeight: "600",
      paddingLeft: 3,
      marginTop: 10,
      marginBottom: 5,
    },
    fileName: {
      fontSize: 16,
      fontWeight: "600",
      paddingLeft: 3,
      marginTop: 10,
      marginLeft: '39%',
    },
    imageButtonsContainer: {
      flexDirection: 'row', 
      flexWrap:'wrap',
    },
    bottomContainer: {
      flexDirection: 'row', 
      flexWrap:'wrap',
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
    item2ndTitle: {
      justifyContent: 'center',
      margin: 5,
      fontSize: 20,
      fontWeight: '700',
    },
    itemFile: {
      justifyContent: 'center',
      margin: 5,
      fontWeight: "500", 
      color: 'black', 
      fontSize: 17
    },
    item2nd: {
      justifyContent: 'center',
      margin: 5,
      fontSize: 19,
      fontWeight: "600",
    },
    item3rd: {
      justifyContent: 'center',
      fontSize: 19,
      fontWeight: "600",
    },
    secondContainer: {
      backgroundColor: '89cff0',
    },
    questionsContainer: {
      backgroundColor: '#89cff0',
      height: '100%',
    },
    eachReview: {
      borderStyle: 'dashed',
      borderBottomWidth: 1,
      borderBottomColor: 'black',
      justifyContent: 'center',
      alignContent:'center',
      margin: 3,
      flexBasis: 'auto',
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
      fontSize: 15,
      alignSelf: 'center',
    },
    centerTextIconOnButton: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioButtonContainer: {
      marginLeft: 5,
    },
    radioButton: {
      flexDirection: 'row', 
      flexWrap:'wrap',
    },
  });