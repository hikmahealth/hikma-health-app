import React, { Component, useState, useEffect } from "react";
import { View, Text, Image, TextInput, FlatList, StyleSheet, TouchableOpacity, ImageBackground, ImageBackgroundBase, ImageSourcePropType } from "react-native";
import { database } from "../database/Database";
import { DatabaseSync } from "../database/Sync";
import styles from './Style';
import { iconHash } from '../services/hash'
import LinearGradient from 'react-native-linear-gradient';

const PatientList = (props) => {
  const databaseSync: DatabaseSync = new DatabaseSync();

  const email = props.navigation.state.params.email;
  const password = props.navigation.state.params.password;
  const clinicId = props.navigation.state.params.clinicId;
  const userId = props.navigation.state.params.userId;
  const [query, setQuery] = useState('');
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))

  useEffect(() => {
    database.getPatients().then(patients => {
      setList(patients);
      setFilteredList(patients);
      setQuery('');
    })
  }, [props.navigation.state.params.reloadPatientsToggle, language])

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase();
    const newList = list
      .filter((patient) =>
        ((!!patient.given_name.content[language] && patient.given_name.content[language].toLowerCase().includes(lowerCaseQuery))
          || (!!patient.surname.content[language] && patient.surname.content[language].toLowerCase().includes(lowerCaseQuery)))
      );

    setFilteredList(newList);
  }, [query]);

  const keyExtractor = (item, index) => index.toString()

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

  const displayName = (item) => {
    if (!!item.given_name.content[language] && !!item.surname.content[language]) {
      return <Text>{`${item.given_name.content[language]} ${item.surname.content[language]}`}</Text>
    } else {
      item.given_name.content[Object.keys(item.given_name.content)[0]]
      return <Text>{`${item.given_name.content[Object.keys(item.given_name.content)[0]]} ${item.surname.content[Object.keys(item.surname.content)[0]]}`}</Text>
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={() => props.navigation.navigate('PatientView',
        {
          language: language,
          patient: item,
          reloadPatientsToggle: props.navigation.state.params.reloadPatientsToggle,
          clinicId: clinicId,
          userId: userId
        }
      )}>
        <ImageBackground source={{ uri: iconHash(item.id) }} style={{ width: 100, height: 105, justifyContent: 'center' }}>
          {/* <View style={styles.hexagon}>
            <View style={styles.hexagonInner} />
            <View style={styles.hexagonBefore} />
            <View style={styles.hexagonAfter} />
          </View> */}
        </ImageBackground>

        <View>
          {displayName(item)}
          <View
            style={{
              marginVertical: 5,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          <Text>{`Date of birth:  ${item.date_of_birth}`}</Text>
          <Text>{`Sex:  ${item.sex}`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.main}>
      <View style={styles.listContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholderTextColor='#FFFFFF'
            placeholder="Patients"
            onChangeText={(text) => setQuery(text)}
            value={query}
          />
          <Image source={require('../images/search.jpg')} style={{ width: 30, height: 30 }} />
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.text}>{`Welcome Back, ${email}`}</Text>

          {LanguageToggle()}

          <TouchableOpacity onPress={() => props.navigation.navigate('NewPatient',
            {
              reloadPatientsToggle: props.navigation.state.params.reloadPatientsToggle,
              language: language
            })
          }>
            <Image source={require('../images/add.png')} style={{ width: 25, height: 25 }} />

          </TouchableOpacity>
          <TouchableOpacity onPress={async () => await databaseSync.performSync(email, password)}>
            <Image source={require('../images/sync.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.scroll}>
          <FlatList
            keyExtractor={keyExtractor}
            data={filteredList}
            renderItem={(item) => renderItem(item)}
          />
        </View>

      </View>
    </LinearGradient>
  )

}

export default PatientList;