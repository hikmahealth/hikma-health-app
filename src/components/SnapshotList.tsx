import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { database } from "../storage/Database";
import styles from './Style';
import { LocalizedStrings } from '../enums/LocalizedStrings'
import { EventTypes } from "../enums/EventTypes";
import { MedicineDisplay } from "./Medicine";
import { MedicalHistoryDisplay } from "./MedicalHistory";
import { ExaminationDisplay } from "./Examination";
import Header from "./shared/Header";

const SnapshotList = (props) => {
  const patient = props.navigation.getParam('patient');
  const eventType = props.navigation.getParam('eventType');
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'));

  const [list, setList] = useState(props.navigation.getParam('events', []));

  useEffect(() => {
    database.getAllPatientEventsByType(patient.id, eventType).then(events => {
      const filteredEvents = events.filter(event => {
        return !!event.event_metadata;
      })
      setList(filteredEvents);
    })
  }, [props, language])

  const keyExtractor = (item, index) => index.toString()

  const parseMetadata = (metadata: string) => {
    try {
      JSON.parse(metadata);
    } catch (e) {
      return metadata;
    }
    return JSON.parse(metadata);
  }

  const renderItem = ({ item }) => {
    const metadataObj = parseMetadata(item.event_metadata)

    let eventTypeText: string
    let display
    switch (item.event_type) {
      case EventTypes.MedicalHistoryFull:
        eventTypeText = LocalizedStrings[language].medicalHistory
        display = MedicalHistoryDisplay(metadataObj, language)
        break
      case EventTypes.ExaminationFull:
        eventTypeText = LocalizedStrings[language].examination
        display = ExaminationDisplay(metadataObj, language)
        break
      case EventTypes.Medicine:
        eventTypeText = LocalizedStrings[language].medicine
        display = MedicineDisplay(metadataObj, language)
        break
      case EventTypes.Complaint:
        eventTypeText = LocalizedStrings[language].complaint
        display = <Text>{metadataObj}</Text>
        break
      default:
        eventTypeText = item.event_type
        display = <Text>{metadataObj}</Text>
        break
    }

    const time = new Date(item.edited_at).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })

    return (
      <TouchableOpacity style={styles.card}
      // onLongPress={() => editEvent(item)}
      >
        <View style={styles.cardContent} >
          <View style={{ margin: 10 }}>
            <Text>{`${eventTypeText}, ${!!metadataObj.doctor ? metadataObj.doctor + ',' : ''} ${time} `}</Text>
            <View
              style={{
                marginVertical: 5,
                borderBottomColor: 'black',
                borderBottomWidth: 1,
              }}
            />
            {display}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.main}>
      {Header({ action: () => props.navigation.navigate('PatientView', { language: language, patient: patient }), language, setLanguage })}
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

export default SnapshotList;