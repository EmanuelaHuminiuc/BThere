import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BarChart } from "react-native-gifted-charts";
import { getPollsStatistics } from '../../firebase/dbGetFunctions';

const PollResultsComponent = (props) => {

  const [ statisticsList, setStatisticsList ] = useState();

  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getPollsStatistics(statisticsRetrieved, props.route.params.eventId, props.route.params.currentPollId);
  };
  
  function statisticsRetrieved(statisticsList){
    setStatisticsList(statisticsList);
  };

  const data=[ 
    {value: statisticsList ? statisticsList[0].choice1Votes : 0, label: 'C1', 
    topLabelComponent: () => (
      <Text style={{color: '#0782F9', fontSize: 18, marginBottom: 0}}>{statisticsList ? statisticsList[0].choice1Votes : 0}</Text>
    ),}, 
    {value: statisticsList ? statisticsList[0].choice2Votes : 0, label: 'C2', frontColor: '#0782F9',
    topLabelComponent: () => (
      <Text style={{color: '#0782F9', fontSize: 18, marginBottom: 0}}>{statisticsList ? statisticsList[0].choice2Votes : 0}</Text>
    ),}, 
    {value: statisticsList ? statisticsList[0].choice3Votes : 0, label: 'C3', 
    topLabelComponent: () => (
      <Text style={{color: '#0782F9', fontSize: 18, marginBottom: 0}}>{statisticsList ? statisticsList[0].choice3Votes : 0}</Text>
    ),}, 
  ]

  return(
      <React.Fragment>
        { JSON.stringify(statisticsList) !== JSON.stringify([]) ?
          <KeyboardAwareScrollView style={styles.container}>
            <Text style={styles.textContainer}>
              <Text style={styles.textTitleStyle}>Question: </Text>
              <Text style={styles.textQuestionStyle}>{statisticsList ? statisticsList[0].pollQuestion : 'Poll Question'}</Text>
            </Text>

            <View style={styles.chartContainer}>
              <BarChart
              data = {data} 
              barWidth={25}
              noOfSections={6}
              barBorderRadius={4}
              frontColor="lightgray"
              yAxisThickness={0}
              xAxisThickness={0}
              isAnimated
              />
            </View>

            <View style={styles.viewChoicesText}>
              <Text style={styles.textQuestionStyle}>C1 - {statisticsList ? statisticsList[0].choice1Text : 'Choice 1'}</Text>
              <Text style={styles.textQuestionStyle}>C2 - {statisticsList ? statisticsList[0].choice2Text : 'Choice 2'}</Text>
              <Text style={styles.textQuestionStyle}>C3 - {statisticsList ? statisticsList[0].choice3Text : 'Choice 3'}</Text>
            </View>
          </KeyboardAwareScrollView>
        : 
          <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>No polls statistics yet.</Text>
            <Text style={styles.viewText}>Check again later.</Text>
          </View>
        }
      </React.Fragment>
    )
  }
  export default PollResultsComponent

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#F5FCFF'
},
textTitleStyle: {
  fontSize: 19,
  fontWeight: "700",
  color: '#0782F9',
},
textQuestionStyle: {
  fontSize: 18,
  fontWeight: "500",
  color: 'black',
},
textContainer: {
  marginTop: 20,
  alignSelf: 'center',
  justifyContent: 'center',
},
chartContainer : {
  marginTop: 20,
  justifyContent: 'center',
  alignSelf: 'center',
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
viewChoicesText: {
  marginTop: 30,
  alignItems: 'center',
  justifyContent: 'center',
}
});