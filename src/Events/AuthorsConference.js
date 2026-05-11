import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React, {useEffect, useState} from 'react';
import { getAuthors } from '../../firebase/dbGetFunctions';

const AuthorsConference = (props) => {

  const [ authorsList, setAuthorsList] = useState();

  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getAuthors(authorsRetrieved, props.route.params.eventId);
  };
  
  function authorsRetrieved(authorsList){
    setAuthorsList(authorsList);
  };

  const AuthorsItem = ({
    authorEmail, authorFirstName, authorLastName, authorImageURL
  }) => (
    <View style={styles.eachSpeaker}>
      <View style={styles.userImageDetailsContainer}>
        <View style={styles.imageUserContainer}>
        {authorImageURL ?
            <View>
              {authorImageURL && <Image source={{uri: authorImageURL}} style={{width: 100 , height: 100, borderRadius: 100 /2}}/>}
            </View>
          :
            <View>
              {<Image source={require('../img/default-profile-image.jpg')} style={{width: 100 , height: 100, borderRadius: 100 /2}}/>}
            </View>
        }
        </View>

        <View style={styles.userDetailsContainer}>
              <Text style={styles.flatListItemText}>{authorFirstName + ' ' + authorLastName}</Text>
              <Text style={styles.flatListItemText}>{authorEmail}</Text>
        </View>
      </View>
    </View>
       
  );

  return (
    <React.Fragment>
      { JSON.stringify(authorsList) !== JSON.stringify([]) ?
          <View style={styles.container}>
              
            {/* AUTHORS FLAT LIST */}
            <FlatList
              data={authorsList}
              keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
              renderItem={({item})  =>
              <AuthorsItem
                eventId={item.eventId}
                authorEmail={item.authorEmail}
                authorId={item.authorId}
                authorFirstName={item.userDetails.firstName}
                authorLastName={item.userDetails.lastName}
                authorImageURL={item.userDetails.userImageURL}
              />}
            />         
          </View>
      : 
          <View style={styles.createdEventsView}>
            <Text style={styles.viewText}>No authors for now.</Text>
            <Text style={styles.viewText}>Check again later.</Text>
          </View>
      }
    </React.Fragment>
  )
}

export default AuthorsConference

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#89cff0',
  justifyContent: 'center',
  alignItems: 'center',
},
flatList  : {
  backgroundColor : '#89cff0',
  height : "100%",
},
flatListItemText: {
  justifyContent: 'center',
  marginTop: 7,
  fontSize: 20,
  marginLeft: 5,
  marginRight: 5,
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