import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView, Button
} from 'react-native';
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import { database } from "../storage/Database";
import { v4 as uuid } from 'uuid';
import { LocalizedStrings } from '../enums/LocalizedStrings';
import radioButtons from './shared/RadioButtons'
import DatePicker from 'react-native-datepicker';
import Header from './shared/Header';

const formatResult = (metadataObj, language) => {
  if (metadataObj.seekCare) {
    return LocalizedStrings[language].seekCare
  }
  if (metadataObj.testAndIsolate) {
    return LocalizedStrings[language].testIsolate
  }
  return LocalizedStrings[language].noAction

}

const formatTravel = (metadataObj, language) => {
  if (!!metadataObj.travelDeparture && !!metadataObj.travelReturn) {
    return (metadataObj.travelDeparture + ' ' + LocalizedStrings[language].to + ' ' + metadataObj.travelReturn)
  }
  return LocalizedStrings[language].yes
}

export const Covid19Display = (metadataObj, language) => {
  return (
    <View>
      <Text style={{ fontWeight: 'bold' }}>{formatResult(metadataObj, language)}</Text>
      {!!metadataObj.fever ? <Text>{LocalizedStrings[language].fever}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.dryCough ? <Text>{LocalizedStrings[language].dryCough}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.diffBreathing ? <Text>{LocalizedStrings[language].diffBreathing}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.soreThroat ? <Text>{LocalizedStrings[language].soreThroat}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.nausea ? <Text>{LocalizedStrings[language].nausea}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.symptomsDate ? <Text>{LocalizedStrings[language].symptomsDate}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.chestPain ? <Text>{LocalizedStrings[language].chestPain}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.confusion ? <Text>{LocalizedStrings[language].confusion}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.bluish ? <Text>{LocalizedStrings[language].bluish}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.fatigue ? <Text>{LocalizedStrings[language].fatigue}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.aches ? <Text>{LocalizedStrings[language].aches}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.headache ? <Text>{LocalizedStrings[language].headache}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.changeTasteSmell ? <Text>{LocalizedStrings[language].changeTasteSmell}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.diabetes ? <Text>{LocalizedStrings[language].diabetes}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.cardioDisease ? <Text>{LocalizedStrings[language].cardioDisease}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.pulmonaryDisease ? <Text>{LocalizedStrings[language].pulmonaryDisease}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.renalDisease ? <Text>{LocalizedStrings[language].renalDisease}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.malignancy ? <Text>{LocalizedStrings[language].malignancy}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.pregnant ? <Text>{LocalizedStrings[language].pregnant}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.immunocompromised ? <Text>{LocalizedStrings[language].immunocompromised}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.exposureKnown ? <Text>{LocalizedStrings[language].exposureKnown}: {LocalizedStrings[language].yes}</Text> : null}
      {!!metadataObj.travel ? <Text>{LocalizedStrings[language].travel}: {formatTravel(metadataObj, language)}</Text> : null}
    </View>
  )
}

const Covid19Form = (props) => {
  const [fever, setFever] = useState(null);
  //lower resp
  const [dryCough, setDryCough] = useState(null);
  const [diffBreathing, setDiffBreathing] = useState(null);
  const [soreThroat, setSoreThroat] = useState(null);
  const [nausea, setNausea] = useState(null);
  const [symptomsDate, setSymptomsDate] = useState('');
  //sudden warning
  const [chestPain, setChestPain] = useState(null);
  const [confusion, setConfusion] = useState(null);
  const [bluish, setBluish] = useState(null);
  //other symptoms
  const [fatigue, setFatigue] = useState(null);
  const [aches, setAches] = useState(null);
  const [headache, setHeadache] = useState(null);
  const [changeTasteSmell, setChangeTasteSmell] = useState(null);
  //underlying
  const [diabetes, setDiabetes] = useState(null);
  const [cardioDisease, setCardioDisease] = useState(null);
  const [pulmonaryDisease, setPulmonaryDisease] = useState(null);
  const [renalDisease, setRenalDisease] = useState(null);
  const [malignancy, setMalignancy] = useState(null);
  const [pregnant, setPregnant] = useState(null);
  const [immunocompromised, setImmunocompromised] = useState(null);
  //exposure
  const [exposureKnown, setExposureKnown] = useState(null);
  const [travel, setTravel] = useState(null);
  const [travelDeparture, setTravelDeparture] = useState('');
  const [travelReturn, setTravelReturn] = useState('');
  const [submitted, setSubmitted] = useState(null);

  const [isCollapsed, setIsCollapsed] = useState(true)

  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'));
  const patient = props.navigation.getParam('patient');
  const visitId = props.navigation.getParam('visitId');

  const result = () => {
    if (emergencyResult()) {
      return LocalizedStrings[language].seekCare
    }

    if (testAndIsolate()) {
      return LocalizedStrings[language].testIsolate
    }
    return LocalizedStrings[language].noAction;
  }

  const emergencyResult = () => {
    return chestPain || confusion || bluish
  }

  const testAndIsolate = () => {
    return (fever || dryCough || diffBreathing || soreThroat || exposureKnown || travel
      || diabetes || cardioDisease || pulmonaryDisease || renalDisease || malignancy || pregnant || immunocompromised)

  }

  const getPatientAge = (dob: string) => {
    let birthdate = new Date(dob)
    let ageDifMs = Date.now() - birthdate.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const datePicker = (props) => {
    const today = new Date();
    return (
      <DatePicker
        style={{ width: 120 }}
        date={props.date}
        mode="date"
        placeholder={props.placeholder}
        format="YYYY-MM-DD"
        minDate="1900-05-01"
        maxDate={today.toISOString().split('T')[0]}
        confirmBtnText={LocalizedStrings[language].confirm}
        cancelBtnText={LocalizedStrings[language].cancel}
        customStyles={{
          dateInput: {
            alignItems: 'flex-start',
            borderWidth: 0
          },
          placeholderText: {
            color: '#FFFFFF'
          },
          dateText: {
            color: '#FFFFFF'
          },
          btnTextConfirm: {
            height: 20
          },
          btnTextCancel: {
            height: 20
          }
        }}
        androidMode='spinner'
        onDateChange={(date) => props.action(date)}
      />
    )
  }

  const handleSaveScreeningEvent = () => {
    database.addEvent({
      id: uuid(),
      patient_id: patient.id,
      visit_id: visitId,
      event_type: EventTypes.Covid19Screening,
      event_metadata: JSON.stringify({
        fever,
        dryCough,
        diffBreathing,
        soreThroat,
        nausea,
        symptomsDate,
        chestPain,
        confusion,
        bluish,
        fatigue,
        aches,
        headache,
        age: getPatientAge(patient.date_of_birth),
        diabetes,
        cardioDisease,
        pulmonaryDisease,
        renalDisease,
        malignancy,
        pregnant,
        immunocompromised,
        exposureKnown,
        travel,
        travelDeparture,
        travelReturn,
        seekCare: emergencyResult(),
        testAndIsolate: testAndIsolate()
      })
    }).then(() => {
      console.log('Screening event saved')
      setSubmitted(true)
    })
  }

  return !submitted ? (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.containerLeft]}>
        {Header({ action: () => props.navigation.navigate('NewVisit', { language }), language, setLanguage })}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'stretch', }}>
          <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold' }]}>{LocalizedStrings[language].covidScreening}</Text>
        </View>

        <View style={[styles.inputsContainer, { alignItems: 'flex-start' }]}>
          <View style={styles.responseRow}>
            {radioButtons({ field: chestPain, action: setChestPain, prompt: LocalizedStrings[language].chestPain, language })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: confusion, action: setConfusion, prompt: LocalizedStrings[language].confusion, language })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: bluish, action: setBluish, prompt: LocalizedStrings[language].bluish, language })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: fever, action: setFever, prompt: LocalizedStrings[language].fever, language })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: dryCough, action: setDryCough, prompt: LocalizedStrings[language].dryCough, language })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: diffBreathing, action: setDiffBreathing, prompt: LocalizedStrings[language].diffBreathing, language })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: soreThroat, action: setSoreThroat, prompt: LocalizedStrings[language].soreThroat, language })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: nausea, action: setNausea, prompt: LocalizedStrings[language].nausea, language })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: fatigue, action: setFatigue, prompt: LocalizedStrings[language].fatigue, language })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: aches, action: setAches, prompt: LocalizedStrings[language].aches, language })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: headache, action: setHeadache, prompt: LocalizedStrings[language].headache, language })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: changeTasteSmell, action: setChangeTasteSmell, prompt: LocalizedStrings[language].changeTasteSmell, language })}
          </View>
          <View style={styles.responseRow}>{datePicker({ placeholder: LocalizedStrings[language].symptomsDate, date: symptomsDate, action: setSymptomsDate })}</View>

          <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}
            style={styles.responseRow}
          // style={{ flexDirection: 'row', justifyContent: "flex-end", alignItems: 'center', }}
          >
            <Text style={styles.text}>{isCollapsed ? LocalizedStrings[language].riskFactors : LocalizedStrings[language].hideRiskFactors}</Text>
            <Image source={require('../images/menu.png')} style={{ width: 50, height: 50 }} />
          </TouchableOpacity>

          {isCollapsed ? null :
            <View style={{ width: '100%' }}>
              <View style={styles.responseRow}>
                {radioButtons({ field: diabetes, action: setDiabetes, prompt: LocalizedStrings[language].diabetes, language })}
              </View>
              <View style={styles.responseRow}>
                {radioButtons({ field: cardioDisease, action: setCardioDisease, prompt: LocalizedStrings[language].cardioDisease, language })}
              </View>
              <View style={styles.responseRow}>
                {radioButtons({ field: pulmonaryDisease, action: setPulmonaryDisease, prompt: LocalizedStrings[language].pulmonaryDisease, language })}
              </View>
              <View style={styles.responseRow}>
                {radioButtons({ field: renalDisease, action: setRenalDisease, prompt: LocalizedStrings[language].renalDisease, language })}
              </View>
              <View style={styles.responseRow}>
                {radioButtons({ field: malignancy, action: setMalignancy, prompt: LocalizedStrings[language].malignancy, language })}
              </View>
              <View style={styles.responseRow}>
                {radioButtons({ field: pregnant, action: setPregnant, prompt: LocalizedStrings[language].pregnant, language })}
              </View>
              <View style={styles.responseRow}>
                {radioButtons({ field: immunocompromised, action: setImmunocompromised, prompt: LocalizedStrings[language].immunocompromised, language })}
              </View>
              <View style={[styles.responseRow]}>
                {radioButtons({ field: exposureKnown, action: setExposureKnown, prompt: LocalizedStrings[language].exposureKnown, language })}
              </View>
              <View style={styles.responseRow}>
                {radioButtons({ field: travel, action: setTravel, prompt: LocalizedStrings[language].travel, language })}
              </View>
              <View style={styles.responseRow}>
                <View style={{ paddingLeft: 20 }}>{travel ? datePicker({ placeholder: LocalizedStrings[language].departure, date: travelDeparture, action: setTravelDeparture }) : null}</View>
                {travel ? <Text style={{ color: '#FFFFFF', paddingLeft: 10 }}>{LocalizedStrings[language].to}</Text> : null}
                <View style={{ paddingLeft: 20 }}>{travel ? datePicker({ placeholder: LocalizedStrings[language].return, date: travelReturn, action: setTravelReturn }) : null}</View>
              </View>
            </View>
          }
        </View>
        <View style={{ alignItems: 'center' }}>
          <Button
            title={LocalizedStrings[language].save}
            color={'#F77824'}
            onPress={() => handleSaveScreeningEvent()}
          />
        </View>
      </View>
    </ScrollView>
  ) : (
      <View colors={['#31BBF3', '#4D7FFF']} style={styles.containerLeft}>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => { props.navigation.navigate('NewVisit', { language: language }) }}>
            <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontSize: 20 }}>{result()}</Text>
        </View>
      </View>
    );
};

export default Covid19Form;