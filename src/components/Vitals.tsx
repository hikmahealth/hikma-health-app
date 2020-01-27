import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity
} from 'react-native';

import { database } from "../database/Database";
import { uuid } from 'uuidv4';
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import LinearGradient from 'react-native-linear-gradient';

const Vitals = (props) => {
  const [heartRate, setHeartRate] = useState(null);
  const [systolic, setSystolic] = useState(null);
  const [diastolic, setDiastolic] = useState(null);
  const [sats, setSats] = useState(null);
  const [temp, setTemp] = useState(null);
  const [respiratoryRate, setRespiratoryRate] = useState(null);
  const [bloodGlucose, setBloodGlucose] = useState(null);

  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');

  const setVitals = async () => {
    await addEvent(heartRate, EventTypes.HR);
    await addEvent(`${systolic}/${diastolic}`, EventTypes.BP);
    await addEvent(sats, EventTypes.Sats);
    await addEvent(temp, EventTypes.Temp);
    await addEvent(respiratoryRate, EventTypes.RR);
    await addEvent(bloodGlucose, EventTypes.BG);
    props.navigation.navigate('NewVisit')
  }

  const addEvent = async (entry: any, eventType: EventTypes) => {
    database.addEvent({
      id: uuid(),
      patient_id: patientId,
      visit_id: visitId,
      event_type: eventType,
      event_metadata: entry
    })
  };

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={[styles.container, {alignItems: 'center'}]}>
      <View style={styles.inputsContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder="HR"
            onChangeText={(text) => setHeartRate(text)}
            value={heartRate}
          />
          <Text>BPM</Text>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder="Systolic"
            onChangeText={(text) => setSystolic(text)}
            value={systolic}
          />
          <Text>/</Text>
          <TextInput
            style={styles.inputs}
            placeholder="Diastolic"
            onChangeText={(text) => setDiastolic(text)}
            value={diastolic}
          />
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder="Sats"
            onChangeText={(text) => setSats(text)}
            value={sats}
          />
          <Text>%</Text>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder="Temp"
            onChangeText={(text) => setTemp(text)}
            value={temp}
          />
          <Text>°C</Text>
          <TextInput
            style={styles.inputs}
            placeholder="RR"
            onChangeText={(text) => setRespiratoryRate(text)}
            value={respiratoryRate}
          />
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder="BG"
            onChangeText={(text) => setBloodGlucose(text)}
            value={bloodGlucose}
          />
        </View>
      </View>
      <View >
        <TouchableOpacity onPress={() => setVitals()}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>


  );
};

export default Vitals;
