import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity
} from 'react-native';

import { database } from "../database/Database";
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import { uuid } from 'uuidv4';
import LinearGradient from 'react-native-linear-gradient';


const EditPatient = (props) => {

  const eventType = props.navigation.getParam('eventType');
  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');

  const [responseText, setResponseText] = useState('');

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
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={[styles.container, {justifyContent: 'flex-start', alignItems: 'center'}]}>
      <TouchableOpacity onPress={() => props.navigation.navigate('NewVisit')}>
        <Text style={styles.text}>{`< BACK`}</Text>
      </TouchableOpacity>
      <Text>{eventType}</Text>
      <TextInput
        style={styles.loginInputsContainer}
        placeholder="Enter Text here"
        onChangeText={setResponseText}
        value={responseText}
        multiline={true}
      />

      <View >
        <TouchableOpacity onPress={() => addEvent()}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>


  );
};

export default EditPatient;
