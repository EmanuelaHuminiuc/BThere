import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import CommentIcon from 'react-native-vector-icons/FontAwesome';
import LikeIcon from 'react-native-vector-icons/AntDesign';
import DeleteIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { deleteCurrentPost, deleteCommentsByPostId } from '../../firebase/dbDeleteFunctions';
import { onLikePress, onDislikePress } from '../../firebase/dbSetFunctions';
import { getPosts, getLike } from '../../firebase/dbGetFunctions';
import { auth } from '../../firebase/firebase-config';

const TimelinePostItem = (props) => {

    const [isLiked, setIsLiked] = useState(false);
    const user = auth.currentUser;
    const uid = user.uid; 

    useEffect(()=>{
        getData();
    }, []);

    function getData(){
        getLike(props.item.id, uid).then((likeList)=>{
            if(likeList.length > 0){
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
        });
    };
   
    function handleLikeClick() {
        if(isLiked === false){
            onLikePress(
                props.item.id,
                props.postsRetrieved,
                props.selectedEventId,
                setIsLiked);
        } else {
            onDislikePress(
                props.item.id,
                props.postsRetrieved,
                props.selectedEventId,
                setIsLiked);
        };
    };

    function deleteCommentsHandler(){
        deleteCurrentPost(
            props.item.id,
            props.postsRetrieved,
            props.selectedEventId
        ).then(() =>{
            getPosts(props.postsRetrieved, props.selectedEventId);
            deleteCommentsByPostId(props.item.id);
        })
      };

    const PostItem = ({
        postTitle, postDescription, postImageURL, postId, userFirstName, userLastName, userImageURL
    }) => (
        <View style={styles.eachPost}>
            <View style={styles.imageUserDetailsContainer}>
            {userImageURL ?
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
                </View>
            </View>

            <View style={styles.post}>
                { postImageURL ?
                    <View>
                        {postImageURL && <Image source={{uri: postImageURL}} style={{width: 250 , height: 200, alignSelf:'center'}}/>}
                    </View>
                : 
                    null 
                }
                <Text style={styles.flatListItemTitleText}>{postTitle}</Text>
                <Text style={styles.flatListItemText}>{postDescription}</Text>
            </View>

            <TouchableOpacity activeOpacity={0.9} style={styles.flatListItem}> 
                <View style={styles.postIconsContainer}>
                    <TouchableOpacity 
                    style={styles.postIconsContainer}
                    onPress={() => {
                        handleLikeClick();
                    }}>
                        <LikeIcon name="like1" size={30} color= {isLiked ? "white" : "black"}/>
                        <Text style={styles.likesText}>{props.item.likesCount} likes  </Text>
                    </TouchableOpacity>

                {props.selectedEventExtraSettings.areCommentsAllowed ?
                    <TouchableOpacity 
                    onPress={() => {
                        props.toggleCommentsModalHandler(true);
                        props.setCurrentActivePostId(postId);
                    }}>
                        <CommentIcon name="comment" size={30} color="black" />
                    </TouchableOpacity>
                :    
                    null 
                }

                {props.selectedAdminId === uid || props.item.userId === uid?
                    <TouchableOpacity onPress={() => {
                        deleteCommentsHandler();
                    }}>
                        <DeleteIcon name="delete" size={30} color="black" />
                    </TouchableOpacity>
                : 
                    null
                }
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
        <PostItem
            postTitle={props.item.postTitle}
            postDescription={props.item.postDescription}
            postImageURL={props.item.postImageURL}
            postId={props.item.id}
            userId={props.item.userId}
            likesCount={props.item.likesCount}
            userFirstName={props.item.userDetails.firstName}
            userLastName={props.item.userDetails.lastName}
            userImageURL={props.item.userDetails.userImageURL}
        />
        </View>
    )
}

export default TimelinePostItem

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#89cff0',
    height: '100%',
},
flatListItem: {
    justifyContent: 'center',
    alignContent:'center',
    margin: 3,
},
flatListItemTitleText: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    fontSize: 19,
    fontWeight: '500',
    marginTop: 5,
},
flatListItemText: {
    justifyContent: 'center',
    margin: 3,
    fontSize: 18,
},
postIconsContainer: {
    flexDirection: 'row', 
    flexWrap:'wrap',
    alignItems: 'center',
    justifyContent: 'center',
},
likesText: {
    fontSize: 15,
},
eachPost: {
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
},
imageUserDetailsContainer: {
    flexDirection: 'row', 
    flexWrap:'wrap',
    width: '100%',
    marginTop: 5,
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
post: {
    marginTop: 7,
}
});