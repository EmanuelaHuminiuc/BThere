import React, {useEffect, useState} from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebase/firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setProfile } from '../../firebase/dbSetFunctions';
import PushNotificationService from '../PushNotificationsService/PushNotificationsService';

const RegisterScreen = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [isSignedIn, setIsSignedIn] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if(user && isSignedIn) {
          navigation.replace("Dashboard")
        }
      })
  
      return unsubscribe
    }, []);

    const validatePassword = (_callback) => {
      if (password == confirmPassword) {
        _callback();
      } else {
        Alert.alert("Password and Confirm Password does not match.");
        return false;
      }
    };

    const afterValidation = () => {
      createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        PushNotificationService.registerForPushNotificationsAsync()
        .then((pushToken) => {
          setProfile(
            response.user.uid,
            response.user.email,
            userFirstName,
            userLastName,
            pushToken)
          setIsSignedIn(true)
        })
      })
      .catch ((re) => {
        if (re.code === 'auth/email-already-in-use') {
          showEmailAlreadyExistsAlert();
        }
        if (re.code === 'auth/invalid-email') {
          showInvalidEmailAlert();
        }
        if (re.code === 'auth/weak-password') {
          showWeakPasswordAlert();
        }
      })
    };

    const handleRegister = () => {                             
      validatePassword(afterValidation);
    };

    function showInvalidEmailAlert() {
      Alert.alert(
        'Invalid email',
        'The email is invalid. Check it again!',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
          {
            cancelable: true
          },
    )};
  
    function showWeakPasswordAlert() {
      Alert.alert(
        'Weak password',
        'The password is too short, it should be at least 6 characters!',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
          {
            cancelable: true
          },
    )};

    function showEmailAlreadyExistsAlert() {
      Alert.alert(
        'Email already exits',
        'The email already exists. Choose another one!',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
          {
            cancelable: true
          },
    )};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding">

      <View style={styles.inputContainer}>
        <Text style={styles.inputsTitle}>Email</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />

        <Text style={styles.inputsTitle}>Password</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />

        <Text style={styles.inputsTitle}>Confirm password</Text>
        <TextInput
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          style={styles.input}
          secureTextEntry
        />

        <Text style={styles.inputsTitle}>First name</Text>
        <TextInput
          placeholder="First name"
          value={userFirstName}
          onChangeText={(text) => setUserFirstName(text)}
          style={styles.input}
        />

        <Text style={styles.inputsTitle}>Last name</Text>
        <TextInput
          placeholder="Last name"
          value={userLastName}
          onChangeText={(text) => setUserLastName(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress = {handleRegister}
          style={[styles.button, styles.buttonOutLine]}
        >
          <Text style={styles.buttonOutLineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: "center",
  backgroundColor: '#89cff0',
},
inputsTitle: {
  fontSize: 16,
  fontWeight: "600",
  paddingLeft: 3,
  marginTop: 10,
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
  marginTop: 5,
},
buttonContainer: {
  width: '60%',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 40,
},
button: {
  backgroundColor: '#0782F9',
  width: '100%',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
},
buttonOutLine: {
  backgroundColor: 'white',
  marginTop: 5,
  borderColor: '#0782F9',
  borderWidth: 2,
},
buttonText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 16,
},
buttonOutLineText: {
  color: '#0782F9',
  fontWeight: '700',
  fontSize: 18,
},
});