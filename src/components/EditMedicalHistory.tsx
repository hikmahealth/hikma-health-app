import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, Button, TouchableOpacity
} from 'react-native';

import { database } from "../storage/Database";
import styles from './Style';
import { LocalizedStrings } from '../enums/LocalizedStrings';
import Header from './shared/Header';

const EditMedicalHistory = (props) => {
  const event = props.navigation.getParam('event');
  const userName = props.navigation.getParam('userName');
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'));

  const [allergies, setAllergies] = useState(null);
  const [surgeryHx, setSurgeryHx] = useState(null);
  const [chronicConditions, setChronicConditions] = useState(null);
  const [currentMedications, setCurrentMedications] = useState(null);
  const [vaccinations, setVaccinations] = useState(null);

  useEffect(() => {
    if (!!event.event_metadata) {
      const metadataObj = JSON.parse(event.event_metadata)
      setAllergies(metadataObj.allergies)
      setSurgeryHx(metadataObj.surgeryHx)
      setChronicConditions(metadataObj.chronicConditions)
      setCurrentMedications(metadataObj.currentMedications)
      setVaccinations(metadataObj.vaccinations)
    }
  }, [props])

  const submit = async () => {
    database.editEvent(
      event.id,
      JSON.stringify({
        doctor: userName,
        allergies,
        surgeryHx,
        chronicConditions,
        currentMedications,
        vaccinations,
      })
    ).then((response) => props.navigation.navigate('EventList', { events: response, language }))
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.containerLeft}>
        {Header({ action: () => props.navigation.navigate('EventList', { language }), language, setLanguage })}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'stretch', }}>
          <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold' }]}>{LocalizedStrings[language].medicalHistory}</Text>
        </View>
        <View style={[styles.responseRow, { paddingBottom: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].allergies}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setAllergies(text)}
            value={allergies}
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
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].chronicConditions}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setChronicConditions(text)}
            value={chronicConditions}
          />
        </View>
        <View style={[styles.responseRow, { paddingVertical: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].currentMedications}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setCurrentMedications(text)}
            value={currentMedications}
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
        <View style={{ alignItems: 'center' }}>
          <Button
            title={LocalizedStrings[language].save}
            color={'#F77824'}
            onPress={() => submit()} />
        </View>
      </View>
    </ScrollView >
  );
};

export default EditMedicalHistory;
