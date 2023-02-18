import {useEffect, useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
//import {ApolloProvider} from '@apollo/client';

import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
//import {client} from './src/apollo';
import Upload from './src/Upload';

const App = () => {
  const [hasNfc, setHasNFC] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported();

      setHasNFC(deviceIsSupported);
      if (deviceIsSupported) {
        await NfcManager.start();
      }
    };

    checkIsSupported();
  }, []);

  const readTag = async () => {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  };

  const cancelReadTag = async () => {
    await NfcManager.registerTagEvent();
  };

  const writeNdef = async () => {
    let result = false;
    console.warn('write');

    return Ndef.encodeMessage([Ndef.uriRecord('Dziugas')]);
  };

  if (hasNfc === null) return null;

  if (!hasNfc) {
    return (
      <View style={styles.sectionContainer}>
        <Text>NFC not supported</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.sectionContainer}>
      {/* <ApolloProvider client={client}><Upload /></ApolloProvider> */}

      <Text>Hello world</Text>
      <Pressable style={[styles.btn, styles.btnScan]} onPress={readTag}>
        <Text style={{color: 'white'}}>Scan Tag</Text>
      </Pressable>
      <Pressable style={[styles.btn, styles.btnScan]} onPress={writeNdef}>
        <Text style={{color: 'white'}}>Write Tag</Text>
      </Pressable>
      <Pressable style={[styles.btn, styles.btnCancel]} onPress={cancelReadTag}>
        <Text style={{color: 'white'}}>Cancel Scan</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
  },
  btn: {
    padding: 30,
  },
  btnScan: {
    backgroundColor: 'green',
  },
  btnCancel: {
    backgroundColor: 'red',
  },
});

export default App;
