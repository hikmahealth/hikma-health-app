
import { LocalizedStrings } from '../../enums/LocalizedStrings';

export const formatTextDisplay = (field, textField, language) => {
    if (field == null) {
        return null
    }
    if (!!field && !textField) {
        return LocalizedStrings[language].yes
    }
    return field ? textField : LocalizedStrings[language].no
}

export const formatBooleanDisplay = (field, language) => {
    if (field == null) {
        return null
    }
    return field ? LocalizedStrings[language].yes : LocalizedStrings[language].no
  
  }