import React, { Component, useState, useEffect, useRef } from "react";
import { View, Text, Image, TextInput, FlatList, StyleSheet, TouchableOpacity, ImageBackground, ImageBackgroundBase, ImageSourcePropType } from "react-native";
import { database } from "../database/Database";
import { DatabaseSync } from "../database/Sync";
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings'

const VisitHistory = (props) => {
  const [patient, setPatient] = useState(props.navigation.getParam('patient'));

  const [list, setList] = useState([]);
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'));

  useEffect(() => {
    database.getVisits(patient.id).then(visits => {
      setList(visits);
    })
  }, [props, language])

  const keyExtractor = (item, index) => index.toString()

  const displayPatientName = (item) => {
    if (!!item.given_name.content[language] && !!item.surname.content[language]) {
      return <Text>{`${item.given_name.content[language]} ${item.surname.content[language]}`}</Text>
    } else {
      return <Text>{`${item.given_name.content[Object.keys(item.given_name.content)[0]]} ${item.surname.content[Object.keys(item.surname.content)[0]]}`}</Text>
    }
  }

  const displayProviderName = (item) => {
    if (!!item.provider_name.content[language]) {
      return <Text>{`${LocalizedStrings[language].provider}: ${item.provider_name.content[language]}`}</Text>
    } else {
      return <Text>{`${LocalizedStrings[language].provider}: ${item.provider_name.content[Object.keys(item.provider_name.content)[0]]}`}</Text>
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
        <View style={{margin: 10}}>
          {displayPatientName(patient)}
          <View
            style={{
              marginVertical: 5,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          {displayProviderName(item)}
          <Text>{`${LocalizedStrings[language].visitDate}: ${item.check_in_timestamp}`}</Text>
        </View>
    </View>
  )

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

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.main}>
    <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => props.navigation.navigate('PatientView', { language: language, patient: patient })}>
          <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
        </TouchableOpacity>
        {LanguageToggle()}
      </View>
      <View style={styles.listContainer}>

        <View style={styles.scroll}>
          <FlatList
            keyExtractor={keyExtractor}
            data={list}
            renderItem={(item) => renderItem(item)}
          />
        </View>

      </View>
    </LinearGradient>
  )

}

export default VisitHistory;