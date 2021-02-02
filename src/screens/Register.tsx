import React from 'react';
import { StyleSheet, Switch, View, TextInput, Text, Alert, Button } from 'react-native';

export interface Props {

}

interface State {
  username: string,
  password: string,
  isRefiller: boolean
}


export default class Register extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isRefiller: false
    };
  }

  onRegister() {
    const { username, password } = this.state;

    Alert.alert('Credentials', `${username} + ${password}`);
  }

  toggleSwitch() {
    this.setState({
      isRefiller: !this.state.isRefiller
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
            thumbColor={this.state.isRefiller ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={this.toggleSwitch.bind(this)}
            value={this.state.isRefiller}
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