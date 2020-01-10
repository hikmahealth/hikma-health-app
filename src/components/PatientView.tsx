import React, { Component, useState, useEffect } from "react";
import { View, Text, Image, TextInput, FlatList, StyleSheet, TouchableOpacity, ImageBackground, ImageBackgroundBase, Button, Alert } from "react-native";
import styles from './Style';

const PatientView = (props) => {

  const [patient, setPatient] = useState(props.navigation.getParam('patient'));
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))

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

  const displayName = (patient) => {
    if (!!patient.given_name.content[language] && !!patient.surname.content[language]) {
      return <Text>{`${patient.given_name.content[language]} ${patient.surname.content[language]}`}</Text>
    } else {
      patient.given_name.content[Object.keys(patient.given_name.content)[0]]
      return <Text>{`${patient.given_name.content[Object.keys(patient.given_name.content)[0]]} ${patient.surname.content[Object.keys(patient.surname.content)[0]]}`}</Text>
    }
  }

  const getPatientAge = (dob: string) => {
    let birthdate = new Date(dob)
    let ageDifMs = Date.now() - birthdate.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  return (
    <View style={styles.main}>
      <View style={styles.viewContainer}>
        <TouchableOpacity onPress={() => props.navigation.navigate('PatientList', { language: language })}>
          <Text style={{ margin: 20 }}>{`< PATIENTS`}</Text>
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <ImageBackground source={require('../images/palm-icon.jpg')} style={{ width: 100, height: 105, justifyContent: 'center' }}>
            <View style={styles.hexagon}>
              <View style={styles.hexagonInner} />
              <View style={styles.hexagonBefore} />
              <View style={styles.hexagonAfter} />
            </View>
          </ImageBackground>

          <View>
            {displayName(patient)}
            <View
              style={{
                marginVertical: 5,
                borderBottomColor: 'black',
                borderBottomWidth: 1,
              }}
            />
            <Text>{`Date of birth:  ${patient.date_of_birth}`}</Text>
            <Text>{`Sex:  ${patient.sex}`}</Text>
          </View>
        </View>
        <View style={styles.buttonBar}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              Alert.alert(
                'Under construction',
                '',
                [
                  { text: 'OK' },
                ],
              );
            }}>
            <Text style={{ color: '#31BBF3' }}>TRENDS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              Alert.alert(
                'Under construction',
                '',
                [
                  { text: 'OK' },
                ],
              );
            }}>
            <Text style={{ color: '#31BBF3' }}>VISIT HISTORY</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemText}>{patient.date_of_birth}</Text>
            <Text style={styles.gridItemLabel}>DOB</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemText}>{getPatientAge(patient.date_of_birth)}</Text>
            <Text style={styles.gridItemLabel}>AGE</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemText}>{patient.sex}</Text>
            <Text style={styles.gridItemLabel}>GENDER</Text>
          </View>
        </View>
        <View>
          <Text style={[styles.gridItemLabel, styles.title]}>Patient Summary</Text>
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
        </View>
        <View style={styles.newVisit}>
          <TouchableOpacity onPress={() => props.navigation.navigate('NewVisit', { language: language, patient: patient })}>
            <Image source={require('../images/newVisit.png')} style={{ width: 75, height: 75 }} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  )

}

export default PatientView;