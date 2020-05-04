import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, Platform, Picker, TouchableWithoutFeedback
} from 'react-native';
import { ImageSync } from '../storage/ImageSync'
import { database } from "../storage/Database";
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-datepicker'
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import { LocalizedStrings } from '../enums/LocalizedStrings';

const EditPatient = (props) => {
  const imageSync = new ImageSync();
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))

  const [
    { cameraRef, type, ratio, autoFocusPoint },
    { takePicture, toggleFacing, touchToFocus, facesDetected, }
  ] = useCamera()
  const patient = props.navigation.getParam('patient');

  const [givenNameText, setGivenNameText] = useState(props.navigation.state.params.patient.given_name.content[language] || '');
  const [surnameText, setSurnameText] = useState(props.navigation.state.params.patient.surname.content[language] || '');
  const [dob, setDob] = useState(props.navigation.state.params.patient.date_of_birth);
  const [male, setMale] = useState(props.navigation.state.params.patient.sex === 'M');
  const [countryText, setCountryText] = useState(props.navigation.state.params.patient.country.content[language] || '');
  const [hometownText, setHometownText] = useState(props.navigation.state.params.patient.hometown.content[language] || '');
  const [phone, setPhone] = useState(props.navigation.state.params.patient.phone || '');
  const [imageTimestamp, setImageTimestamp] = useState(props.navigation.state.params.patient.image_timestamp || '');
  const [cameraOpen, setCameraOpen] = useState(false);
  const today = new Date();

  const editPatient = async () => {
    if (!!patient.given_name.content[language]) {
      await database.editStringContent([{ language: language, content: givenNameText }], patient.given_name.id)
      await database.editStringContent([{ language: language, content: surnameText }], patient.surname.id)
      await database.editStringContent([{ language: language, content: countryText }], patient.country.id)
      await database.editStringContent([{ language: language, content: hometownText }], patient.hometown.id)
    } else {
      await database.saveStringContent([{ language: language, content: givenNameText }], patient.given_name.id, true)
      await database.saveStringContent([{ language: language, content: surnameText }], patient.surname.id, true)
      await database.saveStringContent([{ language: language, content: countryText }], patient.country.id, true)
      await database.saveStringContent([{ language: language, content: hometownText }], patient.hometown.id, true)
    }

    database.editPatient({
      id: patient.id,
      given_name: patient.given_name.id,
      surname: patient.surname.id,
      date_of_birth: dob,
      country: patient.country.id,
      hometown: patient.hometown.id,
      phone: phone,
      sex: male ? 'M' : 'F',
      image_timestamp: imageTimestamp
    }).then((updatedPatient) => props.navigation.navigate('PatientView', {
      patient: updatedPatient,
      language: language
    }))
  };

  useEffect(() => {
    setGivenNameText(patient.given_name.content[language] || '');
    setSurnameText(patient.surname.content[language] || '');
    setCountryText(patient.country.content[language] || '');
    setHometownText(patient.hometown.content[language] || '');
  }, [language])

  const capture = async () => {
    try {
      let d = today.getTime().toString();
      setImageTimestamp(d)
      const data = await takePicture()
      await imageSync.saveImage(patient.id, data.uri, d)
      setCameraOpen(false)
    } catch (error) {
      console.warn(error);
    }
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
        <Picker.Item value='sp' label='sp' />
      </Picker>
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
      <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.container}>
        {LanguageToggle()}
        <View style={styles.inputRow}>
          {!!imageTimestamp ?
            <Image source={{ uri: `${imageSync.imgURI(patient.id)}/${imageTimestamp}.jpg` }} style={{ width: 100, height: 100, justifyContent: 'center', marginRight: 10 }}>
            </Image> : null}
          <TouchableOpacity onPress={() => setCameraOpen(true)}>
            <Image source={require('../images/camera.png')} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder={LocalizedStrings[language].firstName}
            onChangeText={setGivenNameText}
            value={givenNameText}
          />
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder={LocalizedStrings[language].surname}
            onChangeText={setSurnameText}
            value={surnameText}
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
            onChangeText={setCountryText}
            value={countryText}
          />
          <TextInput
            style={styles.inputs}
            placeholder={LocalizedStrings[language].hometown}
            onChangeText={setHometownText}
            value={hometownText}
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
          <TouchableOpacity onPress={() => editPatient()}>
            <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
};

export default EditPatient;
