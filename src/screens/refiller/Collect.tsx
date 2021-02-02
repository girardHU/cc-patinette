import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface Props {

}

interface State {
}

export default class Collect extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
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
  }
});