import React, {useEffect, useMemo, useRef} from 'react';
import {Alert, ActivityIndicator} from 'react-native';
import {View, Text, Button, Colors} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AppDispatch, RootState} from '../redux/store';
import {deleteTask, updateTask} from '../redux/action/task.action';
import {Task} from '../models/task';
import {useTaskForm} from '../hooks/useTaskForm';
import TaskForm from '../components/TaskForm';

const DetailTaskScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {id} = route.params as {id: string};
  const dispatch = useDispatch<AppDispatch>();

  const originalTask = useSelector((state: RootState) => state.task.tasks[id]);
  const isSaving = useSelector(
    (state: RootState) => state.task.status === 'loading',
  );
  const saveComplete = useRef(false);

  const {
    form,
    isDirty,
    handleInputChange,
    handlePickAndUploadDocument,
    handleAvatarSelected,
    handleDeleteFile,
    uploadingState,
  } = useTaskForm(originalTask);

  const handleUpdateTask = () => {
    dispatch(updateTask({...(form as Task), id})).then(() => {
      saveComplete.current = true;
      navigation.goBack();
    });
  };

  const handleDeleteTask = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa công việc này không?',
      [
        {text: 'Hủy'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteTask(id));
            navigation.goBack();
          },
        },
      ],
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (!isDirty || isSaving || saveComplete.current) {
        return;
      }
      e.preventDefault();
      Alert.alert(
        'Bạn có muốn lưu các thay đổi?',
        'Bạn có những thay đổi chưa được lưu. Bạn có muốn loại bỏ chúng không?',
        [
          {
            text: 'Loại bỏ',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
          {text: 'Tiếp tục chỉnh sửa', style: 'cancel', onPress: () => {}},
        ],
      );
    });
    return unsubscribe;
  }, [navigation, isDirty, isSaving, saveComplete]);

  const isLoading = useMemo(
    () =>
      isSaving ||
      uploadingState.isAvatarUploading ||
      uploadingState.isCvUploading ||
      uploadingState.isDocUploading,
    [
      isSaving,
      uploadingState.isAvatarUploading,
      uploadingState.isCvUploading,
      uploadingState.isDocUploading,
    ],
  );

  if (!originalTask) {
    return (
      <View flex center>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View flex>
      <View paddingH-20 paddingT-20>
        <Text text50>Chỉnh Sửa Công Việc</Text>
      </View>

      <TaskForm
        form={form}
        handleInputChange={handleInputChange}
        onAvatarSelect={handleAvatarSelected}
        onPickDocument={handlePickAndUploadDocument}
        onDeleteFile={handleDeleteFile}
        uploadingState={uploadingState}
      />

      <View padding-20 row spread>
        <Button
          label="Xóa Công Việc"
          onPress={handleDeleteTask}
          backgroundColor={Colors.red30}
          disabled={isLoading}
        />
        <Button
          label={isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          onPress={handleUpdateTask}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default DetailTaskScreen;
