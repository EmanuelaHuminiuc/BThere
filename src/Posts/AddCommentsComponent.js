import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Image } from 'react-native';
import React, {useState, useEffect} from 'react';
import { setComments } from '../../firebase/dbSetFunctions';
import { getComments } from '../../firebase/dbGetFunctions';
import SendCommentIcon from 'react-native-vector-icons/FontAwesome';
import CloseModalIcon from 'react-native-vector-icons/Ionicons';

const AddCommentsComponent = (props) => {

  const [postComment, setPostComment] = useState('');
  const [commentsList, setCommentsList] = useState('');
  const postIdForComments = props.postIdForComments;
  const userId = props.postData.id;
  
  useEffect(() => {
    getData()
  }, [])

  function getData(){
    getComments(commentsRetrieved, postIdForComments)
  };

  function commentsRetrieved(commentsList){
    setCommentsList(commentsList)
  };
  
  function addComment() {
    setComments(
      postComment,
      postIdForComments,
      commentsRetrieved,
      getComments,
      setPostComment,
      props.postData.eventId);
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

  const CommentsItem = ({
    postComment, date, userFirstName, userLastName, userImageURL
  }) => (
    <View style={styles.eachComment}>
          <View style={styles.imageUserDetailsCommentContainer}>
        { userImageURL ?
            <View style={styles.imageContainer}>
                {userImageURL && <Image source={{uri: userImageURL}} style={{width: 55 , height: 55, borderRadius: 55 /2}}/>}
            </View>
        :
            <View style={styles.imageContainer}>
                {<Image source={require('../img/default-profile-image.jpg')} style={{width: 55 , height: 55, borderRadius: 55 /2}}/>}
            </View>
        }
            <View style={styles.detailsContainer}>
                <Text style={styles.detailsText}>{userFirstName + ' ' + userLastName}</Text>
                <Text style={styles.detailsText}>Date: {convertTimestamp(date)}</Text>
            </View>
          </View>
          <View style={styles.comment}>
              <Text style={styles.flatListItemText}>{postComment}</Text>
          </View>
    </View>
  );

  return (
    <View style={styles.container}>

        {/* HEADER VIEW */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.buttonCloseComments}
            onPress={() => {
              props.toggleCommentsModalHandler(true);
            }}>
            <CloseModalIcon name="close-sharp" size={30} color="black" />
          </TouchableOpacity> 
        </View>

        {/* POST DETAILS VIEW */}
        <View style={styles.postsContainer}>
          <View style={styles.imageUserDetailsPostContainer}>
            { props?.postData?.userDetails?.userImageURL ?
              <View style={styles.imageContainer}>
                  {props?.postData?.userDetails?.userImageURL && <Image source={{uri: props?.postData?.userDetails?.userImageURL}} style={{width: 55 , height: 55, borderRadius: 55 /2}}/>}
              </View>
            :
              <View style={styles.imageContainer}>
                  {<Image source={require('../img/default-profile-image.jpg')} style={{width: 55 , height: 55, borderRadius: 55 /2}}/>}
              </View>
            }
              <View style={styles.detailsContainer}>
                  <Text style={styles.detailsText}>{props?.postData?.userDetails?.firstName + ' ' + props?.postData?.userDetails?.lastName}</Text>
              </View>
          </View>

          <View style={styles.post}>
              { props?.postData?.postImageURL ?
                <View style={styles.postImage}>
                  {props?.postData?.postImageURL && <Image source={{uri: props?.postData?.postImageURL}} style={{width: 200 , height: 150, justifyContent: 'center', alignSelf:'center'}}/>}
                </View>
              : 
                null 
              }  
                <Text style={styles.flatListItemTitleText}>{props?.postData?.postTitle}</Text>
                <Text style={styles.flatListItemText}>{props?.postData?.postDescription}</Text>
          </View>
        </View>

      {/* COMMENTS VIEW */}
      { JSON.stringify(commentsList) !== JSON.stringify([]) ?
        <View style={styles.commentsContainer}>
          {/* COMMENTS FLAT LIST */}
          <FlatList 
            data={commentsList}
            keyExtractor={(item) => item.id}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            renderItem={({item})  =>
            <CommentsItem
              postComment={item.comment}
              postIdForComments={item.postId}
              date={item.date}
              key={item.id}
              userFirstName={item.userDetails.firstName}
              userLastName={item.userDetails.lastName}
              userImageURL={item.userDetails.userImageURL}
            />}
          />
        </View>
      : 
        <View style={styles.createdEventsView}>
          <Text style={styles.viewText}>No comments for now.</Text>
          <Text style={styles.viewText}>Add a comment or check again later.</Text>
        </View>
      }

      {/* BOTTOM POST COMMENT VIEW */}
      <View style={styles.bottomContainer}>
        <TextInput
          placeholder="Comment"
          value={postComment}
          onChangeText={text => setPostComment(text)}
          style={styles.input}
          maxLength={50}
        />
        <TouchableOpacity
              onPress = {() => {addComment()}}
              style={styles.buttonAddComment}
            >
            <View style={styles.centerTextIconOnButton}>
            <SendCommentIcon name="send" size={25} color="white" />
            <Text style={styles.createPollButtonText}>Send</Text>
            </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddCommentsComponent

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#89cff0',
  width: '100%',
},
textPostsTitle: {
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 15,
  paddingLeft: 5,
},
textCommentsTitle: {
  fontSize: 20,
  fontWeight: "700",
  paddingLeft: 13,
  marginTop: 10,
},
headerContainer:{
  height: '7.5%',
},
postsContainer: {
  height: '46.5%',
  borderStyle: 'dashed',
  borderBottomWidth: 1,
  borderBottomColor: 'black',
},
commentsContainer:{
  height: '34%',
  margin: 5,
  paddingLeft: 5,
  paddingRight: 5,
},
bottomContainer:{
  height: '10%',
  flexDirection: 'row', 
  flexWrap:'wrap',
  alignSelf:'center',
},
input: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  margin: 7,
  fontSize: 20,
  width: '69%',
},
buttonCloseComments: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    top: 5,
},
buttonTextCloseComments: {
  color: 'white',
  fontWeight: '800',
  fontSize: 18,
},
buttonAddComment: {
  backgroundColor: '#0782F9',
  width: '20.5%',
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  margin: 8,
},
flatList  : {
  backgroundColor : '#89cff0',
  height : "80%",
},
flatListItemTitleText: {
  justifyContent: 'center',
  alignItems: 'center',
  margin: 3,
  fontSize: 20,
  fontWeight: '500',
},
flatListItemText: {
  justifyContent: 'center',
  margin: 3,
  fontSize: 18,
},
imageUserDetailsPostContainer: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  width: '100%',
  marginTop: 5,
  height:'20%',
},
post: {
  height:'80%',
},
flatListItem: {
  justifyContent: 'center',
  alignContent:'center',
  margin: 3,
  height: '75%',
},
imageUserDetailsCommentContainer: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  width: '100%',
  marginTop: 5,
  flexBasis: 'auto',
},
comment: {
  flexBasis: 'auto',
},
imageContainer: {
  width: '17%',
  justifyContent: 'center',
  alignItems: 'center',
},
detailsContainer: {
  width: '83%',
  justifyContent: 'center',
},
detailsText: {
  marginLeft: 5,
  fontSize: 17,
  fontWeight: '700',
},
postImage: {
  justifyContent: 'center',
  alignItems: 'center',
},
eachComment: {
  borderStyle: 'dashed',
  borderBottomWidth: 1,
  borderBottomColor: 'black',
  justifyContent: 'center',
  alignContent:'center',
  margin: 3,
  flexBasis: 'auto',
},
createPollButtonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
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
  height: '34%',
  justifyContent: 'center',
  alignItems:'center',
  backgroundColor: '#89cff0'
},
});