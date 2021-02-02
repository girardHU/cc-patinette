import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


export interface Props {
  navigation: any
}

interface State {

}

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (

      // <View style={styles.container}>
      <LinearGradient
        start={[0.5, 0]}
        // end={[1, 0]}
        style={styles.container}
        colors={['#2065EE', '#fff']}>
        <Text style={styles.title}>Patro by Patinette !</Text>
        <View
          style={styles.buttons}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}>
            <LinearGradient start={[0, 0.5]}
              end={[1, 0.5]}
              colors={['#EFBB35', '#4AAE9B']}
              style={styles.loginButton}>
              <View style={styles.circleGradient}>
                <Text
                  style={styles.loginText}>Login</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Register')}>
            <LinearGradient start={[0, 0.5]}
              end={[1, 0.5]}
              colors={['#EFBB35', '#4AAE9B']}
              style={styles.registerButton}>
              <View style={styles.circleGradient}>
                <Text
                  style={styles.loginText}>Register</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      // </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    bottom: 200,
    fontSize: 42,
    color: '#fff'
  },
  buttons: {
    top: 100
  },
  loginButton: {
    borderRadius: 25,
    marginVertical: 10
  },
  registerButton: {
    borderRadius: 25,
    marginVertical: 10
  },
  // login: {
  //   marginRight:40,
  //   marginLeft:40,
  //   marginTop:10,
  //   paddingTop:20,
  //   paddingBottom:20,
  //   backgroundColor:'#68a0cf',
  //   borderRadius:35,
  //   borderWidth: 1,
  //   width: 280,
  //   height: 60,
  //   borderColor: '#fff'
  // },
  loginText: {
    color: '#000',
    fontSize: 24,
    textAlign: 'center'
  },
  circleGradient: {
    width: 280,
    height: 40,
    margin: 1,
    backgroundColor: "white",
    borderRadius: 25
  }
});