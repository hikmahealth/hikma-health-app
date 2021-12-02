import React from 'react';
import {
  View, Text, Image, TouchableOpacity
} from 'react-native';
import styles from '../Style';
import { LocalizedStrings } from '../../enums/LocalizedStrings';
import LanguageToggle from './LanguageToggle';

const Header = (props) => {
  return (
    <View style={[styles.searchBar, { display: 'flex' }]}>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1, display: 'flex' }}>
        <View style={[styles.card]}>
          <TouchableOpacity onPress={() => props.action()}>
            <Text>{LocalizedStrings[props.language].back}</Text>
          </TouchableOpacity>
        </View>

      </View>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', display: 'flex' }}>
        <Image source={require('../../images/logo_no_text.png')} style={{ width: 60, height: 60, }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1, display: 'flex', alignItems: 'center' }}>
        {LanguageToggle({language: props.language, setLanguage: props.setLanguage})}
      </View>
    </View>
  )

}
export default Header