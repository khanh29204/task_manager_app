import React from 'react';
import {
  View,
  Text,
  Checkbox,
  Avatar,
  Drawer,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {Task} from '../models/task';
import {useNavigation} from '@react-navigation/native';
import {nav} from '../navigation/nav.name';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../redux/store';
import {deleteTask, updateTask} from '../redux/action/task.action';
import {Alert} from 'react-native';

interface ItemTaskProps {
  task: Task;
}

const ItemTask: React.FC<ItemTaskProps> = ({task}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const handlePressItem = () => {
    navigation.navigate(nav.task_detail, {
      id: task.id,
    });
  };
  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa công việc "${task.title}" không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteTask(task.id));
          },
        },
      ],
    );
  };

  const handleComplete = (val: boolean) => {
    dispatch(
      updateTask({
        is_complete: val,
        id: task.id,
      }),
    );
  };

  return (
    <Drawer
      rightItems={[
        {
          text: 'Delete',
          background: 'red',
          onPress: handleDelete,
        },
      ]}>
      <TouchableOpacity onPress={handlePressItem}>
        <View row flex centerV gap-8>
          <Checkbox value={task.is_complete} onValueChange={handleComplete} />
          <Avatar source={{uri: task.avatar}} />
          <View>
            <Text>{task.fullname}</Text>
            <Text text90L grey30>
              {task.major}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Drawer>
  );
};

export default React.memo(ItemTask);
