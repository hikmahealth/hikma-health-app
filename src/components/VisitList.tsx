import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { database } from "../storage/Database";
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings'

const VisitList = (props) => {
  const patient = props.navigation.getParam('patient');

  const [list, setList] = useState([]);
  const [language, setLanguage] = useState(props.navigation.getParam('language'));

  useEffect(() => {
    database.getVisits(patient.id).then(visits => {
      setList(visits);
    })
  }, [props, language])

  useEffect(() => {
    if (language !== props.navigation.getParam('language')) {
      setLanguage(props.navigation.getParam('language'));
    }
  }, [props])

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
    <TouchableOpacity style={styles.card} onPress={() => props.navigation.navigate('EventList',
      {
        language: language,
        patient: patient,
        visit: item
      }
    )}>
      <View style={styles.cardContent} >
        <View style={{ margin: 10 }}>
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
    </TouchableOpacity>
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
      <View style={styles.buttonBar}>
        <Text style={styles.text}>{LocalizedStrings[language].visitHistory}</Text>
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

export default VisitList;