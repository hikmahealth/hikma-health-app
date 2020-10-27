import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, ScrollView
} from 'react-native';

import { database } from "../../storage/Database";
import { uuid } from 'uuidv4';
import styles from '../Style';
import { EventTypes } from '../../enums/EventTypes';
import LinearGradient from 'react-native-linear-gradient';
import { datePicker, radioButtons } from '../Covid19Form'
import { LocalizedStrings } from '../../enums/LocalizedStrings';

export const ClinicalEvaluationDisplay = (metadataObj, language) => {
  return (
    <View>
      <Text>{LocalizedStrings[language].visitDate}: {metadataObj.visitDate} </Text>
      <Text>{LocalizedStrings[language].doctor}: {metadataObj.doctor} </Text>
      <Text>{LocalizedStrings[language].reason}: {metadataObj.reason}</Text>
      <Text>{LocalizedStrings[language].observations}: {metadataObj.observations}</Text>
      <Text>{LocalizedStrings[language].medications}: {metadataObj.medications}</Text>
      <Text>{LocalizedStrings[language].breastExam}: {metadataObj.breastExam.toString()}</Text>
      <Text>{LocalizedStrings[language].diagnosis}: {metadataObj.diagnosis}</Text>
      <Text>{LocalizedStrings[language].treatment}: {metadataObj.treatment}</Text>
      <Text>{LocalizedStrings[language].communityVisit}: {LocalizedStrings[language].communityVisit ? metadataObj.communityVisitDate : metadataObj.communityVisit.toString()}</Text>
      <Text>{LocalizedStrings[language].promoterVisit}: {LocalizedStrings[language].promoterVisit ? metadataObj.promoterVisitDate : metadataObj.promoterVisit.toString()}</Text>
      <Text>{LocalizedStrings[language].refusal}: {LocalizedStrings[language].refusal ? metadataObj.refusalDate : metadataObj.refusal.toString()}</Text>
      <Text>{LocalizedStrings[language].nextVisitDate}: {metadataObj.nextVisitDate}</Text>
      <Text>{LocalizedStrings[language].nextVisitReason}: {metadataObj.nextVisitReason}</Text>
    </View>)
}

const ClinicalEvaluation = (props) => {
  const [reason, setReason] = useState(null);
  const [observations, setObservations] = useState(null);
  const [medications, setMedications] = useState(null);
  const [breastExam, setBreastExam] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const [treatment, setTreatment] = useState(null);
  const [communityVisit, setCommunityVisit] = useState(false);
  const [communityVisitDate, setCommunityVisitDate] = useState('');
  const [promoterVisit, setPromoterVisit] = useState(false);
  const [promoterVisitDate, setPromoterVisitDate] = useState('');
  const [refusal, setRefusal] = useState(false);
  const [refusalDate, setRefusalDate] = useState('');
  const [nextVisitDate, setNextVisitDate] = useState('');
  const [nextVisitReason, setNextVisitReason] = useState(null);


  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');
  const language = props.navigation.getParam('language', 'en');
  const visitDate = props.navigation.getParam('visitDate');
  const userName = props.navigation.getParam('userName');

  const submit = async () => {
    database.addEvent({
      id: uuid(),
      patient_id: patientId,
      visit_id: visitId,
      event_type: EventTypes.Evaluation,
      event_metadata: JSON.stringify({
        visitDate,
        doctor: userName,
        reason,
        observations,
        medications,
        breastExam,
        diagnosis,
        treatment,
        communityVisit,
        communityVisitDate,
        promoterVisit,
        promoterVisitDate,
        refusal,
        refusalDate,
        nextVisitDate,
        nextVisitReason
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
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].visitDate}: {visitDate}</Text>
          </View>
          <View style={[styles.responseRow, { paddingBottom: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].doctor}: {userName}</Text>
          </View>

          <View style={[styles.responseRow, { paddingBottom: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].reason}</Text>
          </View>
          <View style={[styles.responseRow, { padding: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setReason(text)}
              value={reason}
            />
          </View>
          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].observations}</Text>
          </View>
          <View style={[styles.responseRow, { padding: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setObservations(text)}
              value={observations}
            />
          </View>
          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].medications}</Text>
          </View>
          <View style={[styles.responseRow, { padding: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setMedications(text)}
              value={medications}
            />
          </View>
          <View style={[styles.responseRow]}>
            {radioButtons({ field: breastExam, action: setBreastExam, prompt: LocalizedStrings[language].breastExam, language })}
          </View>


          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].diagnosis}</Text>
          </View>
          <View style={[styles.responseRow, { padding: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setDiagnosis(text)}
              value={diagnosis}
            />
          </View>


          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].treatment}</Text>
          </View>
          <View style={[styles.responseRow, { padding: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setTreatment(text)}
              value={treatment}
            />
          </View>
 
          <View style={[styles.responseRow]}>
            {radioButtons({ field: communityVisit, action: setCommunityVisit, prompt: LocalizedStrings[language].communityVisit, language })}
            <View style={{ paddingLeft: 20 }}>{communityVisit ? datePicker({ placeholder: "Date", date: communityVisitDate, action: setCommunityVisitDate, language }) : null}</View>
          </View>


          <View style={[styles.responseRow]}>
            {radioButtons({ field: promoterVisit, action: setPromoterVisit, prompt: LocalizedStrings[language].promoterVisit, language })}
            <View style={{ paddingLeft: 20 }}>{promoterVisit ? datePicker({ placeholder: "Date", date: promoterVisitDate, action: setPromoterVisitDate, language }) : null}</View>
          </View>

          <View style={[styles.responseRow]}>
            {radioButtons({ field: refusal, action: setRefusal, prompt: LocalizedStrings[language].refusal, language })}
            <View style={{ paddingLeft: 20 }}>{refusal ? datePicker({ placeholder: "Date", date: refusalDate, action: setRefusalDate, language }) : null}</View>
          </View>

          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].nextVisitDate}</Text>
          </View>
          <View style={{ paddingLeft: 20 }}>{datePicker({ placeholder: 'Next Visit', date: nextVisitDate, action: setNextVisitDate, future: true, language })}</View>

          <View style={[styles.responseRow, { paddingVertical: 0 }]}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].nextVisitReason}</Text>
          </View>
          <View style={[styles.responseRow, { paddingHorizontal: 0, paddingTop: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setNextVisitReason(text)}
              value={nextVisitReason}
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

export default ClinicalEvaluation;
