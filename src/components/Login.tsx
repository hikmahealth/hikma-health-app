import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity
} from 'react-native';

import { database } from "../storage/Database";
import { StringContent } from '../types/StringContent';
import { NewUser} from '../types/User';
import LinearGradient from 'react-native-linear-gradient';
import { DatabaseSync } from '../storage/Sync'
import { ImageSync } from '../storage/ImageSync'
import { Clinic } from '../types/Clinic';
import styles from './Style';

const Login = (props) => {
  const databaseSync = new DatabaseSync();
  const imageSync = new ImageSync();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  let userId = '';
  let clinicId = '';

  const remoteLogin = async (): Promise<any> => {
    const response = await fetch('https://demo-api.hikmahealth.org/api/login', {
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

      if (!!responseJson.message) {
        setLoginFailed(true);
        setErrorMsg(responseJson.message);
        return;
      }

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
      userId = responseJson.id.replace(/-/g, "");
      await database.addUser(newUser, password)
    } else {
      userId = user.id
    }

    const clinics: Clinic[] = await database.getClinics();
    if (clinics.length == 0) {
      await databaseSync.performSync(email, password)
      await imageSync.syncPhotos(email, password)
      const clinicsResponse: Clinic[] = await database.getClinics()
      clinicId = clinicsResponse[0].id
    } else {
      clinicId = clinics[0].id
    }
    props.navigation.navigate('PatientList', { email: email, password: password, reloadPatientsToggle: false, clinicId: clinicId, userId: userId })

  };

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.loginContainer}>
      <View >
        <Image source={require('../images/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.loginInputsContainer}>
        <TextInput
          style={loginFailed ? styles.loginInputsFailed : styles.loginInputs}
          placeholder="Email"
          onChangeText={(text) => {
            setEmail(text);
            setLoginFailed(false);
          }}
          value={email}
        />
        <TextInput
          style={loginFailed ? styles.loginInputsFailed : styles.loginInputs}
          placeholder="Password"
          onChangeText={(text) => {
            setPassword(text);
            setLoginFailed(false);
          }}
          value={password}
          secureTextEntry={true}
        />
        {loginFailed ? <Text style={{ color: '#FF0000', fontSize: 10, paddingLeft: 10 }}>Login Error: {errorMsg}</Text> : null}
      </View>

      <View >
        <TouchableOpacity onPress={handleLogin}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Login;
