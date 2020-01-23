import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity
} from 'react-native';

import { database } from "../database/Database";
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';


const EditPatient = (props) => {

  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))

  const patient = props.navigation.getParam('patient');

  const [givenNameText, setGivenNameText] = useState(props.navigation.state.params.patient.given_name.content[language] || '');
  const [surnameText, setSurnameText] = useState(props.navigation.state.params.patient.surname.content[language] || '');
  const [dob, setDob] = useState(props.navigation.state.params.patient.date_of_birth);
  const [male, setMale] = useState(props.navigation.state.params.patient.sex === 'M');
  const [countryText, setCountryText] = useState(props.navigation.state.params.patient.country.content[language] || '');
  const [hometownText, setHometownText] = useState(props.navigation.state.params.patient.hometown.content[language] || '');
  const [phone, setPhone] = useState(props.navigation.state.params.patient.phone || '');

  const editPatient = async () => {
    await database.editStringContent([{ language: language, content: givenNameText }], patient.given_name.id)
    await database.editStringContent([{ language: language, content: surnameText }], patient.surname.id)
    await database.editStringContent([{ language: language, content: countryText }], patient.country.id)
    await database.editStringContent([{ language: language, content: hometownText }], patient.hometown.id)


    database.editPatient({
      id: patient.id,
      given_name: patient.given_name.id,
      surname: patient.surname.id,
      date_of_birth: dob,
      country: patient.country.id,
      hometown: patient.hometown.id,
      phone: phone,
      sex: male ? 'M' : 'F'
    }).then((updatedPatient) => props.navigation.navigate('PatientView', {
      patient: updatedPatient,
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
            onChangeText={setGivenNameText}
            value={givenNameText}
          />
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder="Surname"
            onChangeText={setSurnameText}
            value={surnameText}
          />
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder="DOB yyyy-mm-dd"
            onChangeText={setDob}
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
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder="Country"
            onChangeText={setCountryText}
            value={countryText}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Hometown"
            onChangeText={setHometownText}
            value={hometownText}
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
        <TouchableOpacity onPress={() => editPatient()}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>


  );
};

export default EditPatient;
