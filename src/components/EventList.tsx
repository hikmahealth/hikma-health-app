import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { database } from "../storage/Database";
import styles from './Style';
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings'
import { EventTypes } from "../enums/EventTypes";

const EventList = (props) => {
  const visit = props.navigation.getParam('visit');
  const patient = props.navigation.getParam('patient');

  const [list, setList] = useState([]);
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


  const renderItem = ({ item }) => (
    <View style={styles.card}>
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
    </View>
  )

  const renderMetadata = (type: EventTypes, metadata: string) => {
    if (type === EventTypes.Covid19Screening) {
      const metadataObj = JSON.parse(metadata)
      return (<Text>Test/Isolate Patient: {metadataObj.testAndIsolate.toString()}</Text>)
    } else {
      return(<Text>{metadata}</Text>)
    }
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

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.main}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => props.navigation.navigate('VisitList', { language: language, patient: patient })}>
          <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
        </TouchableOpacity>
        {LanguageToggle()}
      </View>
      <View style={styles.buttonBar}>
        <Text style={styles.text}>{LocalizedStrings[language].visitEvents}</Text>
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

export default EventList;