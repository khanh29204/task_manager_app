import React from 'react';
import {StyleSheet} from 'react-native';
import {Dialog, View, Button, Colors} from 'react-native-ui-lib';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {requestCameraPermission} from '../utils/permission';

interface SelectImageFromProps {
  isVisible: boolean;
  onDismiss: () => void;
  onImageSelected: (response: ImagePickerResponse) => void;
}

const SelectImageFrom: React.FC<SelectImageFromProps> = ({
  isVisible,
  onDismiss,
  onImageSelected,
}) => {
  const handleLaunchCamera = async () => {
    await requestCameraPermission();
    const result = await launchCamera({mediaType: 'photo', quality: 0.7});
    onImageSelected(result);
    onDismiss();
  };

  const handleLaunchImageLibrary = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', quality: 0.7});
    onImageSelected(result);
    onDismiss();
  };

  return (
    <Dialog
      visible={isVisible}
      onDismiss={onDismiss}
      panDirection={'down'}
      containerStyle={styles.dialogContainer}
      width="100%"
      bottom>
      <View bg-white padding-20 br40 marginH-20 marginB-40>
        <Button
          label="Chụp ảnh mới"
          marginB-10
          onPress={handleLaunchCamera}
          backgroundColor={Colors.blue30}
        />
        <Button
          label="Chọn từ thư viện"
          marginB-10
          onPress={handleLaunchImageLibrary}
          backgroundColor={Colors.green30}
        />
        <Button label="Hủy" link onPress={onDismiss} color={Colors.grey30} />
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialogContainer: {
    backgroundColor: 'transparent',
  },
});

export default SelectImageFrom;
