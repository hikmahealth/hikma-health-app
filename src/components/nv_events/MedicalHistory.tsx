import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, ScrollView
} from 'react-native';

import { database } from "../../storage/Database";
import { uuid } from 'uuidv4';
import styles from '../Style';
import { EventTypes } from '../../enums/EventTypes';
import LinearGradient from 'react-native-linear-gradient';
import { datePicker } from '../Covid19Form'
import { LocalizedStrings } from '../../enums/LocalizedStrings';

export const MedicalHistoryDisplay = (metadataObj, language) => {
  return (
    <View>
      <Text>{LocalizedStrings[language].malnutrition}: {metadataObj.malnutrition} </Text>
      <Text>{LocalizedStrings[language].prenatal}: {metadataObj.prenatal}</Text>
      <Text>{LocalizedStrings[language].sexualHx}: {metadataObj.sexualHx}</Text>
      <Text>{LocalizedStrings[language].nutrition}: {metadataObj.nutrition}</Text>
      <Text>{LocalizedStrings[language].parasiteTreatment}: {metadataObj.parasiteTreatment}</Text>
      <Text>{LocalizedStrings[language].familyHx}: {metadataObj.familyHx}</Text>
      <Text>{LocalizedStrings[language].surgeryHx}: {metadataObj.surgeryHx}</Text>
      <Text>{LocalizedStrings[language].familyHx}: {metadataObj.familyHx}</Text>
      <Text>{LocalizedStrings[language].vaccinations}: {metadataObj.vaccinations}</Text>
    </View>)
}

const MedicalHistory = (props) => {
  const [malnutrition, setMalnutrition] = useState(null);
  const [prenatal, setPrenatal] = useState(null);
  const [sexualHx, setSexualHx] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [parasiteTreatment, setParasiteTreatment] = useState('');

  const [familyHx, setFamilyHx] = useState(null);
  const [surgeryHx, setSurgeryHx] = useState(null);
  const [vaccinations, setVaccinations] = useState(null);

  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');
  const language = props.navigation.getParam('language', 'en');

  const submit = async () => {
    database.addEvent({
      id: uuid(),
      patient_id: patientId,
      visit_id: visitId,
      event_type: EventTypes.MedicalHistory,
      event_metadata: JSON.stringify({
        malnutrition,
        prenatal,
        sexualHx,
        nutrition,
        parasiteTreatment,
        familyHx,
        surgeryHx,
        vaccinations
      })
    }).then(() => {
      props.navigation.navigate('NewVisit')
    })
  };

  return (
    <ScrollView>
      <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.containerLeft}>
        <View style={[styles.inputsContainer, { alignItems: 'flex-start' }]}>


          <View style={[styles.responseRow, { paddingBottom: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].malnutrition}</Text>
          </View>
          <View style={[styles.responseRow, { padding: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setMalnutrition(text)}
              value={malnutrition}
            />
          </View>
          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].prenatal}</Text>
          </View>
          <View style={[styles.responseRow, { padding: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setPrenatal(text)}
              value={prenatal}
            />
          </View>
          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].sexualHx}</Text>
          </View>
          <View style={[styles.responseRow, { padding: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setSexualHx(text)}
              value={sexualHx}
            />
          </View>
          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].nutrition}</Text>
          </View>
          <View style={[styles.responseRow, { padding: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setNutrition(text)}
              value={nutrition}
            />
          </View>


          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].parasiteTreatment}</Text>
          </View>
          <View style={{ paddingLeft: 20 }}>{datePicker({ placeholder: ' Treatment date', date: parasiteTreatment, action: setParasiteTreatment, language })}</View>


          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].familyHx}</Text>
          </View>
          <View style={[styles.responseRow, { padding: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setFamilyHx(text)}
              value={familyHx}
            />
          </View>
          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].surgeryHx}</Text>
          </View>
          <View style={[styles.responseRow, { padding: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setSurgeryHx(text)}
              value={surgeryHx}
            />
          </View>
          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].vaccinations}</Text>
          </View>
          <View style={[styles.responseRow, { paddingTop: 0, paddingHorizontal: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setVaccinations(text)}
              value={vaccinations}
            />
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => submit()}>
            <Image source={require('../../images/login.png')} style={{ width: 75, height: 75 }} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default MedicalHistory;
