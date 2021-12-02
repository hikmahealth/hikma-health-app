import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, Button, Picker, TouchableOpacity
} from 'react-native';

import { database } from "../storage/Database";
import { v4 as uuid } from 'uuid';
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import { LocalizedStrings } from '../enums/LocalizedStrings';
import Header from './shared/Header';

export const MedicineType = (value, action, language) => {
  return (
    <Picker
      selectedValue={value}
      onValueChange={value => action(value)}
      style={[styles.picker, { width: 180 }]}
    >
      <Picker.Item value='' label={LocalizedStrings[language].type} />
      <Picker.Item value={LocalizedStrings[language].tablet} label={LocalizedStrings[language].tablet} />
      <Picker.Item value={LocalizedStrings[language].syrup} label={LocalizedStrings[language].syrup} />
      <Picker.Item value={LocalizedStrings[language].ampule} label={LocalizedStrings[language].ampule} />
      <Picker.Item value={LocalizedStrings[language].suppository} label={LocalizedStrings[language].suppository} />
      <Picker.Item value={LocalizedStrings[language].cream} label={LocalizedStrings[language].cream} />
      <Picker.Item value={LocalizedStrings[language].drops} label={LocalizedStrings[language].drops} />
      <Picker.Item value={LocalizedStrings[language].bottle} label={LocalizedStrings[language].bottle} />
      <Picker.Item value={LocalizedStrings[language].spray} label={LocalizedStrings[language].spray} />
      <Picker.Item value={LocalizedStrings[language].gel} label={LocalizedStrings[language].gel} />
      <Picker.Item value={LocalizedStrings[language].lotion} label={LocalizedStrings[language].lotion} />
    </Picker>
  )
}

export const MedicineDisplay = (metadataObj, language) => {
  return (
    <View>
      <Text>{LocalizedStrings[language].provider}: {metadataObj.doctor} </Text>
      <Text>{LocalizedStrings[language].medication}: {metadataObj.medication} </Text>
      <Text>{LocalizedStrings[language].type}: {metadataObj.type}</Text>
      <Text>{LocalizedStrings[language].dosage}: {metadataObj.dosage}</Text>
      <Text>{LocalizedStrings[language].days}: {metadataObj.days}</Text>
    </View>)
}

const Medicine = (props) => {
  const [medication, setMedication] = useState(null);
  const [type, setType] = useState(null);
  const [dosage, setDosage] = useState(null);
  const [days, setDays] = useState(null);
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'));

  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');
  const userName = props.navigation.getParam('userName');

  const submit = async () => {
    database.addEvent({
      id: uuid(),
      patient_id: patientId,
      visit_id: visitId,
      event_type: EventTypes.Medicine,
      event_metadata: JSON.stringify({
        doctor: userName,
        medication,
        type,
        dosage,
        days,
      })
    }).then(() => {
      props.navigation.navigate('NewVisit')
    })
  };



  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.containerLeft}>
        {Header({ action: () => props.navigation.navigate('NewVisit', { language }), language, setLanguage })}


        <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'stretch', }}>
          <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold' }]}>{LocalizedStrings[language].medicine}</Text>
        </View>
        <View style={[styles.responseRow, { paddingBottom: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].medication}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setMedication(text)}
            value={medication}
          />
        </View>
        {MedicineType(type, setType, language)}
        <View style={[styles.responseRow, { paddingVertical: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].dosage}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setDosage(text)}
            value={dosage}
          />
        </View>
        <View style={[styles.responseRow, { paddingVertical: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].days}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setDays(text)}
            value={days}
            keyboardType='numeric'
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Button
            title={LocalizedStrings[language].save}
            color={'#F77824'}
            onPress={() => submit()} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Medicine;
