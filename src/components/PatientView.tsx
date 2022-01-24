import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, Button } from "react-native";
import { database } from '../storage/Database';
import styles from './Style';
import { v4 as uuid } from 'uuid';
import { EventTypes } from "../enums/EventTypes";
import { iconHash } from '../services/hash'
import { User } from "../types/User";
import { LocalizedStrings } from "../enums/LocalizedStrings";
import UserAvatar from 'react-native-user-avatar';
import Header from "./shared/Header";

const PatientView = (props) => {

  const [patient, setPatient] = useState(props.navigation.getParam('patient'));
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'));
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [userName, setUserName] = useState('');
  const [summary, setSummary] = useState(LocalizedStrings[(props.navigation.getParam('language', 'en'))].noContent)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const clinicId = props.navigation.state.params.clinicId;
  const userId = props.navigation.state.params.userId;
  const name1 = 'This'
  const name2 = 'Guy'

  useEffect(() => {
    setPatient(props.navigation.state.params.patient);
    let patientId = props.navigation.state.params.patient.id
    database.getLatestPatientEventByType(patientId, EventTypes.PatientSummary).then((response: string) => {
      if (response.length > 0) {
        setSummary(response)
      } else {
        setSummary(LocalizedStrings[language].noContent)
      }
    })
  }, [props, language])

  useEffect(() => {
    if (language !== props.navigation.getParam('language')) {
      setLanguage(props.navigation.getParam('language'));
    }
  }, [props])

  useEffect(() => {
    database.getUser(userId).then((user: User) => {
      if (!!user.name.content[language]) {
        setUserName(user.name.content[language])
      } else {
        setUserName(user.name.content[Object.keys(user.name.content)[0]])
      }
    })
  }, [])

  const displayName = (patient) => {
    if (!!patient.given_name.content[language] && !!patient.surname.content[language]) {
      return <Text>{`${patient.given_name.content[language]} ${patient.surname.content[language]}`}</Text>
    } else {
      patient.given_name.content[Object.keys(patient.given_name.content)[0]]
      return <Text>{`${patient.given_name.content[Object.keys(patient.given_name.content)[0]]} ${patient.surname.content[Object.keys(patient.surname.content)[0]]}`}</Text>
    }
  }

  const displayNameAvatar = (patient) => {
    if (!!patient.given_name.content[language] && !!patient.surname.content[language]) {
      return `${patient.given_name.content[language]} ${patient.surname.content[language]}`
    } else {
      patient.given_name.content[Object.keys(patient.given_name.content)[0]]
      return `${patient.given_name.content[Object.keys(patient.given_name.content)[0]]} ${patient.surname.content[Object.keys(patient.surname.content)[0]]}`
    }
  }

  const handleSaveSummary = () => {
    database.addEvent({
      id: uuid(),
      patient_id: patient.id,
      visit_id: null,
      event_type: EventTypes.PatientSummary,
      event_metadata: summary
    }).then(() => console.log('patient summary saved'))
  }

  return (
    <View style={[styles.main, { justifyContent: 'space-between' }]}>
      {Header({ action: () => props.navigation.navigate('PatientList', { language: language, reloadPatientsToggle: !props.navigation.state.params.reloadPatientsToggle }), language, setLanguage })}
      <View style={[styles.card, { flex: 1, elevation: 0 }]}>
        <View style={[styles.cardContent, { alignItems: 'flex-start' }]}>

          <UserAvatar size={100} name={displayNameAvatar(patient)} bgColor='#ECECEC' textColor='#6177B7'/>
          <View style={{ marginLeft: 20, flex: 1 }}>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                <Text style={styles.gridItemText}>{displayName(patient)}</Text>
                <View style={[styles.editPatientButton]}>
                  <TouchableOpacity onPress={() => props.navigation.navigate('EditPatient', { language: language, patient: patient })}>
                    <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].edit}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text>{`${LocalizedStrings[language].dob}:  ${patient.date_of_birth}`}</Text>
              <Text>{`${LocalizedStrings[language].sex}:  ${patient.sex}`}</Text>
              <Text>{`${LocalizedStrings[language].camp}:  ${patient.camp}`}</Text>
            </View>

            <View style={{ flex: 1, marginBottom: 15 }}>
              <TouchableOpacity onLongPress={() => setIsEditingSummary(true)} >
                {isEditingSummary ?
                  <View>
                    <TextInput
                      style={styles.paragraph}
                      onChangeText={setSummary}
                      value={summary}
                    />
                    <TouchableOpacity
                      style={[styles.editPatientButton, { marginHorizontal: 0 }]}
                      onPress={() => {
                        handleSaveSummary();
                        setIsEditingSummary(false);
                      }}>
                      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].save}</Text>
                      </View>
                    </TouchableOpacity>
                  </View> :
                  <View>
                    <Text style={[styles.gridItemText, { paddingBottom: 5 }]}>{LocalizedStrings[language].patientSummary}</Text>
                    <Text style={[styles.paragraph]}>
                      {summary}
                    </Text>
                  </View>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={{ alignItems: 'stretch', flex: 1 }}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => props.navigation.navigate('VisitList', { language: language, patient: patient, userName })}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={styles.gridItemText}>{LocalizedStrings[language].visitHistory}</Text>
            <Text style={styles.gridItemText}>></Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => props.navigation.navigate('SnapshotList', { eventType: EventTypes.MedicalHistoryFull, language: language, patient: patient })}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={styles.gridItemText}>{LocalizedStrings[language].medicalHistory}</Text>
            <Text style={styles.gridItemText}>></Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => props.navigation.navigate('SnapshotList', { eventType: EventTypes.Complaint, language: language, patient: patient })}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={styles.gridItemText}>{LocalizedStrings[language].complaint}</Text>
            <Text style={styles.gridItemText}>></Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => props.navigation.navigate('SnapshotList', { eventType: EventTypes.ExaminationFull, language: language, patient: patient })}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={styles.gridItemText}>{LocalizedStrings[language].examination}</Text>
            <Text style={styles.gridItemText}>></Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => props.navigation.navigate('SnapshotList', { eventType: EventTypes.Medicine, language: language, patient: patient })}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
            <Text style={styles.gridItemText}>{LocalizedStrings[language].medicine}</Text>
            <Text style={styles.gridItemText}>></Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.newVisit}>
        <Button
          title={LocalizedStrings[language].newVisit}
          color={'#F77824'}
          onPress={() => {
            const newVisitId = uuid();
            database.addVisit({
              id: newVisitId,
              patient_id: patient.id,
              clinic_id: clinicId,
              provider_id: userId
            })
            props.navigation.navigate('NewVisit',
              {
                language: language,
                patient: patient,
                visitId: newVisitId.replace(/-/g, ""),
                userName: userName
              }
            )
          }} />
      </View>
    </View>
  )

}

export default PatientView;