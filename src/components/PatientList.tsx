import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image as Image, TextInput, FlatList, TouchableOpacity, ImageBackground, Keyboard, Picker, Modal, TouchableHighlight, Button } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { database } from "../storage/Database";
import { DatabaseSync } from "../storage/Sync";
import { ImageSync } from '../storage/ImageSync';
import styles from './Style';
import { iconHash } from '../services/hash'
import { LocalizedStrings } from '../enums/LocalizedStrings';
import { icons } from '../enums/Icons';

const PatientList = (props) => {
  const databaseSync: DatabaseSync = new DatabaseSync();
  const imageSync: ImageSync = new ImageSync();
  const email = props.navigation.state.params.email;
  const password = props.navigation.state.params.password;
  const clinicId = props.navigation.state.params.clinicId;
  const instanceUrl = props.navigation.state.params.instanceUrl;
  const [userId, setUserId] = useState(props.navigation.state.params.userId);
  const [list, setList] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [givenName, setGivenName] = useState('');
  const [surname, setSurname] = useState('');
  const [country, setCountry] = useState('');
  const [hometown, setHometown] = useState('');
  const [camp, setCamp] = useState('');
  const [phone, setPhone] = useState('');
  const [minAge, setMinAge] = useState<number>(0);
  const [maxAge, setMaxAge] = useState<number>(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'));
  const [searchIconFunction, setSearchIconFunction] = useState(false)
  const search = useRef(null);

  useEffect(() => {
    searchPatients()
  }, [props.navigation.state.params.reloadPatientsToggle, language])

  useEffect(() => {
    if (!!props.navigation.getParam('imagesSynced')) {
      props.navigation.state.params.imagesSynced.then(() => {
        reloadPatients()
      })
    }

    if (!!props.navigation.getParam('language') && language !== props.navigation.getParam('language')) {
      setLanguage(props.navigation.getParam('language'));
    }
  }, [props])

  const keyExtractor = (item, index) => index.toString()

  const reloadPatients = () => {
    database.getPatients().then(patients => {
      setList(patients);
      setGivenName('');
      setSurname('');
      setCountry('');
      setHometown('');
      setCamp('');
      setPhone('');
      setMinAge(0);
      setMaxAge(0);
    })
    database.getPatientCount().then(number => setPatientCount(number))
  }

  const searchPatients = () => {
    const currentYear = new Date().getFullYear()
    if (givenName.length > 0 || surname.length > 0 || country.length > 0 || hometown.length > 0 || maxAge > 0 || camp.length > 0 || phone.length > 0) {
      const givenNameLC = givenName.toLowerCase();
      const surnameLC = surname.toLowerCase();
      const countryLC = country.toLowerCase();
      const hometownLC = hometown.toLowerCase();
      const campLC = camp.toLowerCase();
      const phoneLC = phone.toLowerCase();
      const minYear = (maxAge > 0 && maxAge >= minAge) ? currentYear - maxAge : null;
      const maxYear = (maxAge > 0 && maxAge >= minAge) ? currentYear - minAge : null;

      database.searchPatients(givenNameLC, surnameLC, countryLC, hometownLC, campLC, phoneLC, minYear, maxYear).then(patients => {
        setList(patients);
      })
    } else {
      reloadPatients()
    }
    setSearchIconFunction(false)
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
      </Picker>
    )
  }

  const agePicker = () => {
    let ages = []
    let i = 0;
    for (i; i < 110; i++) {
      ages.push(<Picker.Item key={i} value={i} label={i.toString()} />)
    }
    return ages;
  }

  const logout = () => {
    setUserId('')
    props.navigation.navigate('Home', { logout: true })
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
    <TouchableOpacity style={styles.card} onPress={() => props.navigation.navigate('PatientView',
      {
        language: language,
        patient: item,
        reloadPatientsToggle: props.navigation.state.params.reloadPatientsToggle,
        clinicId: clinicId,
        userId: userId
      }
    )}>
      <View style={styles.cardContent}>
        {!!item.image_timestamp ?
          <ImageBackground source={{ uri: `${imageSync.imgURI(item.id)}/${item.image_timestamp}.jpg` }} style={{ width: 100, height: 100, justifyContent: 'center' }}>
            <View style={styles.hexagon}>
              <View style={styles.hexagonBefore} />
              <View style={styles.hexagonAfter} />
            </View>
          </ImageBackground> :
          <Image source={icons[iconHash(item.id)]} style={{ width: 100, height: 100, justifyContent: 'center' }} />}
        <View style={{ flexShrink: 1, marginLeft: 20 }}>
          {displayName(item)}
          <View
            style={{
              marginVertical: 5,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          <Text style={{ flexWrap: 'wrap' }}>{`${LocalizedStrings[language].dob}:  ${item.date_of_birth}`}</Text>
          <Text>{`${LocalizedStrings[language].sex}:  ${item.sex}`}</Text>
          <Text>{`${LocalizedStrings[language].camp}:  ${item.camp}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.main}>
      <View style={styles.listContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholderTextColor='#FFFFFF'
            placeholder={LocalizedStrings[language].patientSearch}
            onChangeText={(text) => setGivenName(text)}
            onEndEditing={searchPatients}
            onFocus={() => setSearchIconFunction(true)}
            value={givenName}
            ref={search}
          />
          <TouchableOpacity onPress={() => {
            if (searchIconFunction) {
              searchPatients()
              Keyboard.dismiss()
            } else {
              search.current.focus()
              setSearchIconFunction(true)
            }
          }}>
            <Image source={require('../images/search.jpg')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBar, { marginTop: 0, justifyContent: 'space-around' }]}>
          <Text style={styles.text}>{patientCount} {LocalizedStrings[language].patients}</Text>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].advancedFilters}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reloadPatients()}>
            <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].clearFilters}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.searchBar, { marginTop: 0, justifyContent: 'center' }]}>
          {LanguageToggle()}
          <TouchableOpacity onPress={async () => {
            await databaseSync.performSync(instanceUrl, email, password, language)
            await imageSync.syncPhotos(instanceUrl, email, password)
            reloadPatients()
          }}
            style={{ marginLeft: 50, marginRight: 100 }}>
            <Image source={require('../images/sync.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => logout()}>
            <Image source={require('../images/logout.png')} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.scroll}>
          <FlatList
            keyExtractor={keyExtractor}
            data={list}
            renderItem={(item) => renderItem(item)}
          />
        </View>

        <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
          <TouchableOpacity onPress={() => props.navigation.navigate('NewPatient',
            {
              reloadPatientsToggle: props.navigation.state.params.reloadPatientsToggle,
              language: language
            }
          )}>
            <Image source={require('../images/newVisit.png')} style={{ width: 75, height: 75 }} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.leftView}>
          <View style={[styles.modalView, { alignItems: 'stretch', justifyContent: 'space-between', flex: 1 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>

              <TouchableHighlight
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setSearchIconFunction(true)
                }}
              >
                <Image source={require('../images/close.png')} style={{ width: 15, height: 15 }} />
              </TouchableHighlight>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                placeholder={LocalizedStrings[language].firstName}
                onChangeText={(text) => setGivenName(text)}
                value={givenName}
              />
              <TextInput
                placeholder={LocalizedStrings[language].surname}
                onChangeText={(text) => setSurname(text)}
                value={surname}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                placeholder={LocalizedStrings[language].country}
                onChangeText={(text) => setCountry(text)}
                value={country}
              />
              <TextInput
                placeholder={LocalizedStrings[language].hometown}
                onChangeText={(text) => setHometown(text)}
                value={hometown}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                placeholder={LocalizedStrings[language].camp}
                onChangeText={(text) => setCamp(text)}
                value={camp}
              />
              <TextInput
                placeholder={LocalizedStrings[language].phone}
                onChangeText={(text) => setPhone(text)}
                value={phone}
              />
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={{ paddingTop: 15, paddingRight: 5 }}>{LocalizedStrings[language].minAge}</Text>
              <Picker
                selectedValue={minAge}
                onValueChange={value => setMinAge(value)}
                style={{
                  height: 50,
                  width: 90
                }}
              >
                {agePicker()}
              </Picker>
              <Text style={{ paddingTop: 15, paddingRight: 5, paddingLeft: 5 }}>{LocalizedStrings[language].maxAge}</Text>
              <Picker
                selectedValue={maxAge}
                onValueChange={value => setMaxAge(value)}
                style={{
                  height: 50,
                  width: 90
                }}
              >
                {agePicker()}
              </Picker>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                title={LocalizedStrings[language].clearFilters}
                color={'red'}
                onPress={() => {
                  reloadPatients()
                }}
              >
              </Button>
              <Button
                title={LocalizedStrings[language].search}
                onPress={() => {
                  Keyboard.dismiss()
                  setModalVisible(!modalVisible);
                  searchPatients()
                }}>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  )
}

export default PatientList;