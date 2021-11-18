import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, Button, TouchableOpacity
} from 'react-native';

import { database } from "../storage/Database";
import { v4 as uuid } from 'uuid';
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import { LocalizedStrings } from '../enums/LocalizedStrings';
import radioButtons from './shared/RadioButtons';
import { formatTextDisplay } from './shared/EventFieldDisplay';

export const PhysiotherapyDisplay = (metadataObj, language) => {
  return (
    <View>
      <Text>{LocalizedStrings[language].provider}: {metadataObj.doctor} </Text>
      <Text>{LocalizedStrings[language].previousTreatment}: {formatTextDisplay(metadataObj.previousTreatment, metadataObj.previousTreatmentText, language)} </Text>
      <Text>{LocalizedStrings[language].complaint}: {metadataObj.complaint} </Text>
      <Text>{LocalizedStrings[language].findings}: {metadataObj.findings}</Text>
      <Text>{LocalizedStrings[language].treatmentPlan}: {metadataObj.treatmentPlan}</Text>
      <Text>{LocalizedStrings[language].treatmentSession}: {metadataObj.treatmentSession}</Text>
      <Text>{LocalizedStrings[language].recommendations}: {metadataObj.recommendations}</Text>
      <Text>{LocalizedStrings[language].referral}: {formatTextDisplay(metadataObj.referral, metadataObj.referralText, language)} </Text>
    </View>)
}

const Physiotherapy = (props) => {
  const [previousTreatment, setPreviousTreatment] = useState(null);
  const [previousTreatmentText, setPreviousTreatmentText] = useState(null);
  const [complaint, setComplaint] = useState(null);
  const [findings, setFindings] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [treatmentSession, setTreatmentSession] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [referral, setReferral] = useState(null);
  const [referralText, setReferralText] = useState(null);

  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');
  const language = props.navigation.getParam('language', 'en');
  const userName = props.navigation.getParam('userName');

  useEffect(() => {
    database.getLatestPatientEventByType(patientId, EventTypes.Physiotherapy).then((response: any) => {
      if (response.length > 0) {
        const responseObj = JSON.parse(response)
        setPreviousTreatment(responseObj.previousTreatment)
        setPreviousTreatmentText(responseObj.previousTreatmentText)
        setComplaint(responseObj.complaint)
        setFindings(responseObj.findings)
        setTreatmentPlan(responseObj.treatmentPlan)
        setTreatmentSession(responseObj.treatmentSession)
        setReferral(responseObj.referral)
        setReferralText(responseObj.referralText)
        setRecommendations(responseObj.recommendations)
      }
    })
  }, [])

  const submit = async () => {
    database.addEvent({
      id: uuid(),
      patient_id: patientId,
      visit_id: visitId,
      event_type: EventTypes.Physiotherapy,
      event_metadata: JSON.stringify({
        doctor: userName,
        previousTreatment,
        previousTreatmentText,
        complaint,
        findings,
        treatmentPlan,
        treatmentSession,
        recommendations,
        referral,
        referralText,
      })
    }).then(() => {
      props.navigation.navigate('NewVisit')
    })
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.containerLeft}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => props.navigation.navigate('NewVisit')}>
            <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'stretch', }}>
          <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold' }]}>{LocalizedStrings[language].physiotherapy}</Text>
        </View>

        <View style={styles.responseRow}>
          {radioButtons({ field: previousTreatment, action: setPreviousTreatment, prompt: LocalizedStrings[language].previousTreatment, language })}
        </View>
        {!!previousTreatment ?
          <View style={[styles.responseRow, { paddingTop: 0, paddingHorizontal: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setPreviousTreatmentText(text)}
              value={previousTreatmentText}
            />
          </View> :
          null
        }
        <View style={[styles.responseRow, { paddingBottom: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].complaint}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setComplaint(text)}
            value={complaint}
          />
        </View>
        <View style={[styles.responseRow, { paddingVertical: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].findings}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setFindings(text)}
            value={findings}
          />
        </View>
        <View style={[styles.responseRow, { paddingVertical: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].treatmentPlan}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setTreatmentPlan(text)}
            value={treatmentPlan}
          />
        </View>
        <View style={[styles.responseRow, { paddingVertical: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].treatmentSession}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setTreatmentSession(text)}
            value={treatmentSession}
          />
        </View>

        <View style={[styles.responseRow, { paddingVertical: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].recommendations}</Text>
        </View>
        <View style={[styles.responseRow, { paddingTop: 0, paddingHorizontal: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setRecommendations(text)}
            value={recommendations}
          />
        </View>
        <View style={styles.responseRow}>
          {radioButtons({ field: referral, action: setReferral, prompt: LocalizedStrings[language].referral, language })}
        </View>
        {!!referral ?
          <View style={[styles.responseRow, { paddingTop: 0, paddingHorizontal: 0 }]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setReferralText(text)}
              value={referralText}
            />
          </View> :
          null
        }
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

export default Physiotherapy;
