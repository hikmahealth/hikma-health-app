import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity
} from 'react-native';

import { database } from "../storage/Database";
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings';

const EditOpenTextEvent = (props) => {

  const event = props.navigation.getParam('event');
  const language = props.navigation.getParam('language', 'en')
  const editPrescription = props.navigation.getParam('prescriptionEdit')
  const [responseText, setResponseText] = useState(props.navigation.getParam('event').event_metadata);

  const editEvent = async () => {
    database.editEvent(
      event.id,
      responseText
    ).then((response) => {
      editPrescription ? props.navigation.navigate('PrescriptionList', { events: response, language }) : props.navigation.navigate('EventList', { events: response, language })
    })
  };

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.container}>
      <TouchableOpacity onPress={() => props.navigation.navigate('EventList', { language })}>
        <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
      </TouchableOpacity>
      <Text>{event.event_type}</Text>
      <TextInput
        style={styles.loginInputsContainer}
        placeholder={LocalizedStrings[language].enterTextHere}
        onChangeText={setResponseText}
        value={responseText}
        multiline={true}
      />

      <View>
        <TouchableOpacity onPress={() => editEvent()}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default EditOpenTextEvent;
