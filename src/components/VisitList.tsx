import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Picker, Alert } from "react-native";
import { database } from "../storage/Database";
import styles from './Style';
import { LocalizedStrings } from '../enums/LocalizedStrings'
import { Visit } from "../types/Visit";
import Header from "./shared/Header";

const VisitList = (props) => {
  const patient = props.navigation.getParam('patient');

  const [list, setList] = useState([]);
  const [language, setLanguage] = useState(props.navigation.getParam('language'));
  const userName = props.navigation.getParam('userName');

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

  const deleteVisit = (visit: Visit) => {
    database.deleteVisit(visit.id, patient.id).then(visits => {
      setList(visits)
    })
  }

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
        language,
        patient,
        userName,
        visit: item
      }
    )}
      onLongPress={() => Alert.alert(
        'Delete Visit',
        'Are you sure you want to delete this visit?',
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "Confirm", onPress: () => {
              deleteVisit(item)
            }
          }
        ],
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
          <Text>{`${LocalizedStrings[language].visitDate}: ${item.check_in_timestamp.split('T')[0]}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )


  return (
    <View style={styles.main}>
      {Header({ action: () => props.navigation.navigate('PatientView', { language: language, patient: patient }), language, setLanguage })}
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={styles.text}>{LocalizedStrings[language].visitHistory}   ({list.length})</Text>
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
    </View>
  )

}

export default VisitList;