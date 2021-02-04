import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableHighlight } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import Clock from '../Clock';

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const vehicleId = 1;
    startRun(vehicleId);
    alert(`${data}`);
  };

  const startRun = (vehicleId: number) => {

  };

  let timerStart = false;
  let stopwatchStart = false;
  let totalDuration = 90000;
  let timerReset = false;
  let stopwatchReset = false;
  let currentTime = 0;


  const toggleStopwatch = () => {
    stopwatchStart = !stopwatchStart;
    stopwatchReset = false;
  }

  const resetStopwatch = () => {
    stopwatchStart = false;
    stopwatchReset = true;
  }

  const getFormattedTime = (time: number) => {
    currentTime = time;
  };

  const options = {
    container: {
      backgroundColor: '#000',
      padding: 5,
      borderRadius: 5,
      width: 220,
    },
    text: {
      fontSize: 30,
      color: '#FFF',
      marginLeft: 7,
    }
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      <Clock />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  barCodeView: {
    width: '100%',
    height: '50%',
    marginBottom: 40
  },
});