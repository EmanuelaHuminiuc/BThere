import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React, {useState, useEffect} from 'react';
import { getAllPolls } from '../../firebase/dbGetFunctions';
import Modal from "react-native-modal";
import CreatePollsComponent from '../Polls/CreatePollsComponent';

const DisplayPollsComponent = (props) => {

  const [ allPollsList, setAllPollsList] = useState();
  const [ isPollsModalVisible, setPollsModalVisible ] = useState(false);
  const eventId = props.route.params.eventId;

  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getAllPolls(allPollsRetrieved, props.route.params.eventId);
  };

  function allPollsRetrieved(allPollsList){
    setAllPollsList(allPollsList);
  };

  const togglePollsModal = () => {
    setPollsModalVisible(!isPollsModalVisible);
  };

  const AllPollsItem = ({
    pollQuestion, currentPollId
  }) => (
    <View style={styles.containerEvents}>
      <TouchableOpacity activeOpacity={0.9} style={styles.item}
          onPress={() => { props.navigation.navigate('DisplayPollComponent', {
            currentPollId, eventId
          });
      
        }}> 
          <Text style={styles.item2nd}>{pollQuestion}</Text>
      </TouchableOpacity>
    
      <View style={styles.buttonContainer}>

        {/* POLL RESULTS BUTTON */}
        { props.route.params.eventExtraSettings.areStatisticsAllowed ?
            <TouchableOpacity
              style={styles.button}
              onPress={() => {props.navigation.navigate("PollStatisticsComponent", {eventId: props.route.params.eventId, eventExtraSettings: props.route.params.eventExtraSettings, currentPollId: currentPollId})}}
              >
              <Text style={styles.buttonText}>Poll results</Text>
            </TouchableOpacity> 
        : 
          null
        }
      </View>
    </View>
  );

  return (
    <React.Fragment>
      <View style={styles.container}>

          {/* POLLS VIEW */}
          <View >
            {/* CREATE POLL BUTTON */}
            { props.route.params.eventExtraSettings.isPollingAllowedForParticipants ?
              <View style={styles.headerButtonContainer}>
                  <TouchableOpacity style={styles.headerButton}
                  onPress={() => {togglePollsModal()}}>
                    <Text style={styles.headerButtonText}>Create Poll</Text>
                  </TouchableOpacity>

                  <Modal isVisible={isPollsModalVisible}
                  >
                    <View style={styles.container}>
                      <CreatePollsComponent
                      eventId={props.route.params.eventId}
                      togglePollsModalHandler={togglePollsModal}
                      />
                    </View>
                  </Modal>
              </View>
            : 
              null
            }
          </View>

          { JSON.stringify(allPollsList) !== JSON.stringify([]) ?
            <View>
              <Text style={styles.textCommentsTitle}>Polls</Text>
              {/* POLLS FLAT LIST */}
              <FlatList style = {styles.flatList}
                data={allPollsList}
                keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                renderItem={({item})  =>
                <AllPollsItem
                  pollQuestion={item.pollQuestion}
                  currentPollId={item.id}
                />}
              />
              </View>
          : 
              <View style={styles.createdEventsView}>
                <Text style={styles.viewText}>No polls yet.</Text>
                <Text style={styles.viewText}>Check again later.</Text>
              </View>
          }
      </View>
    </React.Fragment>
  )
}

export default DisplayPollsComponent

const styles = StyleSheet.create({
container:{
    backgroundColor: '#89cff0',
    height: '100%',
    paddingLeft: 10,
    paddingRight: 10,
},
textCommentsTitle: {
    fontSize: 20,
    fontWeight: "700",
    paddingLeft: 13,
    marginTop: 10,
},
flatList  : {
    backgroundColor : '#89cff0',
    height : "80%",
},
item: {
    backgroundColor: '#89cff0',
    justifyContent: 'center',
    alignContent:'center',
    margin: 10,
},
item2nd: {
    justifyContent: 'center',
    margin: 5,
    fontSize: 16,
    fontWeight: "700",
},
headerButtonContainer: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  justifyContent: 'center',
},
headerButton: {
  backgroundColor: '#0782F9',
  width: '35%',
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 5,
},
headerButtonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
},
buttonContainer: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  justifyContent: 'center',
},
button: {
  backgroundColor: '#0782F9',
  width: '35%',
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 2,
  marginBottom: 10,
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
},
containerEvents:{
  borderStyle: 'solid',
  borderStyle: 'dashed',
  borderBottomWidth: 1,
  borderBottomColor: 'black',
  marginTop: 5,
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