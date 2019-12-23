import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TextInput, StyleSheet, Button, TouchableOpacity
} from 'react-native';

import { database } from "../database/Database";
import loginValidator from '../validators/loginValidator';
import { StringContent } from '../types/StringContent';
import { NewUser, User } from '../types/User';

import DatabaseSync from '../database/Sync'
import { Clinic } from '../types/Clinic';

const Login = (props) => {
  const databaseSync: DatabaseSync = new DatabaseSync();
  const [email, setEmail] = useState(props.email || 'sam@hikmahealth.org');
  const [password, setPassword] = useState(props.password || 'c43171c8a242');

  const remoteLogin = async (): Promise<any> => {
    // fetch('https://demo-api.hikmahealth.org/api/login', {
    const response = await fetch('http://216.21.162.104:42069/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "password": password,
      })
    });
    return await response.json();
  }

  const handleLogin = async () => {

    const user = await database.login(email, password)

    if (user === null || user === undefined) {
      console.log("email: " + email)
      console.log("password: " + password)

      const responseJson = await remoteLogin();

      console.log('response' + responseJson)

      const contentArray = Object.keys(responseJson.name.content)
      const stringContentArray: StringContent[] = []

      contentArray.forEach(element => {
        stringContentArray.push({
          language: element,
          content: responseJson.name.content[element]
        })
      })


      const nameId = await database.saveStringContent(stringContentArray, responseJson.name.id)

      const newUser: NewUser = {
        id: responseJson.id,
        name: nameId,
        role: responseJson.role,
        email: responseJson.email
      }
      await database.addUser(newUser, password)
      }

      database.getClinics().then((clinics: Clinic[]) => {
        if (clinics.length == 0) {
          databaseSync.performSync(email, password);
        }
      })
    

    props.navigation.navigate('PatientList', { email: email, password: password, reloadPatientsToggle: false })



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
