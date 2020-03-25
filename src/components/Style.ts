import { StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Platform } from 'react-native';
export default StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginInputsContainer: {
    padding: 10,
    width: '90%',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    height: 140,
    marginTop: 30,
    marginBottom: 30,
    justifyContent: 'center',
  },
  loginInputs: {
    margin: 10,
    padding: 10,
    height: 40,
    borderRadius: 12,
    borderColor: '#EAEAEA',
    borderWidth: .5,
  },
  logo: {
    width: 110,
    height: 140,
    resizeMode: 'stretch'
  },
  container: {
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    paddingBottom: 20,
    justifyContent: 'space-between',
    flex: 1,
  },
  inputsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    // maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  inputs: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    padding: 10,
    height: 40,
    borderRadius: 12,
    borderColor: '#EAEAEA',
    borderWidth: .5,
    width: '100%',
    flex: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    margin: 10,
    color: '#FFFFFF'
  },
  main: {
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    flex: 1
  },
  listContainer: {
    flexDirection: 'column',
    flex: 1,
    alignContent: 'flex-start'
  },
  viewContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  newVisit: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  scroll: {
    flex: 1,
    height: 0
  },
  searchInput: {
    color: '#FFFFFF',
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
  actionButton: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 5,
    height: 100,
    borderRadius: 12,
    borderColor: '#EAEAEA',
    borderWidth: .5,
    width: '100%',
    flex: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionText: {
    textAlign: 'center'
  },
  actionIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  button: {
    margin: 10,
    paddingHorizontal: 20,
    height: 40,
    color: '#31BBF3',
    borderColor: '#31BBF3',
    borderWidth: 2,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBar: {
    marginTop: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    textAlign: 'center',
    height: 50,
  },
  buttonBar: {
    marginTop: 10,
    marginHorizontal: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    textAlign: 'center',
    height: 50,
  },
  gridContainer: {
    flexDirection: 'row',
  },
  gridItem: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridItemText: {
    fontSize: 20,
  },
  gridItemLabel: {
    fontSize: 15,
    fontWeight: 'bold'
  },

  cardContent: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  paragraph: {
    marginHorizontal: 20,
    lineHeight: 20
  },
  title: {
    marginHorizontal: 20,
    marginTop: 20
  },
  outerRadioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5
  },
  selectedRadioButton: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: 'green',
  },
  datePicker: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 12,
    borderColor: '#EAEAEA',
    borderWidth: .5,
    width: '100%',
    flex: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    bottom: -25.5,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 51,
    borderLeftColor: '#FFFFFF',
    borderRightWidth: 51,
    borderRightColor: '#FFFFFF',
    borderTopWidth: 25.5,
    borderTopColor: 'transparent',
  },
  hexagonBefore: {
    position: 'absolute',
    top: -25.5,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 51,
    borderLeftColor: '#FFFFFF',
    borderRightWidth: 51,
    borderRightColor: '#FFFFFF',
    borderBottomWidth: 25.5,
    borderBottomColor: 'transparent'
  }

});