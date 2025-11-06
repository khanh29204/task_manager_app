import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const sdk = Platform.Version;

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      let filePermission: any | null = null;

      if (sdk >= 33) {
        filePermission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      } else if (sdk >= 30) {
        // Kiểm tra xem permission có tồn tại trước khi gọi
        filePermission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      } else {
        filePermission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      }

      if (filePermission) {
        const grantedFile = await PermissionsAndroid.request(filePermission);
        console.log('File permission granted:', grantedFile);
      }

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        console.log('Camera or mic permission denied');
        return false;
      }
    } else if (Platform.OS === 'ios') {
      const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);
      if (cameraStatus === RESULTS.GRANTED) {
        return true;
      }

      const requestStatus = await request(PERMISSIONS.IOS.CAMERA);
      return requestStatus === RESULTS.GRANTED;
    }

    return false;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

export const requestMediaPermission = async (): Promise<boolean> => {
  let permission;
  if (Platform.OS === 'ios') {
    permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
  } else {
    permission =
      Number(Platform.Version) >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  }

  const status = await check(permission);
  if (status === RESULTS.GRANTED) {
    return true;
  }

  const result = await request(permission);
  if (result === RESULTS.GRANTED) {
    return true;
  }

  if (result === RESULTS.BLOCKED) {
    Alert.alert(
      'Quyền bị từ chối',
      'Bạn đã chặn quyền truy cập ảnh. Vui lòng vào Cài đặt để cấp quyền cho ứng dụng.',
      [
        {
          text: 'OK',
          onPress: () => {
            Linking.openSettings(); // Mở cài đặt ứng dụng
          },
        },
      ],
      {cancelable: false},
    );
  }
  return false;
};
