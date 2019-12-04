import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TextInput, StyleSheet, Button, TouchableOpacity
} from 'react-native';

import invoke from 'lodash/invoke';
import loginValidator from '../validators/loginValidator';


const Login = (props) => {
  const [email, setEmail] = useState(props.email || '');
  const [password, setPassword] = useState(props.password || '');

  const handleLogin = () => {
    props.navigation.navigate('PatientList')

    fetch('https://demo-api.hikmahealth.org/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        return responseJson.users;
      })
      .catch((error) => {
        console.error(error);
      });

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
        <TouchableOpacity onPress={() => props.navigation.navigate('PatientList')}>
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
