import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    database.getLatestPatientEventByType(patientId, EventTypes.HR).then((response: string) => {
      if (!!response) {
        setHeartRate(response)
      }
    })
    database.getLatestPatientEventByType(patientId, EventTypes.BP).then((response: string) => {
      if (!!response) {
        const bp = response.split("/");
        setSystolic(bp[0])
        setDiastolic(bp[1])
      }
    })
    database.getLatestPatientEventByType(patientId, EventTypes.Sats).then((response: string) => {
      if (!!response) {
        setSats(response)
      }
    })
    database.getLatestPatientEventByType(patientId, EventTypes.Temp).then((response: string) => {
      if (!!response) {
        setTemp(response)
      }
    })
    database.getLatestPatientEventByType(patientId, EventTypes.RR).then((response: string) => {
      if (!!response) {
        setRespiratoryRate(response)
      }
    })
    database.getLatestPatientEventByType(patientId, EventTypes.BG).then((response: string) => {
      if (!!response) {
        setBloodGlucose(response)
      }
    })
  }, [props])

  const setVitals = async () => {
    await addEvent(heartRate, EventTypes.HR);
    await addEvent(!!systolic && !!diastolic ? `${systolic}/${diastolic}` : null, EventTypes.BP);
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
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={[styles.container, { justifyContent: 'flex-start', alignItems: 'center' }]}>
      <View style={[styles.inputRow, {marginTop: 30}]}>
        <TextInput
          style={styles.inputs}
          placeholder="HR"
          onChangeText={(text) => setHeartRate(text)}
          value={heartRate}
          keyboardType='numeric'
        />
        <Text>BPM</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="Systolic"
          onChangeText={(text) => setSystolic(text)}
          value={systolic}
          keyboardType='numeric'
        />
        <Text>/</Text>
        <TextInput
          style={styles.inputs}
          placeholder="Diastolic"
          onChangeText={(text) => setDiastolic(text)}
          value={diastolic}
          keyboardType='numeric'
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="Sats"
          onChangeText={(text) => setSats(text)}
          value={sats}
          keyboardType='numeric'
        />
        <Text>%</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="Temp"
          onChangeText={(text) => setTemp(text)}
          value={temp}
          keyboardType='numeric'
        />
        <Text>°C</Text>
        <TextInput
          style={styles.inputs}
          placeholder="RR"
          onChangeText={(text) => setRespiratoryRate(text)}
          value={respiratoryRate}
          keyboardType='numeric'
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="BG"
          onChangeText={(text) => setBloodGlucose(text)}
          value={bloodGlucose}
          keyboardType='numeric'
        />
      </View>
      <View style={{marginTop: 30}}>
        <TouchableOpacity onPress={() => setVitals()}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Vitals;
