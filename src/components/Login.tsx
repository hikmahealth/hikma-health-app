import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, Picker, Modal
} from 'react-native';

import { database } from "../storage/Database";
import { StringContent } from '../types/StringContent';
import { NewUser } from '../types/User';
import LinearGradient from 'react-native-linear-gradient';
import { DatabaseSync } from '../storage/Sync'
import { ImageSync } from '../storage/ImageSync'
import { Clinic } from '../types/Clinic';
import styles from './Style';

const Login = (props) => {
  const databaseSync = new DatabaseSync();
  const imageSync = new ImageSync();
  const [email, setEmail] = useState('demo@hikmahealth.org');
  const [password, setPassword] = useState('HikmaHealth');
  const [instanceList, setInstanceList] = useState([]);
  const [selectedInstance, setSelectedInstance] = useState();
  const [showInstanceDropdown, setShowInstanceDropdown] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  let userId = '';
  let clinicId = '';
  let instanceUrl = '';

  useEffect(() => {
    database.usersExist().then(result => {
      if (!result) {
        getInstances().then(response => {
          setInstanceList(response)
        })
        setShowInstanceDropdown(true)
      } else {
        setShowInstanceDropdown(false)
      }
      database.close()
    })
  }, [props])

  const getInstances = async (): Promise<any> => {
    return fetch('https://demo-api.hikmahealth.org/api/instances', {
      method: 'GET',
    }).then(response => {
      return response.json()
    })
  }

  const remoteLogin = async (): Promise<any> => {
    const response = await fetch(`${selectedInstance.url}/api/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "password": password,
      })
    });
    return await response.json();
  }

  const handleLogin = async () => {

    const user = await database.login(email, password)

    if (user === null || user === undefined) {
      console.log("email: " + email)
      console.log("password: " + password)

      if (selectedInstance === null || selectedInstance === undefined) {
        setLoginFailed(true);
        setErrorMsg('Incorrect credentials');
        return;
      }

      const responseJson = await remoteLogin();

      console.log('response' + responseJson)

      if (!!responseJson.message) {
        setLoginFailed(true);
        setErrorMsg(responseJson.message);
        return;
      }

      const contentArray = Object.keys(responseJson.name.content)
      const stringContentArray: StringContent[] = []

      contentArray.forEach(element => {
        stringContentArray.push({
          language: element,
          content: responseJson.name.content[element]
        })
      })

      const nameId = await database.saveStringContent(stringContentArray, responseJson.name.id)

      const newUser: NewUser = {
        id: responseJson.id,
        name: nameId,
        role: responseJson.role,
        email: responseJson.email,
        instance_url: selectedInstance.url
      }
      userId = responseJson.id.replace(/-/g, "");
      instanceUrl = selectedInstance.url
      await database.addUser(newUser, password)
    } else {
      userId = user.id
      instanceUrl = user.instance_url
    }

    let imagesSynced;
    const clinics: Clinic[] = await database.getClinics();
    if (clinics.length == 0) {
      setModalVisible(true)
      await databaseSync.performSync(instanceUrl, email, password)
      imagesSynced = imageSync.syncPhotos(instanceUrl, email, password)
      const clinicsResponse: Clinic[] = await database.getClinics()
      setModalVisible(false)
      clinicId = clinicsResponse[0].id
    } else {
      clinicId = clinics[0].id
    }
    props.navigation.navigate('PatientList', {
      email: email,
      password: password,
      reloadPatientsToggle: false,
      clinicId: clinicId,
      userId: userId,
      instanceUrl,
      imagesSynced
    })

  };

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.loginContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Initial sync in progress - please wait</Text>
          </View>
        </View>
      </Modal>
      <View >
        <Image source={require('../images/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.loginInputsContainer}>
        <TextInput
          style={loginFailed ? styles.loginInputsFailed : styles.loginInputs}
          placeholder="Email"
          onChangeText={(text) => {
            setEmail(text);
            setLoginFailed(false);
          }}
          value={email}
        />
        <TextInput
          style={loginFailed ? styles.loginInputsFailed : styles.loginInputs}
          placeholder="Password"
          onChangeText={(text) => {
            setPassword(text);
            setLoginFailed(false);
          }}
          value={password}
          secureTextEntry={true}
        />
        {loginFailed ? <Text style={{ color: '#FF0000', fontSize: 10, paddingLeft: 10 }}>Login Error: {errorMsg}</Text> : null}
      </View>

      {showInstanceDropdown ? <View style={styles.instanceList}>
        <Picker
          selectedValue={selectedInstance}
          onValueChange={value => setSelectedInstance(value)}
        >
          {instanceList.map((instance, index) => { return <Picker.Item key={index} value={instance} label={instance.name} /> })}
        </Picker>
      </View> : null}

      <View >
        <TouchableOpacity onPress={handleLogin}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
      <Text  style={{paddingTop: 20, paddingHorizontal: 30, color: '#ffffff', textAlign: 'center'}}>
        Hikma Health is an independent 501(c)(3) nonprofit and is not affiliated with Hikma Pharmaceuticals PLC or any of its affiliates.
      </Text>
    </LinearGradient>
  );
};

export default Login;
