import React from 'react';
import { StyleSheet, Text, TextInput, View, Switch, Button } from 'react-native';

export interface Props {

}

interface State {
  username: string;
  newUsername: string;
  isRefiller: boolean;
  newIsRefiller: boolean;
  haveChanged: boolean;
}

export default class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: 'Barnabas',
      newUsername: 'Barnabas',
      isRefiller: true,
      newIsRefiller: true,
      haveChanged: false
    };
  }

  changeData() {
    this.setState({
      username: this.state.newUsername,
      isRefiller: this.state.newIsRefiller,
      haveChanged: false
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