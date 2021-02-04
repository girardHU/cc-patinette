import React from 'react';
import { StyleSheet, Switch, View, TextInput, Text, Alert, Button } from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Props {
  navigation: any;
}

interface State {
  username: string;
  password: string;
  isrefiller: boolean;
}


export default class Register extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isrefiller: false
    };
  }

  async storeData(storageKey: string, value: string) {
    try {
      await AsyncStorage.setItem(`@${storageKey}`, value)
      console.log(`stored ${storageKey} with value ${value}`)
    } catch (e) {
      // saving error
      console.log('error in Register LocalStorage storeData :')
      console.log(e)
    }
  }


  async onRegister() {
    const { username, password, isrefiller } = this.state;

    Alert.alert('Input', `username: ${username},  pwd: ${password}, isrefiller: ${isrefiller}`);

    axios.post('http://192.168.1.140:5000/user', {
      username: username,
      password: password,
      isrefiller: isrefiller
    })
      .then(responseuser => {
        // console.log(response)
        axios.post('http://192.168.1.140:5000/login', {
          username: username,
          password: password
        })
          .then(responsetoken => {
            // console.log(responseuser.data.data.id)
            // console.log(responsetoken.data.data.code)
            // this.storeData(response.data)
            this.storeData('id', JSON.stringify(responseuser.data.data.id))
            this.storeData('username', JSON.stringify(username))
            this.storeData('token', responsetoken.data.data.code)
            this.storeData('isrefiller', JSON.stringify(isrefiller))
            this.props.navigation.navigate('LoggedHome')
            return true;
          })
          .catch(error => {
            console.log(error);
            return false;
          })
      })
      .catch(error => {
        console.log(error);
        return false;
      })
  }

  toggleSwitch() {
    this.setState({
      isrefiller: !this.state.isrefiller
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
        <View
          style={styles.refillerView}>
          <Text
            style={styles.refillerText}>
            Want to be a Patrouiller ?
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={this.state.isrefiller ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={this.toggleSwitch.bind(this)}
            value={this.state.isrefiller}
          />
        </View>

        <Button
          title={'Register'}
          onPress={this.onRegister.bind(this)}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  greeting: {
    color: '#999',
    fontWeight: 'bold'
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  refillerView: {
    flexDirection: 'row'
  },
  refillerText: {
    marginEnd: 10
  }
});