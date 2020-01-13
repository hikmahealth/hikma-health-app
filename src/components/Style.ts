import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#31BBF3',
  },
  loginInputsContainer: {
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
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: '#31BBF3',
    alignItems: 'center'
  },
  inputsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    maxWidth: '90%',
    flexDirection: 'row',
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
    flex: 1
  },
  listContainer: {
    backgroundColor: '#31BBF3',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 4,
    height: 120,
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
    paddingTop: 20,
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
    justifyContent: 'space-around'
  },
  paragraph: {
    marginHorizontal: 20,
    lineHeight: 20
  },
  title: {
    marginHorizontal: 20,
    marginTop: 20
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