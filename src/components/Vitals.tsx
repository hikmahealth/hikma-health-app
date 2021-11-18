import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Button
} from 'react-native';

import { database } from "../storage/Database";
import { uuid } from 'uuidv4';
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import { LocalizedStrings } from '../enums/LocalizedStrings';

export const VitalsDisplay = (metadataObj) => {
  return (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
    }}>
      <Text style={{ width: '50%' }}>HR: {metadataObj.heartRate} BPM</Text>
      <Text style={{ width: '50%' }}>BP: {metadataObj.systolic}/{metadataObj.diastolic}</Text>
      <Text style={{ width: '50%' }}>Sats: {metadataObj.sats}%</Text>
      <Text style={{ width: '50%' }}>Temp: {metadataObj.temp} °C</Text>
      <Text style={{ width: '50%' }}>RR: {metadataObj.respiratoryRate}</Text>
      <Text style={{ width: '50%' }}>Weight: {metadataObj.weight} kg</Text>
      <Text style={{ width: '50%' }}>BG: {metadataObj.bloodGlucose}</Text>
    </View>)
}

const Vitals = (props) => {
  const [heartRate, setHeartRate] = useState(null);
  const [systolic, setSystolic] = useState(null);
  const [diastolic, setDiastolic] = useState(null);
  const [sats, setSats] = useState(null);
  const [temp, setTemp] = useState(null);
  const [respiratoryRate, setRespiratoryRate] = useState(null);
  const [weight, setWeight] = useState(null);
  const [bloodGlucose, setBloodGlucose] = useState(null);

  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');
  const language = props.navigation.getParam('language', 'en')

  const setVitals = async () => {
    database.addEvent({
      id: uuid(),
      patient_id: patientId,
      visit_id: visitId,
      event_type: EventTypes.Vitals,
      event_metadata: JSON.stringify({
        heartRate,
        systolic,
        diastolic,
        sats,
        temp,
        respiratoryRate,
        weight,
        bloodGlucose
      })
    }).then(() => {
      props.navigation.navigate('NewVisit')
    })
  };

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => props.navigation.navigate('NewVisit')}>
          <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold' }]}>{LocalizedStrings[language].vitals}</Text>
      <View style={[styles.inputRow, { marginTop: 30 }]}>
        <TextInput
          style={styles.inputs}
          placeholder="HR"
          onChangeText={(text) => setHeartRate(text)}
          value={heartRate}
          keyboardType='numeric'
        />
        <Text style={{ color: '#FFFFFF' }}>BPM</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="Systolic"
          onChangeText={(text) => setSystolic(text)}
          value={systolic}
          keyboardType='numeric'
        />
        <Text style={{ color: '#FFFFFF' }}>/</Text>
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
        <Text style={{ color: '#FFFFFF' }}>%</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="Temp"
          onChangeText={(text) => setTemp(text)}
          value={temp}
          keyboardType='numeric'
        />
        <Text style={{ color: '#FFFFFF' }}>°C</Text>
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
          placeholder="Weight"
          onChangeText={(text) => setWeight(text)}
          value={weight}
          keyboardType='numeric'
        />
        <Text style={{ color: '#FFFFFF' }}>kg</Text>
        <TextInput
          style={styles.inputs}
          placeholder="BG"
          onChangeText={(text) => setBloodGlucose(text)}
          value={bloodGlucose}
          keyboardType='numeric'
        />
      </View>
      <View style={{ marginTop: 30 }}>
        <Button
          title={LocalizedStrings[language].save}
          color={'#F77824'}
          onPress={() => setVitals()} />
      </View>
    </View>
  );
};

export default Vitals;
