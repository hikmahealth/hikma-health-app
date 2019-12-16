import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TextInput, StyleSheet, Button, TouchableOpacity
} from 'react-native';

import { database } from "../database/Database";
import { StringContent } from '../types/StringContent';

const NewPatient = (props) => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState('');
  const [male, setMale] = useState(false);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [other, setOther] = useState('');

  const addPatient = () => {

    // database.addPatient(email, password).then((user) => {
    // })



  };

  function RadioButton(props) {
    return (
      <TouchableOpacity onPress={() => setMale(!male)}>
      <View style={[{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
      }, props.style]}>
        {
          props.selected ?
            <View style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: 'green',
            }} />
            : null
        }
      </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="First Name"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
        />
        </View>
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Surname"
          onChangeText={(text) => setSurname(text)}
          value={surname}
        />
      </View>
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="DOB"
          onChangeText={(text) => setDob(text)}
          value={dob}
        />
        <View >
          <Text style={[{ color: '#FFFFFF' }]}>Gender</Text>
          <View style={[{ flexDirection: 'row' }]}>
            {RadioButton({ selected: male })}<Text style={[{ color: '#FFFFFF', paddingHorizontal: 5 }]}>Male</Text>
            {RadioButton({ selected: !male })}<Text style={[{ color: '#FFFFFF', paddingHorizontal: 5 }]}>Female</Text>
          </View>
        </View>
      </View>
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Country"
          onChangeText={(text) => setCountry(text)}
          value={country}
        />
        <TextInput
          style={styles.inputs}
          placeholder="City"
          onChangeText={(text) => setCity(text)}
          value={city}
        />
      </View>
      <View style={styles.inputsContainer}>

        <TextInput
          style={styles.inputs}
          placeholder="Phone no"
          onChangeText={(text) => setPhone(text)}
          value={phone}
        />
        </View>
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Other"
          onChangeText={(text) => setOther(text)}
          value={other}
        />
      </View>
      <View >
        <TouchableOpacity onPress={() => addPatient()}>
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
      maxWidth: '90%',
      flexDirection: 'row',
    },
    inputs: {
      backgroundColor: '#FFFFFF',
      margin: 10,
      padding: 10,
      height: 40,
      borderRadius: 12,
      borderColor: '#EAEAEA',
      borderWidth: .5,
      width: '100%',
      flex: 1
    },

    image: {
      width: 110,
      height: 140,
      resizeMode: 'stretch'
    }

  }
);

export default NewPatient;
