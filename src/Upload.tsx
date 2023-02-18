import {useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';

import {useMutation, gql} from '@apollo/client';

import {launchImageLibrary} from 'react-native-image-picker';

import RNFetchBlob from 'rn-fetch-blob';

import uuid from 'react-native-uuid';

const uploadFileMutation = gql`
  mutation saveImage($image: String!, $name: String!) {
    saveImage(image: $image, name: $name)
  }
`;

const Upload = () => {
  const [newImage, setnewImage] = useState<undefined | string>(undefined);

  const [savePhoto] = useMutation(uploadFileMutation);

  //console.warn(data);

  const launchImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.1,
    });

    if (result.didCancel) {
      return;
    }

    if (result.assets) {
      //console.warn(result.assets[0].base64);
      setnewImage(result.assets[0].base64);
    }
  };

  const onDrop = (img: String) => {
    savePhoto({
      variables: {
        image: img,
        name: uuid.v4(),
      },
    });
  };

  const REMOTE_IMAGE_PATH = 'http://10.0.2.2:8080/';

  const checkPermission = async () => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadImage();
        } else {
          // If permission denied then show alert
          Alert.alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  const downloadImage = () => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = REMOTE_IMAGE_PATH;
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        Alert.alert('Image Downloaded Successfully.');
      });
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  return (
    <View style={{flex: 1}}>
      <Pressable
        onPress={() => onDrop(newImage || '')}
        disabled={newImage === undefined}>
        <Text style={{fontSize: 36, fontWeight: '700'}}>upload</Text>
      </Pressable>

      <View style={{}}>
        <Pressable onPress={() => launchImagePicker()}>
          <Text style={{}}>Choose</Text>
        </Pressable>
      </View>

      <Pressable onPress={checkPermission} style={{marginTop: 50}}>
        <Text>Download</Text>
      </Pressable>
    </View>
  );
};

export default Upload;
