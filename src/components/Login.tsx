import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TextInput, StyleSheet, Button, TouchableOpacity
} from 'react-native';

import { database } from "../database/Database";
import loginValidator from '../validators/loginValidator';
import { StringContent } from '../types/StringContent';
import { NewUser, User } from '../types/User';
import LinearGradient from 'react-native-linear-gradient';

import DatabaseSync from '../database/Sync'
import { Clinic } from '../types/Clinic';
import styles from './Style';

const Login = (props) => {
  const databaseSync: DatabaseSync = new DatabaseSync();
  const [email, setEmail] = useState(props.email || 'sam@hikmahealth.org');
  const [password, setPassword] = useState(props.password || 'c43171c8a242');
  let userId = '';
  let clinicId = '';

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
      userId = responseJson.id
      await database.addUser(newUser, password)
    } else {
      userId = user.id
    }

    database.getClinics().then(async (clinics: Clinic[]) => {
      if (clinics.length == 0) {
        await databaseSync.performSync(email, password)
        const clinicsResponse: Clinic[] = await database.getClinics()
        clinicId = clinicsResponse[0].id
      } else {
        clinicId = clinics[0].id
      }
    }).then(() => {
        props.navigation.navigate('PatientList', { email: email, password: password, reloadPatientsToggle: false, clinicId: clinicId, userId: userId })
      })

  };

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.loginContainer}>
      <View >
        <Image source={require('../images/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.loginInputsContainer}>
        <TextInput
          style={styles.loginInputs}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.loginInputs}
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
    </LinearGradient>
  );
};

export default Login;
