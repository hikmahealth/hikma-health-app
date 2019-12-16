import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import Login from '../components/Login';
import PatientList from '../components/PatientList';
import NewPatient from '../components/NewPatient'

const rootNavigator = createStackNavigator(
  {
    Home: {
      screen: Login,
      navigationOptions: () => ({
        title: `Login`,
        header: null,
      })
    },
    PatientList: {
      screen: PatientList,
      navigationOptions: () => ({
        title: `PatientList`,
        header: null,

      })
    },
    NewPatient: {
      screen: NewPatient,
      navigationOptions: () => ({
        title: `NewPatient`,
        header: null,
      })
    }

  },
  {
    initialRouteName: 'Home'
  });

export default createAppContainer(rootNavigator);