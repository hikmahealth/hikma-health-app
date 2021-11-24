import { StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Platform } from 'react-native';
export default StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#3A539B",
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
  loginInputsFailed: {
    margin: 10,
    padding: 10,
    height: 40,
    borderRadius: 12,
    borderColor: '#FF0000',
    borderWidth: 1,
  },
  instanceList: {
    padding: 10,
    width: '90%',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    height: 40,
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 110,
    height: 140,
    resizeMode: 'stretch'
  },
  container: {
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    paddingBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    backgroundColor: "#3A539B",
  },
  containerLeft: {
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    paddingBottom: 20,
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: "#3A539B",
  },
  inputsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    backgroundColor: "#3A539B",
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    flex: 1,
  },
  listContainer: {
    flexDirection: 'column',
    flex: 1,
    alignContent: 'flex-start'
  },
  viewContainer: {
    backgroundColor: '#ededed',
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
    fontSize: 20,
  },
  card: {
    margin: 10,
    padding: 10,
    height: 'auto',
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
    alignItems: 'center',
    width: '70%'
  },
  profileButton: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    borderColor: '#EAEAEA',
    borderWidth: .5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF'
  },
  searchBar: {
    marginTop: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    height: 50,
  },
  topNav: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: "flex-start",
    width: '100%',
    height: 50,
  },
  buttonBar: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    textAlign: 'center',
    height: 50,
  },
  gridContainer: {
    flex: 1,
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
    fontSize: 18,
    textAlign: 'center',
  },
  gridItemLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardContent: {
    flex: 1,
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
    backgroundColor: '#FFFFFF',
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
  picker: {
    color: '#FFFFFF',
    height: 50,
    width: 90
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  leftView: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    margin: 8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 45,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: 'flex'
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold'
  },
  hexagon: {
    width: 100,
    height: 55
  },
  hexagonAfter: {
    position: 'absolute',
    top: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderBottomWidth: 52,
    borderBottomColor: '#FFFFFF',
    borderRightWidth: 25,
    borderRightColor: 'transparent',
    borderTopWidth: 52,
    borderTopColor: '#FFFFFF',
  },
  hexagonBefore: {
    position: 'absolute',
    top: -25,
    left: 75,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderBottomWidth: 52,
    borderBottomColor: '#FFFFFF',
    borderLeftWidth: 25,
    borderLeftColor: 'transparent',
    borderTopWidth: 52,
    borderTopColor: '#FFFFFF',
  },
  hexagonAfterPatientView: {
    position: 'absolute',
    top: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderBottomWidth: 52,
    borderBottomColor: '#ededed',
    borderRightWidth: 25,
    borderRightColor: 'transparent',
    borderTopWidth: 52,
    borderTopColor: '#ededed',
  },
  hexagonBeforePatientView: {
    position: 'absolute',
    top: -25,
    left: 75,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderBottomWidth: 52,
    borderBottomColor: '#ededed',
    borderLeftWidth: 25,
    borderLeftColor: 'transparent',
    borderTopWidth: 52,
    borderTopColor: '#ededed',
  },
});