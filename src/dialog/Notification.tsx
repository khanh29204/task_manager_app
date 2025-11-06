/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {
  Text,
  View,
  Dialog,
  Colors,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {hideNotification} from '../redux/slice/notification.slice';

const NOTIFICATION_CONFIG = {
  success: {
    backgroundColor: Colors.green30,
    iconName: 'check-circle',
    iconColor: Colors.white,
  },
  error: {
    backgroundColor: Colors.red30,
    iconName: 'alert-circle',
    iconColor: Colors.white,
  },
  info: {
    backgroundColor: Colors.blue30,
    iconName: 'info',
    iconColor: Colors.white,
  },
};

const Notification: React.FC = () => {
  const {isVisible, message, type} = useSelector(
    (state: RootState) => state.notification,
  );
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(hideNotification());
  }, [dispatch]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Lấy cấu hình hiện tại dựa trên 'type'
  const config =
    NOTIFICATION_CONFIG[type as keyof typeof NOTIFICATION_CONFIG] ||
    NOTIFICATION_CONFIG.info;

  // Render null nếu không hiển thị để tối ưu
  if (!isVisible) {
    return null;
  }

  return (
    <Dialog
      visible={isVisible}
      onDismiss={onClose}
      panDirection={'down'}
      containerStyle={styles.dialogContainer}
      width="100%"
      bottom>
      <TouchableOpacity onPress={onClose} activeOpacity={0.9}>
        <View
          row
          spread
          centerV
          padding-16
          marginH-20
          marginB-40
          br40
          style={[styles.container, {backgroundColor: config.backgroundColor}]}>
          <View row centerV>
            <Text text70 style={{color: config.iconColor, flex: 1}}>
              {message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialogContainer: {
    backgroundColor: 'transparent',
  },
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default Notification;
