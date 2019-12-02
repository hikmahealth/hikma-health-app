import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";

class PatientList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      search: ''
    };
  }

  list = [
    {
      name: 'Amy Farha',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President'
    },
    {
      name: 'Chris Jackson',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman'
    },
     // more items
  ]
  
  keyExtractor = (item, index) => index.toString()
  
  renderItem = ({ item }) => (
    <View style={styles.card}>
    <ListItem
      title={item.name}
      subtitle={item.subtitle}
      leftAvatar={{ source: { uri: item.avatar_url } }}
    />
    </View>
  )

  updateSearch = search => {
    this.setState({ search });
  };
  
  render () {
    return (
      <View style={styles.container}>
        <SearchBar
        lightTheme={true}
        style={styles.searchBar}
        placeholder="Patients"
        onChangeText={this.updateSearch}
        value={this.state.search}
      />
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.list}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create(
  {
    container: {
      backgroundColor: '#31BBF3',
    },
    inputsContainer: {
      width: '90%',
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      height: 140,
      marginTop: 30,
      marginBottom: 30,
      justifyContent: 'center',
    },
    inputs: {
      margin: 10,
      padding: 10,
      height: 40,
      borderRadius: 12,
      borderColor: '#EAEAEA',
      borderWidth: .5,
    },
    card: {
      margin: 10,
      padding: 10,
      height: 90,
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
      backgroundColor: 'rgba(52, 52, 52, 0)'
    }


  }
);

export default PatientList;