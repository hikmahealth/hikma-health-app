import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TextInput, StyleSheet, Button, TouchableOpacity
} from 'react-native';
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import LinearGradient from 'react-native-linear-gradient';
import { database } from "../database/Database";
import { uuid } from "uuidv4";

const NewVisit = (props) => {
  const [camp, setCamp] = useState('');
  const [visitType, setVisitType] = useState('');
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))
  const patient = props.navigation.getParam('patient');
  const visitId = props.navigation.getParam('visitId');
  const userName = props.navigation.getParam('userName');

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
    props.navigation.navigate('OpenTextEvent', { patientId: patient.id, visitId: visitId, eventType: eventType })
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
          <Text style={styles.text}>{`< BACK`}</Text>
        </TouchableOpacity>
        {LanguageToggle()}
      </View>

      <View style={styles.inputsContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputs}
            placeholder="Camp"
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
          <Image source={require('../images/vitals.png')} style={{ width: 66, height: 31, marginBottom: 5 }} />
          <Text>Vitals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.ExaminationNotes)}>
          <Image source={require('../images/stethoscope.png')} style={{ width: 43, height: 47 }} />
          <Text>Examination Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Complaint)}>
          <Image source={require('../images/complaint.png')} style={{ width: 50, height: 50 }} />
          <Text>Complaint</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Treatment)}>
          <Image source={require('../images/doctor.png')} style={{ width: 40, height: 48 }} />
          <Text>Treatment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Diagnosis)}>
          <Image source={require('../images/diagnosis.png')} style={{ width: 42, height: 52 }} />
          <Text>Diagnosis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.MedicineDispensed)}>
          <Image source={require('../images/medicine.png')} style={{ width: 77, height: 38 }} />
          <Text>Medicine Dispensed</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Prescriptions)}>
          <Image source={require('../images/prescriptions.png')} style={{ width: 50, height: 50 }} />
          <Text>Prescriptions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Allergies)}>
          <Image source={require('../images/fee.png')} style={{ width: 50, height: 41 }} />
          <Text>Allergies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.MedicalHistory)}>
          <Image source={require('../images/medicalHistory.png')} style={{ width: 53, height: 51 }} />
          <Text>Medical History</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>


  );
};

export default NewVisit;