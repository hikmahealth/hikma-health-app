import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity
} from 'react-native';
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import LinearGradient from 'react-native-linear-gradient';
import { database } from "../database/Database";
import { uuid } from "uuidv4";
import { LocalizedStrings } from '../enums/LocalizedStrings';

const NewVisit = (props) => {
  const [camp, setCamp] = useState('');
  const [visitType, setVisitType] = useState('');
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))
  const patient = props.navigation.getParam('patient');
  const visitId = props.navigation.getParam('visitId');
  const userName = props.navigation.getParam('userName');

  useEffect(() => {
    let patientId = props.navigation.state.params.patient.id;
    database.getLatestPatientEventByType(patientId, EventTypes.Camp).then((response: string) => {
      if (response.length > 0) {
        setCamp(response)
      }
    })
  }, [props])

  const LanguageToggle = () => {
    return (
      <TouchableOpacity onPress={() => {
        if (language === 'en') {
          setLanguage('ar')
        } else {
          setLanguage('en')
        }
      }}>
        <Text style={styles.text}>{language}</Text>
      </TouchableOpacity>
    )
  }

  const openTextEvent = (eventType: string) => {
    props.navigation.navigate('OpenTextEvent', { patientId: patient.id, visitId: visitId, eventType: eventType, language: language })
  }

  const handleSaveCamp = () => {
    database.addEvent({
      id: uuid(),
      patient_id: patient.id,
      visit_id: visitId,
      event_type: EventTypes.Camp,
      event_metadata: camp
    }).then(() => console.log('camp saved'))
  }

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => props.navigation.navigate('PatientView', { language: language, patient: patient })}>
          <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
        </TouchableOpacity>
        {LanguageToggle()}
      </View>

      <View style={styles.inputsContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder={LocalizedStrings[language].camp}
            onChangeText={setCamp}
            onEndEditing={handleSaveCamp}
            value={camp}
          />
          {/* <TextInput
            style={styles.inputs}
            placeholder="Seen By"
            onChangeText={setSeenBy}
            value={seenBy}
          /> */}
          <Text style={styles.inputs}>
            {userName}
          </Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputs}>
            {new Date().toISOString().split("T")[0]}
          </Text>
          {/* <TextInput
            style={styles.inputs}
            placeholder="Visit Type/EMA#"
            onChangeText={setVisitType}
            value={visitType}
          /> */}
          <Text style={styles.inputs}>
            Visit Type/EMA#
          </Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => props.navigation.navigate('Vitals', { patientId: patient.id, visitId: visitId })}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/vitals.png')} style={{ width: 66, height: 31 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].vitals}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.ExaminationNotes)}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/stethoscope.png')} style={{ width: 43, height: 47 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].examinationNotes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Complaint)}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/complaint.png')} style={{ width: 50, height: 50 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].complaint}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Treatment)}>

          <View style={styles.actionIcon}>
            <Image source={require('../images/doctor.png')} style={{ width: 40, height: 48 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].treatment}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Diagnosis)}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/diagnosis.png')} style={{ width: 42, height: 52 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].diagnosis}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.MedicineDispensed)}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/medicine.png')} style={{ width: 77, height: 38 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].medicineDispensed}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Prescriptions)}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/prescriptions.png')} style={{ width: 50, height: 50 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].prescriptions}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Allergies)}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/fee.png')} style={{ width: 50, height: 41 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].allergies}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.MedicalHistory)}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/medicalHistory.png')} style={{ width: 53, height: 51 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].medicalHistory}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default NewVisit;