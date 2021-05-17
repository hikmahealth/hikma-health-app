import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, Picker
} from 'react-native';
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import LinearGradient from 'react-native-linear-gradient';
import { database } from "../storage/Database";
import { uuid } from "uuidv4";
import { LocalizedStrings } from '../enums/LocalizedStrings';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

const NewVisit = (props) => {
  const [visitType, setVisitType] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))
  const [typeTextColor, setTypeTextColor] = useState('#A9A9A9')
  const patient = props.navigation.getParam('patient');
  const visitId = props.navigation.getParam('visitId');
  const userName = props.navigation.getParam('userName');
  const existingVisit = props.navigation.getParam('existingVisit');

  const today = new Date();

  useEffect(() => {
    let patientId = props.navigation.state.params.patient.id;
    database.getLatestPatientEventByType(patientId, EventTypes.VisitType).then((response: string) => {
      if (response.length > 0) {
        setVisitType(response)
      }
    })

    if (!!props.navigation.getParam('language') && language !== props.navigation.getParam('language')) {
      setLanguage(props.navigation.getParam('language'));
    }
  }, [props])

  const LanguageToggle = () => {
    return (
      <Picker
        selectedValue={language}
        onValueChange={value => setLanguage(value)}
        style={[styles.picker, { marginLeft: 10 }]}
      >
        <Picker.Item value='en' label='en' />
        <Picker.Item value='ar' label='ar' />
      </Picker>
    )
  }

  const openTextEvent = (eventType: string) => {
    props.navigation.navigate('OpenTextEvent', { patientId: patient.id, visitId: visitId, eventType: eventType, language: language })
  }

  const handleSaveVisitType = () => {
    database.addEvent({
      id: uuid(),
      patient_id: patient.id,
      visit_id: visitId,
      event_type: EventTypes.VisitType,
      event_metadata: visitType
    }).then(() => console.log('visit type saved'))
  }

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.containerLeft}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => existingVisit ?
          props.navigation.navigate('EventList', { language, patient }) :
          props.navigation.navigate('PatientView', { language, patient })
        }>
          <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
        </TouchableOpacity>
        {LanguageToggle()}
      </View>

      {existingVisit ?
        null :
        <View style={styles.inputsContainer}>
          <View style={styles.inputRow}>
            <DatePicker
              style={styles.datePicker}
              date={visitDate}
              mode="date"
              placeholder={LocalizedStrings[language].selectDob}
              format="YYYY-MM-DD"
              minDate="1900-05-01"
              maxDate={today.toISOString().split('T')[0]}
              confirmBtnText={LocalizedStrings[language].confirm}
              cancelBtnText={LocalizedStrings[language].cancel}
              customStyles={{
                dateInput: {
                  alignItems: 'flex-start',
                  borderWidth: 0
                }
              }}
              androidMode='spinner'
              onDateChange={(date) => {
                setVisitDate(date)
                database.editVisitDate(visitId, moment(date).toISOString())
              }}
            />
            <TextInput
              style={[styles.inputs, { color: typeTextColor }]}
              placeholder={LocalizedStrings[language].visitType}
              onChangeText={(text) => {
                setTypeTextColor('#000000')
                setVisitType(text)
              }}
              onEndEditing={handleSaveVisitType}
              value={visitType}
            />
          </View>
        </View>
      }

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => props.navigation.navigate('MedicalHistory', { patientId: patient.id, visitId, userName, language })}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/medicalHistory.png')} style={{ width: 53, height: 51 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].medicalHistory}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Complaint)}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/complaint.png')} style={{ width: 50, height: 50 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].complaint}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => props.navigation.navigate('Vitals', { patientId: patient.id, visitId, userName, language })}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/vitals.png')} style={{ width: 66, height: 31 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].vitals}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => props.navigation.navigate('Examination', { patientId: patient.id, visitId, userName, language })}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/stethoscope.png')} style={{ width: 43, height: 47 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].examination}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => props.navigation.navigate('Medicine', { patientId: patient.id, visitId, userName, language })}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/medicine.png')} style={{ width: 77, height: 38 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].medicineDispensed}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => props.navigation.navigate('Physiotherapy', { patientId: patient.id, visitId, userName, language })}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/doctor.png')} style={{ width: 40, height: 48 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].physiotherapy}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.DentalTreatment)}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/dental_treatment.png')} style={{ width: 50, height: 50 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].dentalTreatment}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => openTextEvent(EventTypes.Notes)}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/notes.png')} style={{ width: 43, height: 47 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].notes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => props.navigation.navigate('Covid19Form', { language, patient, visitId, userName })}>
          <View style={styles.actionIcon}>
            <Image source={require('../images/covid.png')} style={{ width: 43, height: 47 }} />
          </View>
          <Text style={styles.actionText}>{LocalizedStrings[language].covidScreening}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default NewVisit;