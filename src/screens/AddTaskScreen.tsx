import React, {useEffect} from 'react';
import {Alert, ActivityIndicator} from 'react-native';
import {View, Text, Button, Colors} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {AppDispatch, RootState} from '../redux/store';
import {createTask} from '../redux/action/task.action';
import {Gender, Task} from '../models/task';
import {useTaskForm} from '../hooks/useTaskForm';
import TaskForm from '../components/TaskForm';

// Định nghĩa trạng thái ban đầu cho một task mới
const INITIAL_NEW_TASK: Partial<Task> = {
  fullname: '',
  title: '',
  major: '',
  gender: Gender.OTHER,
  is_complete: false,
  avatar: undefined,
  cv_path: undefined,
  document_path: undefined,
};

const AddTaskScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const isSaving = useSelector(
    (state: RootState) => state.task.status === 'loading',
  );
  const isCreating = useSelector(
    (state: RootState) => state.task.status === 'loading',
  );

  const {
    form,
    isDirty,
    handleInputChange,
    handlePickAndUploadDocument,
    handleAvatarSelected,
    handleDeleteFile,
    uploadingState,
  } = useTaskForm(INITIAL_NEW_TASK);

  const handleCreateTask = async () => {
    if (!form.fullname?.trim() || !form.title?.trim()) {
      Alert.alert(
        'Thông tin bắt buộc',
        'Vui lòng nhập đầy đủ Họ và Tên và Tiêu đề công việc.',
      );
      return;
    }

    try {
      await dispatch(createTask(form as Omit<Task, 'id'>)).unwrap();
      navigation.goBack();
    } catch (error) {}
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (!isDirty || isSaving) {
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
  }, [navigation, isDirty, isSaving]);

  const isLoading =
    isCreating ||
    uploadingState.isAvatarUploading ||
    uploadingState.isCvUploading ||
    uploadingState.isDocUploading;

  if (!form) {
    return (
      <View flex center>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View flex>
      <View paddingH-20 paddingT-20>
        <Text text50>Thêm Công Việc Mới</Text>
      </View>

      <TaskForm
        form={form}
        handleInputChange={handleInputChange}
        onAvatarSelect={handleAvatarSelected}
        onPickDocument={handlePickAndUploadDocument}
        onDeleteFile={handleDeleteFile}
        uploadingState={uploadingState}
      />

      <View padding-20>
        <Button
          label={isCreating ? 'Đang tạo...' : 'Tạo Công Việc'}
          onPress={handleCreateTask}
          backgroundColor={Colors.green30}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default AddTaskScreen;
