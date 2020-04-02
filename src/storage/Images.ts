import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const dirHome = Platform.select({
  ios: `${RNFS.LibraryDirectoryPath}/pictures`,
  android: `${RNFS.DocumentDirectoryPath}/../pictures`
});

export const dirPictures = `${dirHome}`;