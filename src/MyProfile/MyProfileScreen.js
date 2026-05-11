import { Image, TextInput, StyleSheet,TouchableOpacity, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, auth } from '../../firebase/firebase-config';
import { updateProfile } from "firebase/auth";
import 'react-native-get-random-values';
import { setProfile } from '../../firebase/dbSetFunctions';
import { getProfile } from '../../firebase/dbGetFunctions';
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import utilsService from '../Common/UtilsService';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as WebBrowser from 'expo-web-browser';
import SelectImageIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectFileIcon from 'react-native-vector-icons/AntDesign';
import * as Device from 'expo-device';
import Checkbox from 'expo-checkbox';

const MyProfileScreen = () => {

  const [profileList, setProfileList] = useState([])
  const [userFirstName, setUserFirstName] = useState(profileList[0]?.firstName)
  const [userLastName, setUserLastName] = useState(profileList[0]?.lastName)
  const [userAddress, setUserAddress] = useState(profileList[0]?.address)
  const [userPhoneNumber, setUserPhoneNumber] = useState(profileList[0]?.phoneNumber)
  const [pushToken, setPushToken] = useState('')
  const user = auth.currentUser;
  const uid = user.uid;
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [showCV, setShowCV] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const [image, setImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [documentURL, setDocumentURL] = useState('');
  const [documentURI, setDocumentURI] = useState('');
  const [fileName, setFileName] = useState(profileList[0]?.cvFileName);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  useEffect(() => {
    getData();
  }, []);
  
  function getData(){
    getProfile(profileRetrieved);
  };
  
  function profileRetrieved(profileList){
    setProfileList(profileList);
    setUserFirstName(profileList[0].firstName);
    setUserLastName(profileList[0].lastName);
    setPushToken(profileList[0].pushToken);
    setUserAddress(profileList[0].address);
    setUserPhoneNumber(profileList[0].phoneNumber);
    setImage(profileList[0].userImageURL);
    setDocumentURL(profileList[0].userCvURL);
    setFileName(profileList[0].cvFileName);
    setIsPrivateProfile(profileList[0].isPrivateProfile);
    setShowCV(profileList[0].showCV);
    setShowImage(profileList[0].showImage);
    setShowEmail(profileList[0].showEmail);
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (Device.isDevice) {
      if (!result.canceled) {
        setDocumentURI(result.assets[0].uri);
        }
        setFileName(result.assets[0].name);
        uploadDocument(result.assets[0].uri);
    } else {
      if (!result.canceled) {
        setDocumentURI(result.uri);
      }
      setFileName(result.name);
      uploadDocument(result.uri);
    }
}

const uploadDocument = async (documentURI) => {
    const blob = await new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();
        xhr.onload = function() {
        resolve(xhr.response);
        };
        xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', documentURI, true);
        xhr.send(null);
    })

    const documentName = 'CV_' + uid + '_' + utilsService.getRandomNumber();
    const storageRef  = ref(storage, `/CV/${documentName}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadingDocument(true)
      },
      (error) => {
        setUploadingDocument(false)
        console.log(error)
        blob.close()
        return 
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setUploadingDocument(false)
          setDocumentURL(url)
          blob.close()
          return url
        });
      }
    );
};
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (Device.isDevice) {
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        uploadImage(result.assets[0].uri);
        }
    } else {
      if (!result.canceled) {
        setImage(result.uri);
        uploadImage(result.uri);
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
  
      const imageName = 'Image_' + uid + '_' + utilsService.getRandomNumber();
      const storageRef  = ref(storage, `/UsersProfile/${imageName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setUploadingImage(true)
        },
        (error) => {
          setUploadingImage(false)
          console.log(error)
          blob.close()
          return 
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setUploadingImage(false)
            setImage(url)
            blob.close()
            return url
          });
        }
      );
  };

  function addProfile() {
    setProfile(
      user.uid,
      user.email,
      userFirstName,
      userLastName,
      pushToken,
      userAddress,
      userPhoneNumber,
      image,
      documentURL,
      fileName,
      isPrivateProfile,
      showCV,
      showImage,
      showEmail,
      showSuccessMessage,
      profileRetrieved);
      const displayName = userFirstName + ' ' + userLastName;
    updateProfile(user, {
      displayName: displayName,
    });
  }

  const showSuccessMessage = () => {
      showMessage({
      message: "Your profile has been updated!",
      type: "success",
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.imageCVcontainer}>
          <View style={styles.imageUserContainer}>
              <View style={styles.imageContainer}>
                { (image || profileList[0]?.userImageURL) ?
                <View>
                  {( image || profileList[0]?.userImageURL) && <Image source={{uri: (image || profileList[0]?.userImageURL)}} style={{width: 150 , height: 150, borderRadius: 150/ 2}}/>}
                </View>
                :
                <View>
                  {<Image source={require('../img/default-profile-image.jpg')} style={{width: 150 , height: 150, borderRadius: 150 /2}}/>}
                </View>
                } 
              </View>
              <View style={styles.imageButtonsContainer}>
                <TouchableOpacity
                onPress = {pickImage}
                style={styles.imageButton}
                >
                  <SelectImageIcon name="image-size-select-actual" size={30} color="black" />
                </TouchableOpacity>
              </View>
          </View> 

            <View style={styles.cvUserContainer}>
              <View style={styles.cvContainer}>  
                { documentURL ? 
                  <View>
                    <TouchableOpacity onPress={()=>{WebBrowser.openBrowserAsync(documentURL)}}>
                    <Text style={styles.fileName}>{fileName}</Text>
                    </TouchableOpacity>
                  </View>
                : 
                  <Text style={styles.fileName}>Add your CV</Text>
                }
              </View>  
              <View style={styles.cvButtonsContainer}>
                {/* SELECT CV BUTTON */}
                  <TouchableOpacity
                  onPress = {pickDocument}
                  style={styles.fileButton}
                  >
                    <SelectFileIcon name="addfile" size={30} color="black" />
                  </TouchableOpacity>
              </View>
            </View>
      </View>

      {/* PROFILE TEXT INPUTS */}
      <View style={styles.inputContainer}>
        <Text style={styles.emailText}>Email: {user.email}</Text>

        <Text style={styles.textInputsTitle}>First name</Text>
        <TextInput
          placeholder="First name"
          value={userFirstName}
          onChangeText={(text) => setUserFirstName(text)}
          style={styles.input}
        />

        <Text style={styles.textInputsTitle}>Last name</Text>
        <TextInput
          placeholder="Last name"
          value={userLastName}
          onChangeText={(text) => setUserLastName(text)}
          style={styles.input}
        />

        <Text style={styles.textInputsTitle}>Address</Text>
        <TextInput
          placeholder="Address"
          value={userAddress}
          onChangeText={(text) => setUserAddress(text)}
          style={styles.input}
        />

        <Text style={styles.textInputsTitle}>Phone number</Text>
        <TextInput
          placeholder="Phone number"
          value={userPhoneNumber}
          onChangeText={(text) => setUserPhoneNumber(text)}
          style={styles.input}
        />
      </View>

      {/* PRIVATE PROFILE CHECKBOX */}
        <View>
          <TouchableOpacity 
            style={styles.checkboxButton}
            onPress={() => setIsPrivateProfile(!isPrivateProfile)}
          >
            <Checkbox
              style={styles.checkbox}
              value={isPrivateProfile}
              onValueChange={() => setIsPrivateProfile(!isPrivateProfile)}
              color={isPrivateProfile ? '#0782F9' : undefined}
            />
            <Text style={styles.checkboxButtonText}>Private profile</Text>
          </TouchableOpacity>
        </View>

      {/* CV CHECKBOX */}
          <View>
            <TouchableOpacity
              style={styles.checkboxButton}
              onPress={() => setShowCV(!showCV)}
            >
              <Checkbox
                style={styles.checkbox}
                value={showCV}
                onValueChange={() => setShowCV(!showCV)}
                color={showCV ? '#0782F9' : undefined}
              />
              <Text style={styles.checkboxButtonText}>Show CV to users</Text>
            </TouchableOpacity>
          </View>

      {/* IMAGE CHECKBOX */}
        <View>
          <TouchableOpacity
          style={styles.checkboxButton}
          onPress={() => setShowImage(!showImage)}
          >
            <Checkbox
              style={styles.checkbox}
              value={showImage}
              onValueChange={() => setShowImage(!showImage)}
              color={showImage ? '#0782F9' : undefined}
            />
            <Text style={styles.checkboxButtonText}>Show profile image to users</Text>
          </TouchableOpacity>
        </View>

      {/* EMAIL CHECKBOX */}
        <View>
          <TouchableOpacity
            style={styles.checkboxButton}
            onPress={() => setShowEmail(!showEmail)}
          >
            <Checkbox
                style={styles.checkbox}
                value={showEmail}
                onValueChange={() => setShowEmail(!showEmail)}
                color={showEmail ? '#0782F9' : undefined}
              />
            <Text style={styles.checkboxButtonText}>Show email to users</Text>
          </TouchableOpacity>
        </View>
    
      {/* PROFILE SAVE BUTTON */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => addProfile()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <FlashMessage
        position={"bottom"}
      />
    </KeyboardAwareScrollView>
  )
}

export default MyProfileScreen

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#89cff0',
    height: '100%',
},
inputContainer: {
  width: '100%',
  margin: 5,
  paddingLeft: 10,
  paddingRight: 23,
},
input: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  fontSize: 18,
},
imageCVcontainer: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  height:'27%',
},
imageUserContainer: {
  marginTop: 5,
  width: '50%',
  height: '100%',
},
imageContainer: {
  height: '70%',
  justifyContent: 'center',
  alignItems: 'center',
},
imageButtonsContainer: {
  height: '30%',
  flexDirection: 'row', 
  flexWrap:'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '100%',
},
imageButton: {
  backgroundColor: '#0782F9',
  width: '30%',
  padding: 10,
  borderRadius: 10,
  marginTop: 10,
  marginLeft: 9,
  marginRight: 9,
  justifyContent: 'center',
  alignItems: 'center',
},
cvUserContainer: {
  marginTop: 5,
  width: '50%',
  height: '100%',
},
cvContainer: {
  height: '70%',
  justifyContent: 'center',
  alignItems: 'center',
},
cvButtonsContainer: {
  height: '30%',
  flexDirection: 'row', 
  flexWrap:'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '100%',
},
fileButton: {
  backgroundColor: '#0782F9',
  width: '30%',
  padding: 10,
  borderRadius: 10,
  marginTop: 10,
  marginLeft: 9,
  marginRight: 9,
  justifyContent: 'center',
  alignItems: 'center',
},
buttonContainer: {
  width: '60%',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 10,
},
button: {
  backgroundColor: '#0782F9',
  width: '100%',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  marginLeft: '80%',
  marginRight: '15%',
  marginBottom: '50%',
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 18,
},
textInputsTitle: {
  fontSize: 16,
  fontWeight: "700",
  paddingLeft: 3,
  marginTop: 10,
},
emailText: {
  fontSize: 18,
  fontWeight: "600",
  paddingLeft: 3,
  marginTop: 10,
},
fileName: {
  fontSize: 16,
  fontWeight: "600",
  paddingLeft: 4,
  marginTop: 10,
  marginLeft: '18%',
  marginRight: '18%',
  justifyContent: 'center',
  alignItems: 'center',
},
checkboxContainer: {
  margin:5,
},
checkboxButton: {
  flexDirection: 'row', 
  flexWrap:'wrap',
  padding: 5,
  marginLeft:5,
  marginTop:3,
},
checkboxButtonText: {
  color: 'black',
  fontWeight: '700',
  fontSize: 18,
  alignSelf: 'center',
  justifyContent: 'center',
},
checkbox: {
  margin: 8,
},
})