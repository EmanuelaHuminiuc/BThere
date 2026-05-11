import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React, {useEffect, useState} from 'react';
import { getReviewers } from '../../firebase/dbGetFunctions';

const ReviewersConference = (props) => {

  const [ reviewersList, setReviewersList] = useState();

  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getReviewers(reviewersRetrieved, props.route.params.eventId);
  };
  
  function reviewersRetrieved(reviewersList){
    setReviewersList(reviewersList);
  };

  const ReviewersItem = ({
    reviewerEmail, reviewerFirstName, reviewerLastName, reviewerImageURL
  }) => (
    <View style={styles.eachSpeaker}>
      <View style={styles.userImageDetailsContainer}>
        <View style={styles.imageUserContainer}>
        {reviewerImageURL ?
          <View>
            {reviewerImageURL && <Image source={{uri: reviewerImageURL}} style={{width: 100 , height: 100, borderRadius: 100 /2}}/>}
          </View>
          :
        <View>
          {<Image source={require('../img/default-profile-image.jpg')} style={{width: 100 , height: 100, borderRadius: 100 /2}}/>}
        </View>
        }
        </View>

        <View style={styles.userDetailsContainer}>
              <Text style={styles.flatListItemText}>{reviewerFirstName + ' ' + reviewerLastName}</Text>
              <Text style={styles.flatListItemText}>{reviewerEmail}</Text>
        </View>
      </View>

      
    </View>
  );

  return (
    <React.Fragment>
      { JSON.stringify(reviewersList) !== JSON.stringify([]) ?
        <View style={styles.container}>
          {/* REVIEWERS FLAT LIST */}
          <FlatList 
            data={reviewersList}
            keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            renderItem={({item})  =>
            <ReviewersItem
              eventId={item.eventId}
              reviewerEmail={item.reviewerEmail}
              reviewerId={item.reviewerId}
              reviewerFirstName={item.userDetails.firstName}
              reviewerLastName={item.userDetails.lastName}
              reviewerImageURL={item.userDetails.userImageURL}
            />}
          />     
        </View>
      : 
        <View style={styles.createdEventsView}>
          <Text style={styles.viewText}>No reviewers yet.</Text>
          <Text style={styles.viewText}>Check again later.</Text>
        </View>
      }
    </React.Fragment>
  )
}

export default ReviewersConference

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#89cff0',
  justifyContent: 'center',
  alignItems: 'center',
},
participantssContainer:{
  backgroundColor: '#89cff0',
  margin: 5,
  paddingLeft: 10,
  paddingRight: 10,
},
participantsTitleText: {
  fontSize: 20,
  fontWeight: "700",
  paddingLeft: 13,
},
flatList  : {
  backgroundColor : '#89cff0',
  height : "100%",
},
item: {
  backgroundColor: '#89cff0',
  justifyContent: 'center',
  alignContent:'center',
  margin: 10,
},
flatListItemText: {
  justifyContent: 'center',
  marginTop: 7,
  fontSize: 20,
  marginLeft: 5,
  marginRight: 5,
},
buttonsContainer: {
  flexDirection: 'row', 
  flexWrap:'wrap',
},
button: {
  backgroundColor: '#0782F9',
  width: '35%',
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 40,
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
},
userImageDetailsContainer: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  width: '100%',
  marginTop: 5,
},
imageUserContainer: {
  marginTop: 5,
  marginBottom: 10,
  justifyContent: 'center',
  alignItems: 'center',
  width: '30%',
},
userDetailsContainer: {
  width: '70%',
  justifyContent: 'center',
},
chatEmailButton: {
  backgroundColor: '#0782F9',
  width: '20%',
  padding: 10,
  borderRadius: 10,
  marginTop: 10,
  marginLeft: 9,
  justifyContent: 'center',
  alignItems: 'center',
},
chatEmailButtonsContainer: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 5,
},
eachSpeaker: {
  borderStyle: 'dashed',
  borderBottomWidth: 1,
  borderBottomColor: 'black',
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