import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TextInput, StyleSheet, Button, TouchableOpacity
} from 'react-native';

import { database } from "../database/Database";
import { StringContent } from '../types/StringContent';
import { uuid } from 'uuidv4';


const NewPatient = (props) => {
  const [givenName, setGivenName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState('');
  const [male, setMale] = useState(false);
  const [country, setCountry] = useState('');
  const [hometown, setHometown] = useState('');
  const [phone, setPhone] = useState('');

  const addPatient = async () => {
    const givenNameId = await database.saveStringContent({ language: 'en', content: givenName })
    const surnameId = await database.saveStringContent({ language: 'en', content: surname })
    const countryId = await database.saveStringContent({ language: 'en', content: country })
    const hometownId = await database.saveStringContent({ language: 'en', content: hometown })
    

    database.addPatient({
      id: uuid(),
      given_name: givenNameId,
      surname: surnameId,
      date_of_birth: dob,
      country: countryId,
      hometown: hometownId,
      phone: phone,
      sex: male ? 'M' : 'F'
    }).then(() => props.navigation.navigate('PatientList'))

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
          onChangeText={(text) => setGivenName(text)}
          value={givenName}
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
          placeholder="DOB yyyy-mm-dd"
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
          placeholder="Hometown"
          onChangeText={(text) => setHometown(text)}
          value={hometown}
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
