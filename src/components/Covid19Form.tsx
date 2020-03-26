import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, ScrollView
} from 'react-native';
import styles from './Style';
import { EventTypes } from '../enums/EventTypes';
import LinearGradient from 'react-native-linear-gradient';
import { database } from "../database/Database";
import { uuid } from "uuidv4";
import { LocalizedStrings } from '../enums/LocalizedStrings';
import DatePicker from 'react-native-datepicker';
import Slider from '@react-native-community/slider';

const Covid19Form = (props) => {
  const [fever, setFever] = useState(false);
  const [feverDate, setFeverDate] = useState('');
  //lower resp
  const [dryCough, setDryCough] = useState(false);
  const [coughDate, setCoughDate] = useState('');
  const [coughSeverity, setCoughSeverity] = useState(1);
  const [diffBreathing, setDiffBreathing] = useState(false);
  const [diffBreathingDate, setDiffBreathingDate] = useState('');
  const [diffBreathingSeverity, setDiffBreathingSeverity] = useState(1);
  const [soreThroat, setSoreThroat] = useState(false);
  const [soreThroatDate, setSoreThroatDate] = useState('');
  const [soreThroatSeverity, setSoreThroatSeverity] = useState(1);
  //sudden warning
  const [chestPain, setChestPain] = useState(false);
  const [confusion, setConfusion] = useState(false);
  const [bluish, setBluish] = useState(false);
  //other symptoms
  const [fatigue, setFatigue] = useState(false);
  const [fatigueDate, setFatigueDate] = useState('');
  const [aches, setAches] = useState(false);
  const [achesDate, setAchesDate] = useState('');
  const [headache, setHeadache] = useState(false);
  const [headacheDate, setHeadacheDate] = useState('');
  //underlying
  const [diabetes, setDiabetes] = useState(false);
  const [cardioDisease, setCardioDisease] = useState(false);
  const [pulmonaryDisease, setPulmonaryDisease] = useState(false);
  const [renalDisease, setRenalDisease] = useState(false);
  const [malignancy, setMalignancy] = useState(false);
  const [pregnant, setPregnant] = useState(false);
  const [immunocompromised, setImmunocompromised] = useState(false);
  //exposure
  const [exposureKnown, setExposureKnown] = useState(false);
  const [exposureSuspected, setExposureSuspected] = useState(false);
  const [travelIran, setTravelIran] = useState(false);
  const [travelIranDeparture, setTravelIranDeparture] = useState('');
  const [travelIranReturn, setTravelIranReturn] = useState('');
  const [travel, setTravel] = useState(false);
  const [travelDeparture, setTravelDeparture] = useState('');
  const [travelReturn, setTravelReturn] = useState('');

  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))
  const patient = props.navigation.getParam('patient');
  const visitId = props.navigation.getParam('visitId');

  const result = () => {
    let testIsolate = false;
    if ((getPatientAge(patient.date_of_birth) > 18 && (chestPain || confusion || bluish))
      || ((dryCough || diffBreathing || soreThroat) && fever)
      || exposureKnown || exposureSuspected || travel || travelIran || getPatientAge(patient.date_of_birth) > 55 || diabetes || cardioDisease || pulmonaryDisease || renalDisease || malignancy || pregnant || immunocompromised) {
      testIsolate = true
    }
    return testIsolate;
  }

  const getPatientAge = (dob: string) => {
    let birthdate = new Date(dob)
    let ageDifMs = Date.now() - birthdate.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

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

  const slider = (props) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.text}>{LocalizedStrings[language].severity} : {props.severity}</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          step={1}
          value={props.severity}
          minimumValue={1}
          maximumValue={3}
          onValueChange={(value) => props.action(value)}
        />
      </View>
    )
  }

  const radioButtons = (props) => {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text style={{ color: '#FFFFFF' }}>{props.prompt}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => props.action(!props.field)}>
            <View style={styles.outerRadioButton}>
              {props.field ? <View style={styles.selectedRadioButton} /> : null}
            </View>
          </TouchableOpacity>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].yes}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => props.action(!props.field)}>
            <View style={styles.outerRadioButton}>
              {!props.field ? <View style={styles.selectedRadioButton} /> : null}
            </View>
          </TouchableOpacity>
          <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].no}</Text>
        </View>
      </View>
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
        coughDate,
        coughSeverity,
        diffBreathing,
        diffBreathingDate,
        diffBreathingSeverity,
        soreThroat,
        soreThroatDate,
        soreThroatSeverity,
        chestPain,
        confusion,
        bluish,
        fatigue,
        fatigueDate,
        aches,
        achesDate,
        headache,
        headacheDate,
        age: getPatientAge(patient.date_of_birth),
        diabetes,
        cardioDisease,
        pulmonaryDisease,
        renalDisease,
        malignancy,
        pregnant,
        immunocompromised,
        exposureKnown,
        exposureSuspected,
        travelIran,
        travelIranDeparture,
        travelIranReturn,
        travel,
        travelDeparture,
        travelReturn,
        testAndIsolate: result()
      })
    }).then(() => {
      console.log('Screening event saved')
      props.navigation.navigate('NewVisit', { language: language })
    })
  }

  return (
    <ScrollView>
      <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.containerLeft}>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => { props.navigation.navigate('NewVisit', { language: language }) }}>
            <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
          </TouchableOpacity>
          {LanguageToggle()}
        </View>

        <View style={[styles.inputsContainer, { alignItems: 'flex-start' }]}>
          <View style={styles.responseRow}>
            {radioButtons({ field: fever, action: setFever, prompt: LocalizedStrings[language].fever })}
            <View style={{ paddingLeft: 20 }}>{fever ? datePicker({ placeholder: LocalizedStrings[language].onsetDate, date: feverDate, action: setFeverDate }) : null}</View>
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: dryCough, action: setDryCough, prompt: LocalizedStrings[language].dryCough })}
            <View style={{ paddingLeft: 10 }}>{dryCough ? datePicker({ placeholder: LocalizedStrings[language].onsetDate, date: coughDate, action: setCoughDate }) : null}</View>
            <View style={{ paddingLeft: 20 }}>{dryCough ? slider({ severity: coughSeverity, action: setCoughSeverity }) : null}</View>
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: diffBreathing, action: setDiffBreathing, prompt: LocalizedStrings[language].diffBreathing })}
            <View style={{ paddingLeft: 20 }}>{diffBreathing ? datePicker({ placeholder: LocalizedStrings[language].onsetDate, date: diffBreathingDate, action: setDiffBreathingDate }) : null}</View>
            <View style={{ paddingLeft: 20 }}>{diffBreathing ? slider({ severity: diffBreathingSeverity, action: setDiffBreathingSeverity }) : null}</View>
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: soreThroat, action: setSoreThroat, prompt: LocalizedStrings[language].soreThroat })}
            <View style={{ paddingLeft: 20 }}>{soreThroat ? datePicker({ placeholder: LocalizedStrings[language].onsetDate, date: soreThroatDate, action: setSoreThroatDate }) : null}</View>
            <View style={{ paddingLeft: 20 }}>{soreThroat ? slider({ severity: soreThroatSeverity, action: setSoreThroatSeverity }) : null}</View>
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: chestPain, action: setChestPain, prompt: LocalizedStrings[language].chestPain })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: confusion, action: setConfusion, prompt: LocalizedStrings[language].confusion })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: bluish, action: setBluish, prompt: LocalizedStrings[language].bluish })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: fatigue, action: setFatigue, prompt: LocalizedStrings[language].fatigue })}
            <View style={{ paddingLeft: 10 }}>{fatigue ? datePicker({ placeholder: LocalizedStrings[language].onsetDate, date: fatigueDate, action: setFatigueDate }) : null}</View>
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: aches, action: setAches, prompt: LocalizedStrings[language].aches })}
            <View style={{ paddingLeft: 10 }}>{aches ? datePicker({ placeholder: LocalizedStrings[language].onsetDate, date: achesDate, action: setAchesDate }) : null}</View>
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: headache, action: setHeadache, prompt: LocalizedStrings[language].headache })}
            <View style={{ paddingLeft: 10 }}>{headache ? datePicker({ placeholder: LocalizedStrings[language].onsetDate, date: headacheDate, action: setHeadacheDate }) : null}</View>
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: diabetes, action: setDiabetes, prompt: LocalizedStrings[language].diabetes })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: cardioDisease, action: setCardioDisease, prompt: LocalizedStrings[language].cardioDisease })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: pulmonaryDisease, action: setPulmonaryDisease, prompt: LocalizedStrings[language].pulmonaryDisease })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: renalDisease, action: setRenalDisease, prompt: LocalizedStrings[language].renalDisease })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: malignancy, action: setMalignancy, prompt: LocalizedStrings[language].malignancy })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: pregnant, action: setPregnant, prompt: LocalizedStrings[language].pregnant })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: immunocompromised, action: setImmunocompromised, prompt: LocalizedStrings[language].immunocompromised })}
          </View>
          <View style={[styles.responseRow, { maxWidth: '90%' }]}>
            {radioButtons({ field: exposureKnown, action: setExposureKnown, prompt: LocalizedStrings[language].exposureKnown })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: exposureSuspected, action: setExposureSuspected, prompt: LocalizedStrings[language].exposureSuspected })}
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: travelIran, action: setTravelIran, prompt: LocalizedStrings[language].travelIran })}
            <View style={{ paddingLeft: 20 }}>{travelIran ? datePicker({ placeholder: LocalizedStrings[language].departure, date: travelIranDeparture, action: setTravelIranDeparture }) : null}</View>
            {travelIran ? <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].to}</Text> : null}
            <View style={{ paddingLeft: 20 }}>{travelIran ? datePicker({ placeholder: LocalizedStrings[language].return, date: travelIranReturn, action: setTravelIranReturn }) : null}</View>
          </View>
          <View style={styles.responseRow}>
            {radioButtons({ field: travel, action: setTravel, prompt: LocalizedStrings[language].travel })}
            <View style={{ paddingLeft: 20 }}>{travel ? datePicker({ placeholder: LocalizedStrings[language].departure, date: travelDeparture, action: setTravelDeparture }) : null}</View>
            {travel ? <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].to}</Text> : null}
            <View style={{ paddingLeft: 20 }}>{travel ? datePicker({ placeholder: LocalizedStrings[language].return, date: travelReturn, action: setTravelReturn }) : null}</View>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => handleSaveScreeningEvent()}>
            <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default Covid19Form;