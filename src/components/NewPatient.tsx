import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Picker, Button
} from 'react-native';
import { database } from "../storage/Database";
import { ImageSync } from '../storage/ImageSync'
import { uuid } from 'uuidv4';
import styles from './Style';
import DatePicker from 'react-native-datepicker'
import { LocalizedStrings } from '../enums/LocalizedStrings';
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import { EventTypes } from '../enums/EventTypes';

const NewPatient = (props) => {
  const imageSync = new ImageSync();
  const [givenName, setGivenName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState('');
  const [male, setMale] = useState(false);
  const [country, setCountry] = useState('');
  const [hometown, setHometown] = useState('');
  const [phone, setPhone] = useState('');
  const [imageTimestamp, setImageTimestamp] = useState('');
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))
  const [camp, setCamp] = useState('');

  const [
    { cameraRef, type, ratio, autoFocusPoint },
    { takePicture, toggleFacing, touchToFocus, facesDetected, }
  ] = useCamera()

  const [cameraOpen, setCameraOpen] = useState(false);
  const today = new Date();
  const [patientId] = useState(uuid().replace(/-/g, ''));

  const handleSaveCamp = (campName: string) => {
    database.addEvent({
      id: uuid(),
      patient_id: patientId,
      visit_id: null,
      event_type: EventTypes.Camp,
      event_metadata: campName
    }).then(() => console.log('camp saved'))
  }

  const addPatient = async () => {
    const givenNameId = await database.saveStringContent([{ language: language, content: givenName }])
    const surnameId = await database.saveStringContent([{ language: language, content: surname }])
    const countryId = await database.saveStringContent([{ language: language, content: country }])
    const hometownId = await database.saveStringContent([{ language: language, content: hometown }])

    database.addPatient({
      id: patientId,
      given_name: givenNameId,
      surname: surnameId,
      date_of_birth: dob,
      country: countryId,
      hometown: hometownId,
      phone: phone,
      sex: male ? 'M' : 'F',
      image_timestamp: imageTimestamp
    }).then(() => {
      if (!!camp) {
        handleSaveCamp(camp)
      }
      props.navigation.navigate('PatientList', {
        reloadPatientsToggle: !props.navigation.state.params.reloadPatientsToggle,
        imagesSynced: null,
        language: language
      })
    })

  };

  const LanguageToggle = () => {
    return (
      <Picker
        selectedValue={language}
        onValueChange={value => setLanguage(value)}
        style={[styles.picker, { marginLeft: 10 }]}
      >
        <Picker.Item value='en' label='en' />
        <Picker.Item value='ar' label='ar' />
      </Picker>
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

  const capture = async () => {
    try {
      let d = today.getTime().toString();
      setImageTimestamp(d)
      const data = await takePicture()
      await imageSync.saveImage(patientId, data.uri, d)
      setCameraOpen(false)
    } catch (error) {
      console.warn(error);
    }
  };

  return cameraOpen ? (
    <View style={{ flex: 1 }}>
      <RNCamera
        ref={cameraRef}
        autoFocusPointOfInterest={autoFocusPoint.normalized}
        type="back"
        autoFocus="on"
        ratio={ratio}
        style={{ flex: 1 }}
        onFacesDetected={facesDetected}
        captureAudio={false}
      />
      <TouchableWithoutFeedback
        style={{
          flex: 1,
        }}
        onPress={touchToFocus}
      ><View /></TouchableWithoutFeedback>

      <TouchableOpacity
        style={{ position: 'absolute', bottom: 20, right: '50%', transform: [{ translateX: 20 }] }}
        onPress={capture}
      ><Image source={require('../images/shutter.png')} style={{ width: 40, height: 40 }} />
      </TouchableOpacity>
    </View>
  ) : (
      <View style={styles.container}>
        {LanguageToggle()}
        <View style={styles.inputRow}>
          {!!imageTimestamp ?
            <Image source={{ uri: `${imageSync.imgURI(patientId)}/${imageTimestamp}.jpg` }} style={{ width: 100, height: 100, justifyContent: 'center', marginRight: 10 }}>
            </Image> : null}
          <TouchableOpacity onPress={() => setCameraOpen(true)}>
            <Image source={require('../images/camera.png')} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
        </View>
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
            maxDate={today.toISOString().split('T')[0]}
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
            style={[styles.inputs]}
            placeholder={LocalizedStrings[language].camp}
            onChangeText={(text) => {
              setCamp(text)
            }}
            value={camp}
          />
          <TextInput
            style={styles.inputs}
            placeholder={LocalizedStrings[language].phone}
            onChangeText={(text) => setPhone(text)}
            value={phone}
          />
        </View>
        <View style={{ marginTop: 30 }}>
          <Button
            title={LocalizedStrings[language].save}
            color={'#F77824'}
            onPress={() => addPatient()}
          />
        </View>
      </View>
    );
};

export default NewPatient;
