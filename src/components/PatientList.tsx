import React, { Component, useState, useEffect } from "react";
import { View, Text, Image, TextInput, FlatList, StyleSheet, TouchableOpacity, ImageBackground, ImageBackgroundBase } from "react-native";
import { User } from "../types/User";
import { database } from "../database/Database";
import DatabaseSync from "../database/Sync";

const PatientList = (props) => {
  const databaseSync: DatabaseSync = new DatabaseSync();

  const email = props.navigation.state.params.email
  const password = props.navigation.state.params.password
  const [search, setSearch] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    database.getPatients().then(patients => {
      setList(patients)
    })
  }, [props.navigation.state.params.newPatient])

  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <ImageBackground source={require('../images/palm-icon.jpg')} style={{ width: 100, height: 105, justifyContent: 'center' }}>
          <View style={styles.hexagon}>
            <View style={styles.hexagonInner} />
            <View style={styles.hexagonBefore} />
            <View style={styles.hexagonAfter} />
          </View>
        </ImageBackground>

        <View>
          <Text>{`${item.given_name.content['en']} ${item.surname.content['en']}`}</Text>
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
      </View>

    </View>
  )

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholderTextColor='#FFFFFF'
            placeholder="Patients"
            onChangeText={(text) => setSearch(text)}
            value={search}
          />
          <Image source={require('../images/search.jpg')} style={{ width: 30, height: 30 }} />
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.text}>{`Welcome Back, ${email}`}</Text>

          <TouchableOpacity onPress={() => props.navigation.navigate('NewPatient')}>
            <Image source={require('../images/add.png')} style={{ width: 25, height: 25 }} />

          </TouchableOpacity>
          <TouchableOpacity onPress={() => databaseSync.performSync(email, password)}>
            <Image source={require('../images/sync.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>
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

const styles = StyleSheet.create(
  {
    main: {
      flex: 1
    },
    container: {
      backgroundColor: '#31BBF3',
      flexDirection: 'column',
      flex: 1,
      alignContent: "flex-start"
    },
    scroll: {
      flex: 1,
      height: 0
    },
    text: {
      margin: 10,
      color: '#FFFFFF'
    },
    searchInput: {
      padding: 10,
      fontSize: 30,
    },
    card: {
      margin: 10,
      height: 130,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderColor: '#EAEAEA',
      borderWidth: .5,
      borderRadius: 12,
      backgroundColor: '#FFFFFF'
    },
    searchBar: {
      marginTop: 10,
      marginHorizontal: 10,
      justifyContent: 'space-between',
      flexDirection: 'row',
      textAlign: 'center',
      height: 50,
    },
    cardContent: {
      marginTop: 10,
      marginHorizontal: 10,
      flexDirection: 'row',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'space-around'
    },
    hexagon: {
      width: 100,
      height: 55
    },
    hexagonInner: {
      width: 100,
      height: 55,
      backgroundColor: 'transparent'
    },
    hexagonAfter: {
      position: 'absolute',
      bottom: -25.5,
      left: 0,
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderLeftWidth: 51,
      borderLeftColor: '#FFFFFF',
      borderRightWidth: 51,
      borderRightColor: '#FFFFFF',
      borderTopWidth: 25.5,
      borderTopColor: 'transparent',
    },
    hexagonBefore: {
      position: 'absolute',
      top: -25.5,
      left: 0,
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderLeftWidth: 51,
      borderLeftColor: '#FFFFFF',
      borderRightWidth: 51,
      borderRightColor: '#FFFFFF',
      borderBottomWidth: 25.5,
      borderBottomColor: 'transparent'
    }
  }
);

export default PatientList;