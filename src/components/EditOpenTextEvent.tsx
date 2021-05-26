import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Button
} from 'react-native';

import { database } from "../storage/Database";
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings';

const EditOpenTextEvent = (props) => {

  const event = props.navigation.getParam('event');
  const language = props.navigation.getParam('language', 'en')
  const [responseText, setResponseText] = useState(props.navigation.getParam('event').event_metadata);

  const editEvent = async () => {
    database.editEvent(
      event.id,
      responseText
    ).then((response) => {
      props.navigation.navigate('EventList', { events: response, language })
    })
  };

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => props.navigation.navigate('EventList', { language })}>
          <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.text, { fontWeight: 'bold' }]}>{event.event_type}</Text>
      <TextInput
        style={styles.loginInputsContainer}
        placeholder={LocalizedStrings[language].enterTextHere}
        onChangeText={setResponseText}
        value={responseText}
        multiline={true}
      />

      <View style={{ alignItems: 'center' }}>
        <Button
          title={LocalizedStrings[language].save}
          color={'#F77824'}
          onPress={() => editEvent()} />
      </View>
    </LinearGradient>
  );
};

export default EditOpenTextEvent;
