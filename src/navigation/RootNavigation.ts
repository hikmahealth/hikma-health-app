import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import Login from '../components/Login';
import PatientList from '../components/PatientList';
import NewPatient from '../components/NewPatient';
import PatientView from '../components/PatientView';
import NewVisit from '../components/NewVisit';
import EditPatient from '../components/EditPatient';
import OpenTextEvent from '../components/OpenTextEvent';
import Vitals from '../components/Vitals';
import VisitList from '../components/VisitList';
import EventList from '../components/EventList';

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
    },
    PatientView: {
      screen: PatientView,
      navigationOptions: () => ({
        title: `PatientView`,
        header: null,
      })
    },
    EditPatient: {
      screen: EditPatient,
      navigationOptions: () => ({
        title: `EditPatient`,
        header: null,
      })
    },
    NewVisit: {
      screen: NewVisit,
      navigationOptions: () => ({
        title: `NewVisit`,
        header: null,
      })
    },
    OpenTextEvent: {
      screen: OpenTextEvent,
      navigationOptions: () => ({
        title: `OpenTextEvent`,
        header: null
      })
    },
    Vitals: {
      screen: Vitals,
      navigationOptions: () => ({
        title: `Vitals`,
        header: null
      })
    },
    VisitList: {
      screen: VisitList,
      navigationOptions: () => ({
        title: `VisitList`,
        header: null
      })
    },
    EventList: {
      screen: EventList,
      navigationOptions: () => ({
        title: `EventList`,
        header: null
      })
    }
  },
  {
    initialRouteName: 'Home'
  });

export default createAppContainer(rootNavigator);