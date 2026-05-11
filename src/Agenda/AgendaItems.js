import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import { auth } from '../../firebase/firebase-config';
import Modal from "react-native-modal";
import SpeakerEditsAgendaItem from './SpeakerEditsAgendaItem';

export default class AgendaItems extends Component {

    convertTimestampInTime (timestamp){
        let date = timestamp.toDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        date = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
        return date;
    };

    constructor(props){
        super(props);
        this.renderFooter = this.renderFooter.bind(this);
        this.toggleSpeakerEditsAgendaItemModal = this.toggleSpeakerEditsAgendaItemModal.bind(this);
        this.state = {
            isRefreshing: false,      
            waiting: false,
            data: undefined,
            isSpeakerEditsAgendaItemVisible: false,
            speakerId: '',
            currentUserId: '',
        };
    };

    componentDidMount() {
        const mappedData = this.props.agendaItems.map((agendaItem, index) => {
            const speakerId = agendaItem.speakerId;
            const agendaItemId = agendaItem.id;
            const user = auth.currentUser;
            const uid = user.uid; 
            const speakerIdCheck = speakerId === uid ? ' * ' : '';
            return {
                time: this.convertTimestampInTime(agendaItem.agendaTime),
                title: agendaItem.agendaTitle + speakerIdCheck, 
                description: agendaItem.agendaDescription + speakerIdCheck,
                speakerId: speakerId,
                agendaItemId: agendaItemId,
            }
        });
        this.setState({
            data: mappedData,
        });
    }

    updateTitleDescription (newTitle, newDescription, agendaTime, currentData, updatedAgendaItemId) {
        const self = this;
        const newData = currentData.map((agendaItem) => {
            if(agendaItem.agendaItemId === updatedAgendaItemId){
                return {
                    time:  self.convertTimestampInTime(agendaTime),
                    title: newTitle + ' *', 
                    description: newDescription + ' *',
                    speakerId: agendaItem.speakerId,
                    agendaItemId: agendaItem.agendaItemId,
                }
            } else {
                return agendaItem;
            }
        })
        this.setState({
            data: newData,
            isSpeakerEditsAgendaItemVisible: false,
        }, () => {
        });
    }

    toggleSpeakerEditsAgendaItemModal(isVisible) {
        this.setState({
            isSpeakerEditsAgendaItemVisible: isVisible
        });
    };

    renderFooter() {
        if (this.state.waiting) {
            return <ActivityIndicator />;
        } else {
            return <Text>~</Text>;
        }
    };

    render() {
        return (
        <View style={styles.container}>
            <View style={styles.containerDateText}>
                <Text style={styles.dateText}>{this.props.agendaDate}</Text>
            </View>
            <Timeline 
            style={styles.list}
            data={this.state.data}
            circleSize={20}
            circleColor='black'
            lineColor='black'
            timeContainerStyle={{minWidth:52, marginTop: 0}}
            isUsingFlatlist={true}

            onEventPress={(element) => {
                const user = auth.currentUser;
                const uid = user.uid; 
                if(element.speakerId === uid){
                    this.toggleSpeakerEditsAgendaItemModal(!this.state.isSpeakerEditsAgendaItemVisible)
                }
            }}

            timeStyle={{textAlign: 'center', backgroundColor:'#0782F9', color:'white', padding:5, borderRadius:13}}
            descriptionStyle={{color:'black'}}
            options={{
                style:{paddingTop:5},
                renderFooter: this.renderFooter,
            }}
            innerCircle={'dot'}
            />
            {this.state.isSpeakerEditsAgendaItemVisible && 
                <Modal isVisible={this.state.isSpeakerEditsAgendaItemVisible}
                >
                    <View style={styles.container}>
                    <SpeakerEditsAgendaItem
                    eventId={this.props.eventId}
                    toggleSpeakerEditsAgendaItemModalHandler={this.toggleSpeakerEditsAgendaItemModal.bind(this)}
                    updateTitleDescriptionHandler={this.updateTitleDescription.bind(this)}
                    agendaItemData={this.props.agendaItems}
                    currentData={this.state.data}
                    />
                    </View>
                </Modal>
            }
        </View>
        );
    };
};

const styles = StyleSheet.create({
  container: {
    flexBasis: 'auto',
    padding: 15,
    backgroundColor:'#89cff0',
    flex: 1,
    backgroundColor: '#89cff0',
    height: '100%',
  },
  list: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#89cff0',
  },
  containerDateText: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: "700",
  },
});