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
    if ((getPatientAge(patient.dob) > 18 && (chestPain || confusion || bluish))
      || ((dryCough || diffBreathing || soreThroat) && fever)
      || exposureKnown || exposureSuspected || travel || travelIran || getPatientAge(patient.dob) > 55 || diabetes || cardioDisease || pulmonaryDisease || renalDisease || malignancy || pregnant || immunocompromised) {
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
    return (
      <DatePicker
        style={{ width: 120 }}
        date={props.date}
        mode="date"
        placeholder={props.placeholder}
        format="YYYY-MM-DD"
        minDate="1900-05-01"
        maxDate="2020-03-27"
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
        <Text style={{ color: '#FFFFFF', padding: 10 }}>Severity: {props.severity}</Text>
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
        age: getPatientAge(patient.dob),
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
      <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.container}>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => {
            props.navigation.navigate('NewVisit', { language: language })
          }
          }>
            <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
          </TouchableOpacity>
          {LanguageToggle()}
        </View>

        <View style={[styles.inputsContainer, { alignItems: 'flex-start' }]}>
          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Fever?</Text>
              <TouchableOpacity onPress={() => setFever(!fever)}>
                <View style={styles.outerRadioButton}>
                  {fever ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setFever(!fever)}>
                <View style={styles.outerRadioButton}>
                  {!fever ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
            <View style={{ paddingLeft: 20 }}>{fever ? datePicker({ placeholder: "Date Onset", date: feverDate, action: setFeverDate }) : null}</View>
          </View>

          <View style={[styles.inputRow, { flexWrap: 'wrap' }]}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Dry Cough?</Text>
              <TouchableOpacity onPress={() => setDryCough(!dryCough)}>
                <View style={styles.outerRadioButton}>
                  {dryCough ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setDryCough(!dryCough)}>
                <View style={styles.outerRadioButton}>
                  {!dryCough ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
            <View style={{ paddingLeft: 10 }}>{dryCough ? datePicker({ placeholder: "Date Onset", date: coughDate, action: setCoughDate }) : null}</View>
            <View style={{ paddingLeft: 20 }}>{dryCough ? slider({ severity: coughSeverity, action: setCoughSeverity }) : null}</View>
          </View>

          <View style={[styles.inputRow, { flexWrap: 'wrap' }]}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Difficulty Breathing?</Text>
              <TouchableOpacity onPress={() => setDiffBreathing(!diffBreathing)}>
                <View style={styles.outerRadioButton}>
                  {diffBreathing ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setDiffBreathing(!diffBreathing)}>
                <View style={styles.outerRadioButton}>
                  {!diffBreathing ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
            <View style={{ paddingLeft: 20 }}>{diffBreathing ? datePicker({ placeholder: "Date Onset", date: diffBreathingDate, action: setDiffBreathingDate }) : null}</View>
            <View style={{ paddingLeft: 20 }}>{diffBreathing ? slider({ severity: diffBreathingSeverity, action: setDiffBreathingSeverity }) : null}</View>
          </View>

          <View style={[styles.inputRow, { flexWrap: 'wrap' }]}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Sore Throat?</Text>
              <TouchableOpacity onPress={() => setSoreThroat(!soreThroat)}>
                <View style={styles.outerRadioButton}>
                  {soreThroat ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setSoreThroat(!soreThroat)}>
                <View style={styles.outerRadioButton}>
                  {!soreThroat ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
            <View style={{ paddingLeft: 20 }}>{soreThroat ? datePicker({ placeholder: "Date Onset", date: soreThroatDate, action: setSoreThroatDate }) : null}</View>
            <View style={{ paddingLeft: 20 }}>{soreThroat ? slider({ severity: soreThroatSeverity, action: setSoreThroatSeverity }) : null}</View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Chest Pain?</Text>
              <TouchableOpacity onPress={() => setChestPain(!chestPain)}>
                <View style={styles.outerRadioButton}>
                  {chestPain ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setChestPain(!chestPain)}>
                <View style={styles.outerRadioButton}>
                  {!chestPain ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>New Confusion?</Text>
              <TouchableOpacity onPress={() => setConfusion(!confusion)}>
                <View style={styles.outerRadioButton}>
                  {confusion ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setConfusion(!confusion)}>
                <View style={styles.outerRadioButton}>
                  {!confusion ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Bluish Lips or Face?</Text>
              <TouchableOpacity onPress={() => setBluish(!bluish)}>
                <View style={styles.outerRadioButton}>
                  {bluish ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setBluish(!bluish)}>
                <View style={styles.outerRadioButton}>
                  {!bluish ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={[styles.inputRow, { flexWrap: 'wrap' }]}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Fatigue?</Text>
              <TouchableOpacity onPress={() => setFatigue(!fatigue)}>
                <View style={styles.outerRadioButton}>
                  {fatigue ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setFatigue(!fatigue)}>
                <View style={styles.outerRadioButton}>
                  {!fatigue ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
            <View style={{ paddingLeft: 10 }}>{fatigue ? datePicker({ placeholder: "Date Onset", date: fatigueDate, action: setFatigueDate }) : null}</View>
          </View>

          <View style={[styles.inputRow, { flexWrap: 'wrap' }]}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Aches and Pains?</Text>
              <TouchableOpacity onPress={() => setAches(!aches)}>
                <View style={styles.outerRadioButton}>
                  {aches ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setAches(!aches)}>
                <View style={styles.outerRadioButton}>
                  {!aches ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
            <View style={{ paddingLeft: 10 }}>{aches ? datePicker({ placeholder: "Date Onset", date: achesDate, action: setAchesDate }) : null}</View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Headache?</Text>
              <TouchableOpacity onPress={() => setHeadache(!headache)}>
                <View style={styles.outerRadioButton}>
                  {headache ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setHeadache(!headache)}>
                <View style={styles.outerRadioButton}>
                  {!headache ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
            <View style={{ paddingLeft: 10 }}>{headache ? datePicker({ placeholder: "Date Onset", date: headacheDate, action: setHeadacheDate }) : null}</View>

          </View>

          {/* Age */}

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Diabetes?</Text>
              <TouchableOpacity onPress={() => setDiabetes(!diabetes)}>
                <View style={styles.outerRadioButton}>
                  {diabetes ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setDiabetes(!diabetes)}>
                <View style={styles.outerRadioButton}>
                  {!diabetes ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Cardiovascular Disease?</Text>
              <TouchableOpacity onPress={() => setCardioDisease(!cardioDisease)}>
                <View style={styles.outerRadioButton}>
                  {cardioDisease ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setCardioDisease(!cardioDisease)}>
                <View style={styles.outerRadioButton}>
                  {!cardioDisease ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Pulmonary Disease?</Text>
              <TouchableOpacity onPress={() => setPulmonaryDisease(!pulmonaryDisease)}>
                <View style={styles.outerRadioButton}>
                  {pulmonaryDisease ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setPulmonaryDisease(!pulmonaryDisease)}>
                <View style={styles.outerRadioButton}>
                  {!pulmonaryDisease ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Renal Disease?</Text>
              <TouchableOpacity onPress={() => setRenalDisease(!renalDisease)}>
                <View style={styles.outerRadioButton}>
                  {renalDisease ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setRenalDisease(!renalDisease)}>
                <View style={styles.outerRadioButton}>
                  {!renalDisease ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Malignancy?</Text>
              <TouchableOpacity onPress={() => setMalignancy(!malignancy)}>
                <View style={styles.outerRadioButton}>
                  {malignancy ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setMalignancy(!malignancy)}>
                <View style={styles.outerRadioButton}>
                  {!malignancy ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Pregnant or 2 weeks postpartum?</Text>
              <TouchableOpacity onPress={() => setPregnant(!pregnant)}>
                <View style={styles.outerRadioButton}>
                  {pregnant ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setPregnant(!pregnant)}>
                <View style={styles.outerRadioButton}>
                  {!pregnant ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Immunocompromised?</Text>
              <TouchableOpacity onPress={() => setImmunocompromised(!immunocompromised)}>
                <View style={styles.outerRadioButton}>
                  {immunocompromised ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setImmunocompromised(!immunocompromised)}>
                <View style={styles.outerRadioButton}>
                  {!immunocompromised ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }]}>
              <Text style={{ color: '#FFFFFF' }}>Recent contact with individuals with known COVID-19?</Text>
              <TouchableOpacity onPress={() => setExposureKnown(!exposureKnown)}>
                <View style={styles.outerRadioButton}>
                  {exposureKnown ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setExposureKnown(!exposureKnown)}>
                <View style={styles.outerRadioButton}>
                  {!exposureKnown ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }]}>
              <Text style={{ color: '#FFFFFF' }}>Recent contact with individuals with suspected COVID-19?</Text>
              <TouchableOpacity onPress={() => setExposureSuspected(!exposureSuspected)}>
                <View style={styles.outerRadioButton}>
                  {exposureSuspected ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setExposureSuspected(!exposureSuspected)}>
                <View style={styles.outerRadioButton}>
                  {!exposureSuspected ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
          </View>

          <View style={[styles.inputRow, { flexWrap: 'wrap' }]}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Recent travel to Iran?</Text>
              <TouchableOpacity onPress={() => setTravelIran(!travelIran)}>
                <View style={styles.outerRadioButton}>
                  {travelIran ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setTravelIran(!travelIran)}>
                <View style={styles.outerRadioButton}>
                  {!travelIran ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
            <View style={{ paddingLeft: 20 }}>{travelIran ? datePicker({ placeholder: "Departure", date: travelIranDeparture, action: setTravelIranDeparture }) : null}</View>
            {travelIran ? <Text style={{ color: '#FFFFFF' }}>to</Text> : null}
            <View style={{ paddingLeft: 20 }}>{travelIran ? datePicker({ placeholder: "Return", date: travelIranReturn, action: setTravelIranReturn }) : null}</View>
          </View>

          <View style={[styles.inputRow, { flexWrap: 'wrap' }]}>
            <View style={[{ flexDirection: 'row' }]}>
              <Text style={{ color: '#FFFFFF' }}>Recent travel out of Lebanon?</Text>
              <TouchableOpacity onPress={() => setTravel(!travel)}>
                <View style={styles.outerRadioButton}>
                  {travel ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>Y</Text>
              <TouchableOpacity onPress={() => setTravel(!travel)}>
                <View style={styles.outerRadioButton}>
                  {!travel ? <View style={styles.selectedRadioButton} /> : null}
                </View>
              </TouchableOpacity><Text style={{ color: '#FFFFFF' }}>N</Text>
            </View>
            <View style={{ paddingLeft: 20 }}>{travel ? datePicker({ placeholder: "Departure", date: travelDeparture, action: setTravelDeparture }) : null}</View>
            {travel ? <Text style={{ color: '#FFFFFF' }}>to</Text> : null}
            <View style={{ paddingLeft: 20 }}>{travel ? datePicker({ placeholder: "Return", date: travelReturn, action: setTravelReturn }) : null}</View>
          </View>

        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => handleSaveScreeningEvent()}>
            <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default Covid19Form;