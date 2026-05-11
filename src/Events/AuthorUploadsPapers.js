import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, auth } from '../../firebase/firebase-config';
import Accordion from 'react-native-collapsible/Accordion';
import * as DocumentPicker from 'expo-document-picker';
import * as WebBrowser from 'expo-web-browser';
import utilsService from '../Common/UtilsService';
import { setPaper, updatePaper, uploadFinalPaper } from '../../firebase/dbSetFunctions';
import { getPapersForCurrentAuthor, getRandom3Reviewers } from '../../firebase/dbGetFunctions';
import SelectFileIcon from 'react-native-vector-icons/AntDesign';
import SendCommentIcon from 'react-native-vector-icons/FontAwesome';
import PushNotificationService from '../PushNotificationsService/PushNotificationsService';
import * as Device from 'expo-device';

const AuthorUploadsPapers = (props) => {

    const [activeSections, setActiveSections] = useState([]);

    const [reviewersList, setReviewersList] = useState([]);
    const [papersList, setPapersList] = useState([]);

    const [paperTitle, setPaperTitle] = useState();
    const [documentURL, setDocumentURL] = useState('');
    const [documentURI, setDocumentURI] = useState('');
    const [fileName, setFileName] = useState();
    const [uploadingDocument, setUploadingDocument] = useState(false);
    const [sections, setSections] = useState([]);

    const user = auth.currentUser;
    const uid = user.uid;

    useEffect(() => {
        getData()
    }, [])

    function getData(){
        getPapersForCurrentAuthor(papersRetrieved, props.route.params.eventId);
        getRandom3Reviewers(props.route.params.eventId, setReviewersList);
        props.navigation.addListener(
          'focus',
          payload => {
            getPapersForCurrentAuthor(papersRetrieved, props.route.params.eventId);
          }
      )
    };
    
    function papersRetrieved(papersList){
        setPapersList(papersList);
        createSectionsFromAuthorPaperList(papersList)
    };

    const checkDeadlineDate = (deadlineDate) => {
      const current = new Date();
      return current > deadlineDate;
    };

    function createSectionsFromAuthorPaperList(papersList){
        const sectionsArray = [];
        papersList.forEach((element) => {
            sectionsArray.push({
              review1: element.reviewContentText1,
              review2: element.reviewContentText2,
              review3: element.reviewContentText3,
              title: element.title, 
              paperId: element.id, 
              paperURL: element.paperURL,
              isReviewed: element.isReviewed,
              reviewCounter: element.reviewCounter,
              finalVersion: element.finalVersion,
              deadlineDate: element.deadlineDate,
            });
        })
        setSections(sectionsArray);
    }

    const renderHeader = (section) => {
        return (
        <View style={styles.header}>
            <Text style={styles.headerText}>{section.title}</Text>
        </View>
        );
    };

    const renderContent = (section) => {
        return (
        <View style={styles.content}>
          { section.review1 ?
          <Text>
            <Text style={styles.reviewTextTitle}>Review 1: </Text>
            <Text style={styles.reviewText}>{section.review1}</Text>
          </Text>
            : 
            <Text>No review for now. Check again later!</Text>
          }
          { section.review2 ?
            <Text>
            <Text style={styles.reviewTextTitle}>Review 2: </Text>
            <Text style={styles.reviewText}>{section.review2}</Text>
          </Text>
            : 
            null
          }
          { section.review3 ?
            <Text>
            <Text style={styles.reviewTextTitle}>Review 3: </Text>
            <Text style={styles.reviewText}>{section.review3}</Text>
          </Text>
            : 
            null
          }
      
          { !checkDeadlineDate(section.deadlineDate) && section.isReviewed === true && section.reviewCounter === 3 && section.finalVersion === false &&
                <TouchableOpacity
                onPress = {() => {pickFinalDocumentForUpdate(section.title, section.paperId)}}
                style={styles.updateButton}
                >
                  <View style={styles.centerTextIconOnButton}>
                    <SelectFileIcon name="addfile" size={30} color="white" />
                    <Text style={styles.createPollButtonText}>Upload final paper</Text>
                  </View>
                </TouchableOpacity>
            }
            { !checkDeadlineDate(section.deadlineDate) && section.isReviewed === true && section.reviewCounter < 3 && section.finalVersion === false &&
                <TouchableOpacity
                onPress = {() => {pickDocumentForUpdate(section.title, section.paperId)}}
                style={styles.updateButton}
                >
                  <View style={styles.centerTextIconOnButton}>
                    <SelectFileIcon name="addfile" size={30} color="white" />
                    <Text style={styles.createPollButtonText}>Update paper</Text>
                  </View>
                </TouchableOpacity>
          }
          { section.finalVersion === true && section.reviewCounter === 3 && section.isReviewed === true ?
                <Text style={styles.reviewTextTitle}>Final version was uploaded!</Text>
            : 
                null
          }

            { checkDeadlineDate(section.deadlineDate) ?
              <Text style={styles.reviewTextTitle}>The deadline has passed. You can no longer update this paper.</Text>
            : null
            }

        </View>
      );
    };

    const updateSections = (activeSections) => {
        setActiveSections(activeSections);
    };

    const pickFinalDocumentForUpdate = async (title, paperId) => {
        let result = await DocumentPicker.getDocumentAsync({});
        if (Device.isDevice) {
          if (!result.canceled) {
            setDocumentURI(result.assets[0].uri);
            }
            setFileName(result.assets[0].name);
            uploadFinalDocumentForUpdate(result.assets[0].uri, title, paperId, result.assets[0].name);
        } else {
          if (!result.canceled) {
            setDocumentURI(result.uri);
          }
          setFileName(result.name);
          uploadFinalDocumentForUpdate(result.uri, title, paperId, result.name);
        }
    }

    const uploadFinalDocumentForUpdate = async (documentURI, title, paperId, fileName) => {
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

        const documentName = 'Paper_' + uid + '_' + utilsService.getRandomNumber();
        const storageRef  = ref(storage, `/Papers/${documentName}`);
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
              updateFinalPaperURL(title, paperId, url, fileName)
              return url
            });
          }
        );
    };

    const pickDocumentForUpdate = async (title, paperId) => {
        let result = await DocumentPicker.getDocumentAsync({});
        if (Device.isDevice) {
          if (!result.canceled) {
            setDocumentURI(result.assets[0].uri);
            }
            setFileName(result.assets[0].name);
            uploadDocumentForUpdate(result.assets[0].uri, title, paperId, result.assets[0].name);
        } else {
          if (!result.canceled) {
            setDocumentURI(result.uri);
          }
          setFileName(result.name);
          uploadDocumentForUpdate(result.uri, title, paperId, result.name);
        }
    }

    const uploadDocumentForUpdate = async (documentURI, title, paperId, fileName) => {
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

        const documentName = 'Paper_' + uid + '_' + utilsService.getRandomNumber();
        const storageRef  = ref(storage, `/Papers/${documentName}`);
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
              updatePaperURL(title, paperId, url, fileName)
              return url
            });
          }
        );
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

        const documentName = 'Paper_' + uid + '_' + utilsService.getRandomNumber();
        const storageRef  = ref(storage, `/Papers/${documentName}`);
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

    function addPaper(paperTitle) {
      setPaper(
        paperTitle,
        documentURL,
        fileName,
        props.route.params.eventId,
        setPaperTitle,
        papersRetrieved,
        sendPushToReviewers);
    }

    const eventId = props.route.params.eventId;
    async function updatePaperURL(title, paperId, paperURL, fileName) {
      await updatePaper(
        title,
        paperId,
        paperURL,
        fileName,
        sendPushToReviewers);
        props.navigation.navigate('Timeline', {eventId})
    }

    async function updateFinalPaperURL(title, paperId, paperURL, fileName) {
      await uploadFinalPaper(
        title,
        paperId,
        paperURL,
        fileName,
        props.navigation.navigate,
        sendFinalPushToReviewers);
        props.navigation.navigate('Timeline', {eventId})
    }

    function sendPushToReviewers(paperTitle) {
      reviewersList.forEach((reviewer) => {
          const reviewerToken = reviewer.userDetails.pushToken;
          const title = 'Paper to review: ' + paperTitle;
          const body = 'You have to review this paper!';
          PushNotificationService.sendPushNotification(
            reviewerToken,
            title,
            body,
            {
              type: 'uploadDocument',
              paperTitle: paperTitle,
            }
          );
      })
    }

    function sendFinalPushToReviewers(paperTitle) {
      reviewersList.forEach((reviewer) => {
          const reviewerToken = reviewer.userDetails.pushToken;
          const title = 'Final version of the paper: ' + paperTitle;
          const body = 'Final version of the paper was uploaded!';
          PushNotificationService.sendPushNotification(
            reviewerToken,
            title,
            body,
            { }
          );
      })
    }

    return (
        <View style={styles.container}>

          <View style={styles.accordionContainer}>
            <Accordion
                sections={sections}
                activeSections={activeSections}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={updateSections}
            />
          </View>

        {/* SELECT PAPER BUTTON */}
        {papersList.length < 3 ? 
        <View>
        { documentURL ? 
            <TouchableOpacity onPress={()=>{WebBrowser.openBrowserAsync(documentURL)}}>
            <Text style={styles.fileName}>{fileName}</Text>
            </TouchableOpacity>
        : null
        }
        
        <View style={styles.imageButtonsContainer}>
            <TouchableOpacity
            onPress = {pickDocument}
            style={styles.imageButton}
            >
              <View style={styles.centerTextIconOnButton}>
                <SelectFileIcon name="addfile" size={30} color="white" />
                <Text style={styles.createPollButtonText}>Select paper</Text>
              </View>
            </TouchableOpacity>
          </View>
        
        <View style={styles.bottomContainer}>
            <View style={styles.inputContainer}>
                <Text style={styles.textInputsTitle}>Title</Text>
                <TextInput
                placeholder="Title"
                value={paperTitle}
                onChangeText={(text) => setPaperTitle(text)}
                style={styles.input}
                />
            </View>
           
            <TouchableOpacity
                onPress={() => addPaper(paperTitle)}
                style={styles.button}
                >
              <View style={styles.centerTextIconOnButton}>
                <SendCommentIcon name="send" size={25} color="white" />
                <Text style={styles.createPollButtonText}>Send</Text>
              </View>
            </TouchableOpacity>
        </View>
      </View>
    : null
    }
      </View>
  );
}

export default AuthorUploadsPapers

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#89cff0',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#0782F9',
    padding: 10,
    marginTop: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  content: {
    padding: 20,
    backgroundColor: '#89cff0',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#0782F9',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },
  inputContainer: {
      width: '70%',
      marginTop: 10,
      paddingLeft: 10,
      paddingRight: 23,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 20,
  },
  imageContainer: {
    marginTop: 10,
    backgroundColor: '#89cff0',
  },
  imageButton: {
    backgroundColor: '#0782F9',
    width: '40%',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 30,
  },
  updateButton: {
    backgroundColor: '#0782F9',
    width: '45%',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 30,
  },
  imageButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17,
  },
  button: {
    backgroundColor: '#0782F9',
    marginTop: 50,
    width: '24%',
    padding: 4,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  textInputsTitle: {
    fontSize: 20,
    fontWeight: "600",
    paddingLeft: 3,
    marginTop: 10,
  },
  fileName: {
    backgroundColor: 'white',
    fontSize: 17,
    fontWeight: "600",
    marginTop: 10,
    marginLeft: '7%',
    marginRight: '7%',
    alignSelf: 'center',
  },
  imageButtonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flexDirection: 'row', 
    flexWrap:'wrap',
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
    height: '100%',
    justifyContent: 'center',
    alignItems:'center',
  },
  accordionContainer: {
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  reviewText: {
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 3,
  },
  reviewTextTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  });