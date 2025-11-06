import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import {nav} from './nav.name';
import {NavigationContainer} from '@react-navigation/native';
import DetailTaskScreen from '../screens/DetailTaskScreen';
import AddTaskScreen from '../screens/AddTaskScreen';

interface RootNavigationProps {}
const Stack = createNativeStackNavigator();

const RootNavigation: React.FC<RootNavigationProps> = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={nav.home} component={HomeScreen} />
        <Stack.Screen name={nav.task_detail} component={DetailTaskScreen} />
        <Stack.Screen name={nav.add_task} component={AddTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
