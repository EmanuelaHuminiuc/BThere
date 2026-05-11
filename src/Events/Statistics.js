import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PieChart } from "react-native-gifted-charts";
import { getParticipantsStatistics } from '../../firebase/dbGetFunctions';

const Statistics = (props) => {

  const [ statisticsList, setStatisticsList ] = useState();
 
  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getParticipantsStatistics(statisticsRetrieved, props.route.params.eventId);
  };
  
  function statisticsRetrieved(statisticsList){
    setStatisticsList(statisticsList);
  };

  const dataForPublicPrivateEvents=[ 
    {value: statisticsList ? statisticsList[0].participantsCount : 0, text: statisticsList ? statisticsList[0].participantsCount : 0, color: '#0782F9', textColor: 'black', textSize: 30,}, 
    {value: statisticsList ? statisticsList[0].postsCount : 0, text: statisticsList ? statisticsList[0].postsCount : 0, color: 'orange', textColor: 'black', textSize: 30,}, 
    {value: statisticsList ? statisticsList[0].commentsCount : 0, text: statisticsList ? statisticsList[0].commentsCount : 0, color: 'green', textColor: 'black', textSize: 30,}, 
    ]

  const dataForConferences=[
    {value: statisticsList ? statisticsList[0].participantsCount : 0, text: statisticsList ? statisticsList[0].participantsCount : 0, color: '#0782F9', textColor: 'black', textSize: 30,}, 
    {value: statisticsList ? statisticsList[0].authorsCount : 0, text: statisticsList ? statisticsList[0].authorsCount : 0, color: 'orange', textColor: 'black', textSize: 30,}, 
    {value: statisticsList ? statisticsList[0].reviewersCount : 0, text: statisticsList ? statisticsList[0].reviewersCount : 0, color: 'green', textColor: 'black', textSize: 30,}, 
    {value: statisticsList ? statisticsList[0].speakersCount : 0, text: statisticsList ? statisticsList[0].speakersCount : 0, color: 'red', textColor: 'black', textSize: 30,}, 
    {value: statisticsList ? statisticsList[0].postsCount : 0, text: statisticsList ? statisticsList[0].postsCount : 0, color: 'turquoise', textColor: 'black', textSize: 30,}, 
    ]

  return(
    <React.Fragment>
      { JSON.stringify(statisticsList) !== JSON.stringify([]) ?
        <KeyboardAwareScrollView style={styles.container}>
        { props.route.params.eventExtraSettings.eventType === "conference" ?
            <View style={styles.container}>
                <Text style={styles.textContainer}>
                <Text style={styles.textTitleStyle}>General Statistics</Text>
                </Text>

                <Text style={styles.textParticipantsStyle}>Nr of users: {statisticsList ? statisticsList[0].participantsCount : 0}</Text>
                <Text style={styles.textAuthorsStyle}>Nr of authors: {statisticsList ? statisticsList[0].authorsCount : 0}</Text>
                <Text style={styles.textReviewersStyle}>Nr of reviewers: {statisticsList ? statisticsList[0].reviewersCount : 0}</Text>
                <Text style={styles.textSpeakersStyle}>Nr of speakers: {statisticsList ? statisticsList[0].speakersCount : 0}</Text>
                <Text style={styles.textPostsConfStyle}>Nr of posts: {statisticsList ? statisticsList[0].postsCount : 0}</Text>

                <View style={styles.chartContainer}>
                    <PieChart
                    data = {dataForConferences} 
                    showText
                    textColor="black"
                    focusOnPress
                    radius={150}
                    textSize={18}
                    showValuesAsLabels
                    labelsPosition="mid"
                    />
                </View>
            </View>
        : 
            <View style={styles.container}>
              <Text style={styles.textContainer}>
              <Text style={styles.textTitleStyle}>General Statistics</Text>
              </Text>

              <Text style={styles.textParticipantsStyle}>Nr of users: {statisticsList ? statisticsList[0].participantsCount : 0}</Text>
              <Text style={styles.textAuthorsStyle}>Nr of posts: {statisticsList ? statisticsList[0].postsCount : 0}</Text>
              <Text style={styles.textReviewersStyle}>Nr of comments: {statisticsList ? statisticsList[0].commentsCount : 0}</Text>
        
                <View style={styles.chartContainer}>
                    <PieChart
                    data = {dataForPublicPrivateEvents} 
                    showText
                    textColor="white"
                    focusOnPress
                    radius={150}
                    textSize={18}
                    showValuesAsLabels
                    labelsPosition="mid"
                    />
                </View>
            </View>
        }
        </KeyboardAwareScrollView>
      : 
          <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>No statistics yet.</Text>
            <Text style={styles.viewText}>Check again later.</Text>
          </View>
      }
  </React.Fragment>
  )
    
  }
  export default Statistics

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      height: '100%',
    },
    textTitleStyle: {
      fontSize: 21,
      fontWeight: "700",
      color: 'black',
    },
    textParticipantsStyle: {
      fontSize: 18,
      fontWeight: "500",
      color: '#0782F9',
      marginLeft: 15,
    },
    textAuthorsStyle: {
      fontSize: 18,
      fontWeight: "500",
      color: 'orange',
      marginLeft: 15,
    },
    textReviewersStyle: {
      fontSize: 18,
      fontWeight: "500",
      color: 'green',
      marginLeft: 15,
    },
    textSpeakersStyle: {
      fontSize: 18,
      fontWeight: "500",
      color: 'red',
      marginLeft: 15,
    },
    textPostsConfStyle: {
      fontSize: 18,
      fontWeight: "500",
      color: 'turquoise',
      marginLeft: 15,
    },
    textContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      margin: 10,
    },
    chartContainer : {
      marginTop: 20,
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
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
  });