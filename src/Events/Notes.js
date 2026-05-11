import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import React, {useEffect, useState} from 'react';
import { getNotesByUserId } from '../../firebase/dbGetFunctions';
import { setNotes } from '../../firebase/dbSetFunctions';
import SaveNoteIcon from 'react-native-vector-icons/AntDesign';

const Notes = (props) => {

  const [ notesList, setNotesList] = useState();
  const [ note, setNote] = useState('');
  const [ noteTitle, setNoteTitle ] = useState('');
  
  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getNotesByUserId(notesRetrieved, props.route.params.eventId);
  };
  
  function notesRetrieved(notesList){
    setNotesList(notesList);
  };

  function convertTimestamp (timestamp){
    let date = timestamp.toDate();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    date = day + '/' + month + '/' + year + ' - ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
    return date;
  };

  const NotesItem = ({
    noteTitle, note, date
  }) => (
    <View style={styles.item}> 
        {noteTitle ?
            <Text style={styles.item2ndTitle}>{noteTitle}</Text>
        :null }
        <Text style={styles.item2nd}>{note}</Text>
        <Text style={styles.item2nd}>{convertTimestamp(date)}</Text>
        
    </View>
  );

    function addNote() {
        setNotes(
        noteTitle,
        note,
        props.route.params.eventId,
        notesRetrieved,
        setNote,
        setNoteTitle
        );
    };

  return (
    <View style={styles.container}>
      <Text style={styles.textInputsTitle}>Add note</Text>

      {/* TEXT INPUT FOR NOTES */}
      <View style={styles.secondContainer}>
        <TextInput
            placeholder="Title"
            value={noteTitle}
            onChangeText={text => setNoteTitle(text)}
            style={styles.inputTitle}
        />
        <TouchableOpacity
          onPress = {() => {addNote()}}
          style={styles.button}
          >
            <View style={styles.centerTextIconOnButton}>
            <SaveNoteIcon name="addfile" size={25} color="white" />
            <Text style={styles.createPollButtonText}>Save</Text>
          </View>
        </TouchableOpacity>

        <TextInput
            placeholder="Note"
            value={note}
            onChangeText={text => setNote(text)}
            style={styles.input}
            multiline={true}
            numberOfLines={10}
        />
      </View>
        
      {/* NOTES FLAT LIST */}
      { JSON.stringify(notesList) !== JSON.stringify([]) ? 
        <FlatList style = {styles.flatList}
          data={notesList}
          keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
          renderItem={({item})  =>
          <NotesItem
            noteTitle={item.noteTitle}
            note={item.note}
            eventId={item.eventId}
            userId={item.userId}
            date={item.date}
            />}
        />
      : 
        <View style={styles.createdEventsView}>
          <Text style={styles.viewText}>You did not saved any notes yet.</Text>
          <Text style={styles.viewText}>Add notes above.</Text>
        </View>
        
      }
    </View>
  )
}

export default Notes

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#89cff0',
    height: '100%',
},
secondContainer: {
  height:'33%',
  backgroundColor: '#89cff0',
  flexDirection: 'row', 
  flexWrap:'wrap',
  borderStyle: 'dashed',
  borderBottomWidth: 1,
  borderBottomColor: 'black',
},
flatList  : {
  backgroundColor : '#89cff0',
  height: '63%',
},
item: {
  backgroundColor: '#89cff0',
  justifyContent: 'center',
  alignContent:'center',
  margin: 10,
  marginBottom: 5,
  borderStyle: 'dashed',
  borderBottomWidth: 1,
  borderBottomColor: 'black',
},
item2ndTitle: {
  justifyContent: 'center',
  margin: 5,
  fontSize: 21,
  fontWeight: '700',
},
item2nd: {
  justifyContent: 'center',
  margin: 5,
  fontSize: 19,
},
inputTitle: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  marginTop: 10,
  marginLeft: 13,
  fontSize: 20,
  marginBottom: 10,
  width: '75%',
},
input: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  marginTop: 10,
  marginLeft: 13,
  fontSize: 20,
  marginBottom: 10,
  width: '93%',
  height: 100,
},
textInputsTitle: {
  fontSize: 21,
  fontWeight: "700",
  paddingLeft: 13,
  marginLeft: 5,
},
button: {
  backgroundColor: '#0782F9',
  width: '15%',
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10,
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 18,
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
viewText: {
  fontSize: 17,
  fontWeight: '700',
  alignContent: 'center',
  justifyContent: 'center',
},
createdEventsView: {
  backgroundColor: '#89cff0',
  height: '63%',
  justifyContent: 'center',
  alignItems:'center',
},
})