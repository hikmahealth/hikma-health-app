import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Picker, Image } from "react-native";
import { database } from "../storage/Database";
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings'
import { EventTypes } from "../enums/EventTypes";
import { Event } from "../types/Event";
import { Covid19Display } from "./Covid19Form";

const EventList = (props) => {
  const visit = props.navigation.getParam('visit');
  const patient = props.navigation.getParam('patient');

  const [list, setList] = useState(props.navigation.getParam('events', []));
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'));

  useEffect(() => {
    database.getEvents(visit.id).then(events => {
      const filteredEvents = events.filter(event => {
        return !!event.event_metadata;
      })
      setList(filteredEvents);
    })
  }, [props, language])

  useEffect(() => {
    if (language !== props.navigation.getParam('language')) {
      setLanguage(props.navigation.getParam('language'));
    }
  }, [props])

  const keyExtractor = (item, index) => index.toString()

  const editEvent = (event: Event) => {
    switch (event.event_type) {
      case EventTypes.Covid19Screening:
        break
      case EventTypes.Vitals:
        props.navigation.navigate('EditVitals', { event, language })
        break
      default:
        props.navigation.navigate('EditOpenTextEvent', { event, language })

    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onLongPress={() => editEvent(item)}>
      <View style={styles.cardContent} >
        <View style={{ margin: 10 }}>
          <Text>{`${LocalizedStrings[language].eventType}: ${item.event_type}`}</Text>
          <View
            style={{
              marginVertical: 5,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          {renderMetadata(item.event_type, item.event_metadata)}
        </View>
      </View>
    </TouchableOpacity>
  )

  const parseMetadata = (metadata: string) => {
    try {
      JSON.parse(metadata);
    } catch (e) {
      return metadata;
    }
    return JSON.parse(metadata);
  }

  const renderMetadata = (type: EventTypes, metadata: string) => {
    const metadataObj = parseMetadata(metadata)

    switch (type) {
      case EventTypes.Covid19Screening:
        return Covid19Display(metadataObj, language)
      case EventTypes.Vitals:
        return (
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
            <Text style={{ width: '50%' }}>HR: {metadataObj.heartRate} BPM</Text>
            <Text style={{ width: '50%' }}>BP: {metadataObj.systolic}/{metadataObj.diastolic}</Text>
            <Text style={{ width: '50%' }}>Sats: {metadataObj.sats}%</Text>
            <Text style={{ width: '50%' }}>Temp: {metadataObj.temp} °C</Text>
            <Text style={{ width: '50%' }}>RR: {metadataObj.respiratoryRate}</Text>
            <Text style={{ width: '50%' }}>BG: {metadataObj.bloodGlucose}</Text>
          </View>)
      default:
        return (<Text>{metadataObj}</Text>)
    }
  }

  const LanguageToggle = () => {
    return (
      <Picker
        selectedValue={language}
        onValueChange={value => setLanguage(value)}
        style={styles.picker}
      >
        <Picker.Item value='en' label='en' />
        <Picker.Item value='ar' label='ar' />
        <Picker.Item value='sp' label='sp' />
      </Picker>
    )
  }

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.main}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => props.navigation.navigate('VisitList', { language: language, patient: patient })}>
          <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
        </TouchableOpacity>
        {LanguageToggle()}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={styles.text}>{visit.check_in_timestamp.split('T')[0]}</Text>
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
      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('NewVisit',
              {
                language: language,
                patient: patient,
                visitId: visit.id,
                existingVisit: true
              }
            )
          }}>
          <Image source={require('../images/newVisit.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )

}

export default EventList;