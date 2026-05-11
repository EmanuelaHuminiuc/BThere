import React, {useEffect, useState} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { auth } from '../../firebase/firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn,setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        navigation.replace("Dashboard")
      }
    })
    return unsubscribe
  }, []);

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then ((re) => {
      setIsSignedIn(true);
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 'auth/invalid-email') {
        showAlert();
      }
      if (err.code === 'auth/wrong-password') {
        showAlert();
      }
    })
  }

  const registerPressHandler = () => {
    navigation.navigate('Register');
  }

  function showAlert() {
    Alert.alert(
      'Invalid credentials',
      'The credentials are wrong. Try again!',
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
      behavior="padding"
    >
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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress = {handleSignIn}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={registerPressHandler}
          style={[styles.button, styles.buttonOutLine]}
        >
          <Text style={styles.buttonOutLineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

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
    marginBottom: 10,
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
    fontSize: 18,
  },
  buttonOutLineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 18,
  },
});