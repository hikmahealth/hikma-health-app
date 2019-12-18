import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TextInput, StyleSheet, Button, TouchableOpacity
} from 'react-native';

import { database } from "../database/Database";
import loginValidator from '../validators/loginValidator';
import { StringContent } from '../types/StringContent';
import { User } from '../types/User';

import DatabaseSync from '../database/Sync'
import { Clinic } from '../types/Clinic';

const Login = (props) => {
  const databaseSync: DatabaseSync = new DatabaseSync();
  const [email, setEmail] = useState(props.email || 'sam@hikmahealth.org');
  const [password, setPassword] = useState(props.password || 'c43171c8a242');
  const [loggedInUser, setLoggedInUser] = useState({
    id: '',
    name: '',
    email: '',
    role: ''
  });

  const callSync = () => {


    databaseSync.performSync(email, password);
  }

  const handleLogin = () => {

    database.login(email, password).then((user) => {
      if (!!user && !!user.id) {
        setLoggedInUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        })
        // setLoggedInUser('userEmail');

      }
      console.log('logged in user: ' + user)

      if (user === null || user === undefined) {
        console.log("email: " + email)
        console.log("password: " + password)

        // fetch('https://demo-api.hikmahealth.org/api/login', {
        fetch('http://gpu.cairnlabs.com:42069/api/login', {

          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "email": email,
            "password": password,
          })
        }).then((response) => 
            response.json())
          .then((responseJson) => {


        // const responseJson = {
        //   "email": "sam@hikmahealth.org",
        //   "id": "f3f8842b-740b-4d1e-a7f0-494123d75f28",
        //   "name": {
        //     "content": {
        //       "en": "Sam Brotherton"
        //     },
        //     "id": "6850456f-3ddf-4c34-82ce-9001f1ec4080"
        //   },
        //   "role": "super_admin"
        // }
        console.log('response' + responseJson)
        const stringContent: StringContent = {
          language: Object.keys(responseJson.name.content)[0],
          content: responseJson.name.content[Object.keys(responseJson.name.content)[0]]
        }

        database.saveStringContent(stringContent, responseJson.name.id)
          .then(stringId => {
            const newUser: User = {
              id: responseJson.id,
              name: stringId,
              role: responseJson.role,
              email: responseJson.email
            }
            database.addUser(newUser, password);
            setLoggedInUser(newUser);
          })
        })
        .then(() => {
          database.getClinics().then((clinics: Clinic[]) => {
            if (clinics.length == 0) {
              databaseSync.performSync(email, password);
            }
          })
        })
        .catch((error) => {
          console.error(error);
        });
      }
      props.navigation.navigate('PatientList', { localUser: loggedInUser })

    })


  };

  return (
    <View style={styles.container}>
      <View >
        <Image source={require('../images/logo.png')} style={styles.image} />
      </View>
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>

      <View >
        <TouchableOpacity onPress={() => handleLogin()}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#31BBF3',
    },
    inputsContainer: {
      width: '90%',
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      height: 140,
      marginTop: 30,
      marginBottom: 30,
      justifyContent: 'center',
    },
    inputs: {
      margin: 10,
      padding: 10,
      height: 40,
      borderRadius: 12,
      borderColor: '#EAEAEA',
      borderWidth: .5,
    },
    image: {
      width: 110,
      height: 140,
      resizeMode: 'stretch'
    }

  }
);

export default Login;
