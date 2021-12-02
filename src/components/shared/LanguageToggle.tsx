import React from 'react';
import { Picker } from 'react-native';
import styles from '../Style';

const LanguageToggle = (props) => {
  return (
    <Picker
      selectedValue={props.language}
      onValueChange={value => props.setLanguage(value)}
      style={styles.picker}
    >
      <Picker.Item value='en' label='en' />
      <Picker.Item value='ar' label='ar' />
    </Picker>
  )
}

export default LanguageToggle;