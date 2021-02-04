import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button } from 'react-native';

import axios from 'axios';

export interface Props {
  navigation: any;
}

interface State {
  username: string;
  password: string;
}


export default class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }

  onLogin() {
    const { username, password } = this.state;

    Alert.alert('Credentials', `${username} + ${password}`);
  }

  onNext() {
    this.props.navigation.navigate('LoggedHome')
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

        <Button
          title={'Login'}
          onPress={this.onLogin.bind(this)}
        />
        <View
          style={styles.nextView}>
          <Button
            title={'Next'}
            onPress={this.onNext.bind(this)}
          />
        </View>

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
  nextView: {
    position: 'absolute',
    right: 30,
    bottom: 30,
  }
});