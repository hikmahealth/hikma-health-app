import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Button
} from 'react-native';

import { database } from "../storage/Database";
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings';

const EditVitals = (props) => {
  const event = props.navigation.getParam('event');
  const metadata = props.navigation.getParam('event').event_metadata;
  const language = props.navigation.getParam('language', 'en')
  const [heartRate, setHeartRate] = useState(null);
  const [systolic, setSystolic] = useState(null);
  const [diastolic, setDiastolic] = useState(null);
  const [sats, setSats] = useState(null);
  const [temp, setTemp] = useState(null);
  const [respiratoryRate, setRespiratoryRate] = useState(null);
  const [weight, setWeight] = useState(null);
  const [bloodGlucose, setBloodGlucose] = useState(null);

  useEffect(() => {
    if (!!metadata) {
      const metadataObj = JSON.parse(metadata)
      setHeartRate(metadataObj.heartRate)
      setSystolic(metadataObj.systolic)
      setDiastolic(metadataObj.diastolic)
      setSats(metadataObj.sats)
      setTemp(metadataObj.temp)
      setRespiratoryRate(metadataObj.respiratoryRate)
      setWeight(metadataObj.weight)
      setBloodGlucose(metadataObj.bloodGlucose)
    }
  }, [props])

  const setVitals = async () => {
    database.editEvent(
      event.id,
      JSON.stringify({
        heartRate,
        systolic,
        diastolic,
        sats,
        temp,
        respiratoryRate,
        weight,
        bloodGlucose
      })
    ).then((response) => props.navigation.navigate('EventList', { events: response, language }))
  };

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => props.navigation.navigate('EventList', { language })}>
          <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.text, {  fontSize: 16, fontWeight: 'bold' }]}>{LocalizedStrings[language].vitals}</Text>

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
    </LinearGradient>
  );
};

export default EditVitals;
