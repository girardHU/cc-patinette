import React from 'react';
import { StyleSheet, Text, TextInput, View, Switch, Button } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export interface Props {

}

interface State {
  username: string;
  newUsername: string;

  isRefiller: boolean;
  newIsRefiller: boolean;

  id: number;
  token: string;

  haveChanged: boolean;
}

export default class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      id: -1,
      token: '',
      username: '',
      newUsername: '',
      isRefiller: false,
      newIsRefiller: false,
      haveChanged: false
    };
  }

  async componentDidMount() {
    await this.getUsername();
    await this.getIsrefiller();
    await this.getId();
    await this.getToken();
    console.log("this.state.isrefiller :", this.state.isRefiller)
  }

  async getUsername() {
    AsyncStorage.getItem(`@username`)
      .then(value => {
        // value previously stored
        if (value !== null) {
          this.setState({
            username: value,
            newUsername: value
          })
        }
      })
      .catch(error => {
        // error reading value
        console.log('error in Profile LocalStorage getUsername :');
        console.log(error);
      });
  }

  async getIsrefiller() {
    AsyncStorage.getItem(`@isrefiller`)
      .then(value => {
        console.log(value)
        // value previously stored
        if (value !== null) {
          this.setState({
            isRefiller: (value == 'true'),
            newIsRefiller: (value == 'true'),
          })
        }
      })
      .catch(error => {
        // error reading value
        console.log('error in Profile LocalStorage getIsrefiller :');
        console.log(error);
      });
  }

  async getId() {
    AsyncStorage.getItem(`@id`)
      .then(value => {
        console.log(value)
        // value previously stored
        if (value !== null) {
          this.setState({
            id: parseInt(value, 10),
          })
        }
      })
      .catch(error => {
        // error reading value
        console.log('error in Profile LocalStorage getId :');
        console.log(error);
      });
  }

  async getToken() {
    AsyncStorage.getItem(`@token`)
      .then(value => {
        console.log(value)
        // value previously stored
        if (value !== null) {
          this.setState({
            token: value,
          })
        }
      })
      .catch(error => {
        // error reading value
        console.log('error in Profile LocalStorage getId :', error);
      });
  }

  changeData() {
    this.setState({
      username: this.state.newUsername,
      isRefiller: this.state.newIsRefiller,
      haveChanged: false
    })
    axios.put(`http://192.168.1.140:5000/user/${this.state.id}`, {
      username: this.state.newUsername,
      isrefiller: this.state.newIsRefiller
    }, {
      headers: {
        'Authorization': this.state.token
      }
    }).then(response => {

    }).catch(error => {
      console.log('error in changeData for put request :', error)
    })
  }

  toggleSwitch() {
    this.setState({
      newIsRefiller: !this.state.newIsRefiller,
      haveChanged: true
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          // onPress={this.changeData.bind(this)}
          // style={styles.usernameText}
          // onSubmitEditing={(nativeEvent) => {
          //   this.setState({ newUsername: nativeEvent.text, haveChanged: true })
          // }}
          onChangeText={(username) => this.setState({ newUsername: username, haveChanged: true })}
          placeholder={this.state.username} />
        <View
          style={styles.refillerView}>
          <Text
            style={styles.refillerText}>
            Want to be a Patrouiller ?
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={this.state.newIsRefiller ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={this.toggleSwitch.bind(this)}
            value={this.state.newIsRefiller}
          />
        </View>
        <Button
          title={'Validate'}
          disabled={!this.state.haveChanged}
          onPress={this.changeData.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    // center div
    justifyContent: 'center'
  },
  usernameText: {
    color: '#999',
    fontWeight: 'bold'
  },
  refillerView: {
    flexDirection: 'row'
  },
  refillerText: {
    marginEnd: 10
  }
});