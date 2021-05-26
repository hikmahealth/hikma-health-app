import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, Button, TouchableOpacity
} from 'react-native';

import { database } from "../storage/Database";
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings';
import radioButtons from './shared/RadioButtons';

const EditExamination = (props) => {
  const event = props.navigation.getParam('event');
  const language = props.navigation.getParam('language', 'en')
  const userName = props.navigation.getParam('userName');

  const [examination, setExamination] = useState(null);
  const [generalObservations, setGeneralObservations] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [treatment, setTreatment] = useState(null);
  const [covid19, setCovid19] = useState(null);
  const [referral, setReferral] = useState(null);
  const [referralText, setReferralText] = useState(null);

  useEffect(() => {
    if (!!event.event_metadata) {
      const metadataObj = JSON.parse(event.event_metadata)
      setExamination(metadataObj.examination)
      setGeneralObservations(metadataObj.generalObservations)
      setDiagnosis(metadataObj.diagnosis)
      setTreatment(metadataObj.treatment)
      setCovid19(metadataObj.covid19)
      setReferral(metadataObj.referral)
      setReferralText(metadataObj.referralText)
    }
  }, [props])

  const submitExamination = async () => {
    database.editEvent(
      event.id,
      JSON.stringify({
        doctor: userName,
        examination,
        generalObservations,
        diagnosis,
        treatment,
        covid19,
        referral,
        referralText,
      })
    ).then((response) => props.navigation.navigate('EventList', { events: response, language }))
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.containerLeft}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => props.navigation.navigate('EventList', { language })}>
            <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'stretch', }}>
          <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold' }]}>{LocalizedStrings[language].examination}</Text>
        </View>
        <View style={[styles.responseRow, { paddingBottom: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].examination}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setExamination(text)}
            value={examination}
          />
        </View>
        <View style={[styles.responseRow, { paddingVertical: 0 }]}>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].generalObservations}</Text>
        </View>
        <View style={[styles.responseRow, { padding: 0 }]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setGeneralObservations(text)}
            value={generalObservations}
          />
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
        <View style={styles.responseRow}>
          {radioButtons({ field: covid19, action: setCovid19, prompt: LocalizedStrings[language].covid19, language })}
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
            onPress={() => submitExamination()} />
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default EditExamination;
