import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity
} from 'react-native';

import { database } from "../storage/Database";
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
    database.getLatestPatientEventByType(patientId, EventTypes.Vitals).then((response: any) => {
      if (!!response) {
        const metadataObj = JSON.parse(response)
        setHeartRate(metadataObj.heartRate)
        setSystolic(metadataObj.systolic)
        setDiastolic(metadataObj.diastolic)
        setSats(metadataObj.sats)
        setTemp(metadataObj.temp)
        setRespiratoryRate(metadataObj.respiratoryRate)
        setBloodGlucose(metadataObj.bloodGlucose)
      }
    })
  }, [props])

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
        bloodGlucose
      })
    }).then(() =>{
      props.navigation.navigate('NewVisit')
    })
  };

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.container}>
      <View style={[styles.inputRow, {marginTop: 30}]}>
        <TextInput
          style={styles.inputs}
          placeholder="HR"
          onChangeText={(text) => setHeartRate(text)}
          value={heartRate}
          keyboardType='numeric'
        />
        <Text style={{color: '#FFFFFF'}}>BPM</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="Systolic"
          onChangeText={(text) => setSystolic(text)}
          value={systolic}
          keyboardType='numeric'
        />
        <Text style={{color: '#FFFFFF'}}>/</Text>
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
        <Text style={{color: '#FFFFFF'}}>%</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder="Temp"
          onChangeText={(text) => setTemp(text)}
          value={temp}
          keyboardType='numeric'
        />
        <Text style={{color: '#FFFFFF'}}>°C</Text>
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
