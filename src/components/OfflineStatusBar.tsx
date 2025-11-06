import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const BAR_HEIGHT = 36;
const SHOW_DUR = 300;
const HIDE_DUR = 300;

export default function OfflineStatusBar() {
  const [message, setMessage] = useState('');
  const [bgColor, setBgColor] = useState('#52c41a');

  const heightSv = useSharedValue(0);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    heightSv.value = withTiming(BAR_HEIGHT, {
      duration: SHOW_DUR,
      easing: Easing.out(Easing.cubic),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hide = useCallback((delay = 0) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      heightSv.value = withTiming(0, {
        duration: HIDE_DUR,
        easing: Easing.in(Easing.cubic),
      });
      hideTimerRef.current = null;
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => {
    return {height: heightSv.value};
  });

  // Network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = !!state.isConnected && !!state.isInternetReachable;
      if (!online) {
        setMessage('Không có kết nối mạng');
        setBgColor('#ff4d4f');
        show();
      } else {
        setMessage('Đã có kết nối mạng trở lại');
        setBgColor('#52c41a');
        hide(2000);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return (
    <Animated.View
      style={[styles.container, containerStyle, {backgroundColor: bgColor}]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
});
