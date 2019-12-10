import React, { Component, useState } from "react";
import { View, Text, Image, TextInput, FlatList, StyleSheet, ActivityIndicator, ImageBackground, ImageBackgroundBase } from "react-native";
import { User } from "../types/User";

const PatientList = (props) => {
  const [loggedInUser, _] = useState(props.navigation.getParam('localUser'));
  const [search, setSearch] = useState('');

  const list = [
    {
      name: 'Amy Farha',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President',
      id: '12345',
      last_visit: '12/12/1234'
    },
    {
      name: 'Chris Jackson',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman',
      id: '12345',
      last_visit: '12/12/1234'
    },
    // more items
  ]

  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <ImageBackground source={{ uri: item.avatar_url }} style={{ width: 100, height: 105, justifyContent: 'center' }}>
          <View style={styles.hexagon}>
            <View style={styles.hexagonInner} />
            <View style={styles.hexagonBefore} />
            <View style={styles.hexagonAfter} />
          </View>
        </ImageBackground>

        <View>
          <Text>{`${item.name}`}</Text>
          <View
            style={{
              marginVertical: 5,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          <Text>{`PATIENT ID:  ${item.id}`}</Text>
          <Text>{`LAST VISIT:  ${item.last_visit}`}</Text>
        </View>
      </View>

    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.viewStack}>
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
      </View>

      <View style={styles.viewStack}>
        <Text style={styles.text}>{'Welcome Back, Dr. Ebrahim'}</Text>
      </View>
      <View style={styles.viewStack}>
        <Text style={styles.text}>{loggedInUser.email}</Text>
      </View>
      <View style={styles.viewStack}>
        <FlatList
          keyExtractor={keyExtractor}
          data={list}
          renderItem={renderItem}
        />
      </View>

    </View>
  )

}

const styles = StyleSheet.create(
  {
    container: {
      backgroundColor: '#31BBF3',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'flex-start'
    },
    viewStack: {
      display: 'flex'
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
      bottom: -25,
      left: 0,
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderLeftWidth: 50,
      borderLeftColor: '#FFFFFF',
      borderRightWidth: 50,
      borderRightColor: '#FFFFFF',
      borderTopWidth: 25,
      borderTopColor: 'transparent',
    },
    hexagonBefore: {
      position: 'absolute',
      top: -25,
      left: 0,
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderLeftWidth: 50,
      borderLeftColor: '#FFFFFF',
      borderRightWidth: 50,
      borderRightColor: '#FFFFFF',
      borderBottomWidth: 25,
      borderBottomColor: 'transparent'
  
    }


  }
);

export default PatientList;