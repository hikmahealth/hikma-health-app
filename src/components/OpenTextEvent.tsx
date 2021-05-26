import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, Button
} from 'react-native';

import { database } from "../storage/Database";
import styles from './Style';
import { uuid } from 'uuidv4';
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings';
import { EventTypes } from '../enums/EventTypes';

const OpenTextEvent = (props) => {

  const eventType = props.navigation.getParam('eventType');
  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');
  const language = props.navigation.getParam('language', 'en')
  const [textColor, setTextColor] = useState('#A9A9A9')
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    database.getLatestPatientEventByType(patientId, eventType).then((response: string) => {
      if (response.length > 0 && (
        eventType === EventTypes.DentalTreatment ||
        eventType === EventTypes.Notes)) {
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
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => props.navigation.navigate('NewVisit')}>
          <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.text, { fontWeight: 'bold' }]}>{eventType}</Text>
      <TextInput
        style={[styles.loginInputsContainer, { color: textColor }]}
        placeholder={LocalizedStrings[language].enterTextHere}
        onChangeText={(text) => {
          setResponseText(text)
          setTextColor('#000000')
        }}
        value={responseText}
        multiline={true}
      />
      <View style={{ alignItems: 'center' }}>
        <Button
          title={LocalizedStrings[language].save}
          color={'#F77824'}
          onPress={() => addEvent()} />
      </View>
    </LinearGradient>
  );
};

export default OpenTextEvent;
