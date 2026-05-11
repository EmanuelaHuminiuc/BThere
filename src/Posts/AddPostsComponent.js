import { Image, TextInput, StyleSheet,TouchableOpacity, Text, View } from 'react-native';
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, auth } from '../../firebase/firebase-config';
import 'react-native-get-random-values';
import * as ImagePicker from 'expo-image-picker';
import { setPost } from '../../firebase/dbSetFunctions';
import utilsService from '../Common/UtilsService';
import SelectImageIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CloseModalIcon from 'react-native-vector-icons/Ionicons';
import * as Device from 'expo-device';

const AddPostsComponent = (props) => {

  const [eventPostTitle, setEventPostTitle] = useState('');
  const [eventPostDescription, setEventPostDescription] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const user = auth.currentUser;
  const uid = user.uid;  

  function addPost() {
    setPost(
      eventPostTitle,
      eventPostDescription,
      image,
      props.selectedEventId,
      props.togglePostsModalHandler,
      props.getPostsHandler,
      props.postsRetrievedHandler);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (Device.isDevice) {
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        uploadImage(result.assets[0].uri)
        }
    } else {
      if (!result.canceled) {
        setImage(result.uri);
        uploadImage(result.uri)
      }
    }
  };
    
  const uploadImage = async (imageURI) => {
    const blob = await new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();
          xhr.onload = function() {
          resolve(xhr.response);
          };
          xhr.onerror = function() {
          reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', imageURI, true);
          xhr.send(null);
      })
  
      const imageName = 'Image_' + uid + '_' + props.selectedEventId + '_' + utilsService.getRandomNumber();
      const storageRef  = ref(storage, `/Pictures/${imageName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setUploading(true)
        },
        (error) => {
          setUploading(false)
          console.log(error)
          blob.close()
          return 
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setUploading(false)
            setImage(url)
            blob.close()
            
          });
        }
      );
  };

  return (
     
     <View style={styles.container}>
        
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.buttonCloseAddPost}
            onPress={() => {
              props.togglePostsModalHandler(true);
            }}>
            <CloseModalIcon name="close-sharp" size={30} color="black" />
          </TouchableOpacity> 
        </View>

        <View style={styles.createPostContainer}> 
          <View style={styles.inputContainer}>
            <Text style={styles.textInputsTitle}>Title</Text>
            <TextInput
              placeholder="Title"
              value={eventPostTitle}
              onChangeText={text => setEventPostTitle(text)}
              style={styles.input}
              maxLength={35}
            />

            <Text style={styles.textInputsTitle}>Description</Text>
            <TextInput
              placeholder="Description"
              value={eventPostDescription}
              onChangeText={text => setEventPostDescription(text)}
              multiline={true}
              numberOfLines={7}
              maxLength={70}
              style={styles.input}
            />  
          </View>
        </View> 

        <View style={styles.imageContainer}>
          { image ?
            <View style={styles.imageView}>
              {image && <Image source={{uri: image}} style={{width: 250 , height: 200, marginTop: 20}}/>}
            </View>
          : 
            null 
          }
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity
            onPress = {pickImage}
            style={styles.button}
            >
              <View style={styles.centerTextIconOnButton}>
                <SelectImageIcon name="image-size-select-actual" size={30} color="white" />
                <Text style={styles.createPollButtonText}>Select image</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View> 

        <View style={styles.bottomContainer}>
          <TouchableOpacity
              onPress = {() => {addPost()}}
              style={styles.postButton}
            >
              <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
  )
};

export default AddPostsComponent

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#89cff0',
  width: '100%',
},
headerContainer:{
  height: '7.5%',
},
createPostContainer: {
  height: '37.5%',
},
imageContainer: {
    height: '45%',
  },
bottomContainer:{
  height: '10%',
  alignItems: 'center',
  justifyContent: 'center',
},
buttonCloseAddPost: {
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  position: 'absolute',
  right: 5,
  top: 5,
},
inputContainer: {
  width: '90%',
  margin: 10,
  height: 120,
},
input: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  marginTop: 10,
  fontSize: 20,
  margin: 10,
},
textInputsTitle: {
  fontSize: 17,
  fontWeight: "600",
  paddingLeft: 13,
  marginTop: 5,
},
imageView: {
  height: '75%',
  alignItems: 'center',
},
imageButtonsContainer: {
  height: '25%',
  flexDirection: 'row', 
  flexWrap:'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '100%',
},
buttonContainer: {
  width: '60%',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 40,
},
button: {
  backgroundColor: '#0782F9',
  width: '37%',
  padding: 10,
  borderRadius: 10,
  marginTop: 10,
  marginLeft: 9,
  marginRight: 9,
  justifyContent: 'center',
  alignItems: 'center',
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
},
postButton: {
  backgroundColor: '#0782F9',
  width: '30%',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 10,
},
postButtonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 17,
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
});