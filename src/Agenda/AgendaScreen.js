import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { getAgenda } from '../../firebase/dbGetFunctions';
import AgendaItems from './AgendaItems';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from '../../firebase/firebase-config';



const AgendaScreen = (props) => {

    const [eventId, setEventId] = useState(props.route ? props.route.params.eventId : props.eventId);
    const [agendasObjByDay, setAgendasObjByDay] = useState({});
    const [ agendaData,  setAgendaData ] = useState();
    const [currentUserIsSpeaker, setCurrentUserIsSpeaker] = useState(false);
    const user = auth.currentUser;
    const uid = user.uid; 
    const navigationProps = props.route ? props.navigation : props.navigationObj;
    const [speakerId, setSpeakerId] = useState('');
    
    useEffect(() => {
        getData()
      }, []);

    function convertTimestampIntoDay (timestamp){
        let date = timestamp.toDate();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        date = day + '/' + month + '/' + year;
        return date;
    };

    function getData(){
        getAgenda(agendaRetrievedHandler, eventId);
        navigationProps.addListener(
            'focus',
            payload => {
              getAgenda(agendaRetrievedHandler, eventId);
            }
        )
    };

    function agendaRetrievedHandler (data) {
        setAgendaData(data);
        const agendasObjByDay = {}
        setSpeakerId(data[0].speakerId);

        data.forEach(element => {
            const day = convertTimestampIntoDay(element.agendaTime);
            if (!agendasObjByDay[day]) { 
                agendasObjByDay[day] = []
            } 
            agendasObjByDay[day].push(element);
            if (element.speakerId === uid) { 
                setCurrentUserIsSpeaker(true);
            } 
        });
        setAgendasObjByDay(agendasObjByDay);
    };

    function getAgendaItemsByDay() {
        if(Object.keys(agendasObjByDay).length !== 0) {
            let i = 0;
            const test = Object.values(agendasObjByDay).map((agendaItems, index) => {
                i++;
                return <AgendaItems 
                    agendaDate={Object.keys(agendasObjByDay)[index]}
                    agendaItems={agendaItems}
                    eventId={eventId}
                    key={i}>
                </AgendaItems>
            });
            return test;
        }
        return;
    }

    return (
        <React.Fragment>
            { JSON.stringify(agendasObjByDay) !== JSON.stringify({}) ?
                <KeyboardAwareScrollView style={styles.container}>
                    { agendasObjByDay ? getAgendaItemsByDay() : null }
                </KeyboardAwareScrollView>
            : 
                null
            }

             { JSON.stringify(agendasObjByDay)==JSON.stringify({})?
                <View style={styles.createdEventsView}>
                    <Text style={styles.viewText}>The agenda was not established yet.</Text>
                    <Text style={styles.viewText}>The admin can make it on Edit Event screen.</Text>
                </View>
            : 
                null
            }
          { currentUserIsSpeaker ?
            <View style={styles.currentSpeakerBackground}>
                <Text style={styles.agendaSpeakerText}> * Items title and description can be editted</Text>
            </View>
        : null }
        </React.Fragment>
    )
}

export default AgendaScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#89cff0',
    height: '100%',
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
    backgroundColor: '#89cff0',
  },
  agendaSpeakerText: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    bottom: 0,
    position: 'absolute',
    fontSize: 15,
    fontWeight: '500',
    backgroundColor: 'rgba(7, 130, 249, 0.8)',
  },
  currentSpeakerBackground: {
    width: '100%',
    backgroundColor:'red',
  },
});