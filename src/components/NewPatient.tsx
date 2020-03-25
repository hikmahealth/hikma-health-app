import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity
} from 'react-native';

import { database } from "../database/Database";
import { uuid } from 'uuidv4';
import styles from './Style';
import DatePicker from 'react-native-datepicker'
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings';

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
        <View style={styles.outerRadioButton}>
          {props.selected ? <View style={styles.selectedRadioButton} /> : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.container}>
      {LanguageToggle()}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].firstName}
          onChangeText={(text) => setGivenName(text)}
          value={givenName}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].surname}
          onChangeText={(text) => setSurname(text)}
          value={surname}
        />
      </View>
      <View style={styles.inputRow}>
        <DatePicker
          style={styles.datePicker}
          date={dob}
          mode="date"
          placeholder={LocalizedStrings[language].selectDob}
          format="YYYY-MM-DD"
          minDate="1900-05-01"
          maxDate="2020-03-27"
          confirmBtnText={LocalizedStrings[language].confirm}
          cancelBtnText={LocalizedStrings[language].cancel}
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
          <Text style={[{ color: '#FFFFFF' }]}>{LocalizedStrings[language].gender}</Text>
          <View style={[{ flexDirection: 'row' }]}>
            {RadioButton({ selected: male })}<Text style={[{ color: '#FFFFFF', paddingHorizontal: 5 }]}>M</Text>
            {RadioButton({ selected: !male })}<Text style={[{ color: '#FFFFFF', paddingHorizontal: 5 }]}>F</Text>
          </View>
        </View>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].country}
          onChangeText={(text) => setCountry(text)}
          value={country}
        />
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].hometown}
          onChangeText={(text) => setHometown(text)}
          value={hometown}
        />
      </View>
      <View style={styles.inputRow}>

        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].phone}
          onChangeText={(text) => setPhone(text)}
          value={phone}
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <TouchableOpacity onPress={() => addPatient()}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>


  );
};

export default NewPatient;
