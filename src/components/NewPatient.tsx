import React, { useState, useRef } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, ImageBackground, Platform
} from 'react-native';
import RNFS from 'react-native-fs';
import { dirPictures } from '../storage/Images'
import { database } from "../storage/Database";
import { uuid } from 'uuidv4';
import styles from './Style';
import DatePicker from 'react-native-datepicker'
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings';
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import moment from 'moment';

const NewPatient = (props) => {
  const [givenName, setGivenName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState('');
  const [male, setMale] = useState(false);
  const [country, setCountry] = useState('');
  const [hometown, setHometown] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))
  const [
    { cameraRef, type, ratio, autoFocusPoint },
    { takePicture, toggleFacing, touchToFocus, facesDetected, }
  ] = useCamera()

  const [cameraOpen, setCameraOpen] = useState(false);
  const [patientImageUri, setPatientImageUri] = useState('');
  const today = new Date();
  const [patientId] = useState(uuid());

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

  const moveAttachment = async (filePath, newFilepath) => {
    return new Promise((resolve, reject) => {
      RNFS.mkdir(dirPictures)
        .then(() => {
          RNFS.moveFile(filePath, newFilepath)
            .then(() => {
              console.log('FILE MOVED', filePath, newFilepath);
              resolve(true);
            })
            .catch(error => {
              console.log('moveFile error', error);
              reject(error);
            });
        })
        .catch(err => {
          console.log('mkdir error', err);
          reject(err);
        });
    });
  };

  // -${moment().format('DDMMYY_HHmmSSS').replace(/_/g, '')}
  const saveImage = async filePath => {
    try {
      const newImageName = `${patientId.replace(/-/g, '')}.jpg`;
      const newFilepath = `${dirPictures}/${newImageName}`;
      const imageMoved = await moveAttachment(filePath, newFilepath);
      setPatientImageUri(Platform.select({
        ios: newFilepath,
        android: `file://${newFilepath}`
      }))
      console.log('image moved', imageMoved);
      return newFilepath
    } catch (error) {
      console.log(error);
    }
  };

  const capture = async () => {
    try {
      const data = await takePicture()
      await saveImage(data.uri)
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
      >

        {/* <TouchableWithoutFeedback
          style={{
            flex: 1,
          }}
          onPress={touchToFocus}
        /> */}

        {/* <TouchableOpacity
          testID="button"
          onPress={toggleFacing}
          style={{ width: '100%', height: 45 }}>
          <Text>{type}</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={{ position: 'absolute', bottom: 20, right: '50%', transform: [{ translateX: 20 }] }}
          onPress={capture}
        ><Image source={require('../images/shutter.png')} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
      </RNCamera>
    </View>
  ) : (
      <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.container}>
        {LanguageToggle()}
        <View style={styles.inputRow}>
          {patientImageUri.length > 0 ?
            <Image source={{ uri: patientImageUri }} style={{ width: 100, height: 100, justifyContent: 'center', marginRight: 10 }}>
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
