import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity
} from 'react-native';

import { database } from "../database/Database";
import { uuid } from 'uuidv4';
import styles from './Style';
import DatePicker from 'react-native-datepicker'
import LinearGradient from 'react-native-linear-gradient';

const NewPatient = (props) => {
  const [givenName, setGivenName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState('');
  const [male, setMale] = useState(false);
  const [country, setCountry] = useState('');
  const [hometown, setHometown] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))

  const addPatient = async () => {
    const givenNameId = await database.saveStringContent([{ language: language, content: givenName }])
    const surnameId = await database.saveStringContent([{ language: language, content: surname }])
    const countryId = await database.saveStringContent([{ language: language, content: country }])
    const hometownId = await database.saveStringContent([{ language: language, content: hometown }])


    database.addPatient({
      id: uuid(),
      given_name: givenNameId,
      surname: surnameId,
      date_of_birth: dob,
      country: countryId,
      hometown: hometownId,
      phone: phone,
      sex: male ? 'M' : 'F'
    }).then(() => props.navigation.navigate('PatientList', {
      reloadPatientsToggle: !props.navigation.state.params.reloadPatientsToggle,
      language: language
    }))

  };

  const LanguageToggle = () => {
    return (
      <TouchableOpacity onPress={() => {
        if (language === 'en') {
          setLanguage('ar')
        } else {
          setLanguage('en')
        }
      }}>
        <Text style={styles.text}>{language}</Text>
      </TouchableOpacity>
    )
  }

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
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={[styles.container, { alignItems: 'center' }]}>
      {LanguageToggle()}
      <View style={styles.inputsContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder="First Name"
            onChangeText={(text) => setGivenName(text)}
            value={givenName}
          />
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder="Surname"
            onChangeText={(text) => setSurname(text)}
            value={surname}
          />
        </View>
        <View style={styles.inputRow}>
          <DatePicker
            style={{
              backgroundColor: '#FFFFFF',
              margin: 10,
              paddingHorizontal: 10,
              height: 40,
              borderRadius: 12,
              borderColor: '#EAEAEA',
              borderWidth: .5,
              width: '100%',
              flex: 1,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
            date={dob}
            mode="date"
            placeholder="Select DOB"
            format="YYYY-MM-DD"
            minDate="1900-05-01"
            maxDate="2020-01-27"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateInput: {
                alignItems: 'flex-start',
                borderWidth: 0
              }
            }}
            androidMode='spinner'
            onDateChange={(date) => setDob(date)}
          />
          <View >
            <Text style={[{ color: '#FFFFFF' }]}>Gender</Text>
            <View style={[{ flexDirection: 'row' }]}>
              {RadioButton({ selected: male })}<Text style={[{ color: '#FFFFFF', paddingHorizontal: 5 }]}>Male</Text>
              {RadioButton({ selected: !male })}<Text style={[{ color: '#FFFFFF', paddingHorizontal: 5 }]}>Female</Text>
            </View>
          </View>
        </View>
        <View style={styles.inputRow}>
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
        <View style={styles.inputRow}>

          <TextInput
            style={styles.inputs}
            placeholder="Phone no"
            onChangeText={(text) => setPhone(text)}
            value={phone}
          />
        </View>
      </View>
      <View >
        <TouchableOpacity onPress={() => addPatient()}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>


  );
};

export default NewPatient;
