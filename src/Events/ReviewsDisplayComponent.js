import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Button } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { auth } from '../../firebase/firebase-config';
import * as WebBrowser from 'expo-web-browser';
import { getPapersForReview } from '../../firebase/dbGetFunctions';

const ReviewsDisplayComponent = (props) => {

    const [papersForReviewsList, setPapersForReviewsList] = useState([]);
    const [ reviewsObj, setReviewsObj] = useState({});

    const user = auth.currentUser;
    const uid = user.uid;

    const eventId = props.route.params.eventId;

    useEffect(() => {
        getData()
    }, [])
    

    function getData(){
        getPapersForReview(papersRetrieved, props.route.params.eventId);
    };
      
    function papersRetrieved(papersForReviewsList){
        setPapersForReviewsList(papersForReviewsList);
        papersForReviewsList.forEach((review) => {
          reviewsObj[review.id] = '';
        })
    };

    const checkDeadlineDate = (deadlineDate) => {
      const current = new Date();
      return current > deadlineDate;
    };

    const ReviewsItem = ({
      paperTitle, paperURL, currentPaperId, paperFileName, review1Text, review2Text, review3Text, 
      authorId, reviewCounter, isReviewed, deadlineDate, finalVersion
    }) => (
      <View style={styles.eachReview}>
        <TouchableOpacity activeOpacity={0.9} style={styles.item} 
        disabled={checkDeadlineDate(deadlineDate)}
          onPress={() => {
              const showPaper = {
                selectedPaperTitle: paperTitle,
                selectedPaperURL: paperURL,
                selectedCurrentPaperId: currentPaperId,
                selectedPaperFileName: paperFileName,
                selectedReview1Text: review1Text,
                selectedReview2Text: review2Text,
                selectedReview3Text: review3Text,
                selectedAuthorId: authorId,
                selectedReviewCounter: reviewCounter,
                selectedIsReviewed: isReviewed,
              };

              props.navigation.navigate('ReviewPaper', {
                paper: showPaper, eventId,
              });
            }
          }
        > 
            <Text>
              <Text style={styles.item2ndTitle}>Title: </Text>
              <Text style={styles.item2nd}>{paperTitle}</Text>
            </Text>
            
            <TouchableOpacity onPress={()=>{WebBrowser.openBrowserAsync(paperURL)}} >
              <Text>
                <Text style={styles.item2ndTitle}>Open paper: </Text>
                <Text style={styles.itemFile}>{paperFileName}</Text>
              </Text>
            </TouchableOpacity>
            { (review1Text !== "" || review2Text !== "" || review3Text !== "") && (checkDeadlineDate(deadlineDate) === false)
            && (finalVersion === false) && (isReviewed === true)?
              <Text style={styles.item2ndWarning}>Paper has been reviewed. Wait for author's changes!</Text>
            : null
            }
            { (isReviewed === false) && (checkDeadlineDate(deadlineDate) === false) && (finalVersion === false)?
              <Text style={styles.item2ndWarning}>This paper is waiting for your review!</Text>
            : null
            }
            { checkDeadlineDate(deadlineDate) === true ?
              <Text style={styles.item2ndWarning}>The deadline has passed. You can no longer review this paper.</Text>
            : null
            }
            { finalVersion === true ?
              <Text style={styles.item2ndWarning}>The maximum three reviews has been added for this paper. No more reviews are allowed!</Text>
            : null
            }
        </TouchableOpacity>
       
       
      </View>
    );

    return (
      <React.Fragment>
          { JSON.stringify(papersForReviewsList) !== JSON.stringify([]) ?
              <View style={styles.container}>
                <View style={styles.questionsContainer}>
                  {/* REVIEWS FLAT LIST */}
                  <FlatList style = {styles.flatList}
                    data={papersForReviewsList}
                    keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                    renderItem={({item})  =>
                    <ReviewsItem
                      paperTitle={item.title}
                      paperURL={item.paperURL}
                      currentPaperId={item.id}
                      paperFileName={item.paperFileName}
                      review1Text={item.myReview1}
                      review2Text={item.myReview2}
                      review3Text={item.myReview3}
                      authorId={item.userId}
                      reviewCounter={item.reviewCounter}
                      isReviewed={item.isReviewed}
                      deadlineDate={item.deadlineDate}
                      finalVersion={item.finalVersion}
                    />}
                  />
              </View>
        </View>
        : 
        <View style={styles.createdEventsView}>
          <Text style={styles.viewText}>No papers to review for now.</Text>
          <Text style={styles.viewText}>Check again later.</Text>
        </View>
      }
    </React.Fragment>
  );
}

export default ReviewsDisplayComponent

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
      width: '90%',
      marginLeft: 10,
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
      width: '50%',
      backgroundColor:'#89cff0',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#0782F9',
      width: '60%',
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
    item2ndWarning: {
      justifyContent: 'center',
      fontSize: 20,
      fontWeight: '700',
    },
    itemFile: {
      justifyContent: 'center',
      margin: 5,
      fontSize: 17,
    },
    item2nd: {
      justifyContent: 'center',
      margin: 5,
      fontSize: 19,
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
    radioButton: {
      flexDirection: 'row', 
      flexWrap:'wrap',
    },
  });