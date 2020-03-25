import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity
} from 'react-native';

import { database } from "../database/Database";
import styles from './Style';
import { uuid } from 'uuidv4';
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings';

const EditPatient = (props) => {

  const eventType = props.navigation.getParam('eventType');
  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))

  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    database.getLatestPatientEventByType(patientId, eventType).then((response: string) => {
      if (response.length > 0) {
        setResponseText(response)
      }
    })
  }, [props])

  const addEvent = async () => {
    database.addEvent({
      id: uuid(),
      patient_id: patientId,
      visit_id: visitId,
      event_type: eventType,
      event_metadata: responseText
    }).then(() => props.navigation.navigate('NewVisit'))
  };

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.container}>
      <TouchableOpacity onPress={() => props.navigation.navigate('NewVisit')}>
        <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
      </TouchableOpacity>
      <Text>{eventType}</Text>
      <TextInput
        style={styles.loginInputsContainer}
        placeholder={LocalizedStrings[language].enterTextHere}
        onChangeText={setResponseText}
        value={responseText}
        multiline={true}
      />

      <View>
        <TouchableOpacity onPress={() => addEvent()}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default EditPatient;
