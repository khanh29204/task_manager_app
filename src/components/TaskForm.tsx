import React, {useState} from 'react';
import {ScrollView, StyleSheet, ActivityIndicator} from 'react-native';
import {View, Text, Switch, Avatar, Picker, Colors} from 'react-native-ui-lib';
import {Gender, Task} from '../models/task';
import {viewFile} from '../utils/fileViewer';
import InputView from './InputView';
import SelectImageFrom from '../dialog/SelectImageFrom';
import FileAttachmentRow from './FileAttachmentRow';

interface TaskFormProps {
  form: Partial<Task>;
  handleInputChange: (field: keyof Task, value: any) => void;
  onAvatarSelect: (response: any) => void;
  onPickDocument: (fileType: 'cv' | 'document') => void;
  onDeleteFile: (fileType: 'cv' | 'document') => void;
  uploadingState: {
    isAvatarUploading: boolean;
    isCvUploading: boolean;
    isDocUploading: boolean;
  };
}

const TaskForm: React.FC<TaskFormProps> = ({
  form,
  handleInputChange,
  onAvatarSelect,
  onPickDocument,
  onDeleteFile,
  uploadingState,
}) => {
  const [visibleSelectImage, setVisibleSelectImage] = useState(false);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <Avatar
          source={{uri: form.avatar}}
          size={120}
          containerStyle={styles.avatar}
          onPress={() => setVisibleSelectImage(true)}>
          {uploadingState.isAvatarUploading && (
            <View absF center style={styles.loadingOverlay}>
              <ActivityIndicator color={Colors.white} />
            </View>
          )}
        </Avatar>

        <View gap-12>
          <InputView
            value={form.fullname}
            onChangeText={v => handleInputChange('fullname', v)}
            placeholder="Họ và Tên"
          />
          <InputView
            value={form.title}
            onChangeText={v => handleInputChange('title', v)}
            placeholder="Tiêu đề công việc"
          />
          <InputView
            value={form.major}
            onChangeText={v => handleInputChange('major', v)}
            placeholder="Chuyên ngành"
          />
          <InputView
            value={form.position}
            onChangeText={v => handleInputChange('position', v)}
            placeholder="Chức vụ"
          />

          <View centerV style={styles.inputGender}>
            <Text grey40>Giới tính</Text>
            <Picker
              value={form.gender}
              onChange={(item: any) => {
                handleInputChange('gender', item);
              }}>
              <Picker.Item value={Gender.MALE} label="Nam" />
              <Picker.Item value={Gender.FEMALE} label="Nữ" />
              <Picker.Item value={Gender.OTHER} label="Khác" />
            </Picker>
          </View>
        </View>

        <FileAttachmentRow
          label="CV"
          fileUrl={form.cv_path}
          isUploading={uploadingState.isCvUploading}
          onSelect={() => onPickDocument('cv')}
          onView={() => viewFile(form.cv_path)}
          onDelete={() => onDeleteFile('cv')}
        />
        <FileAttachmentRow
          label="Tài liệu"
          fileUrl={form.document_path}
          isUploading={uploadingState.isDocUploading}
          onSelect={() => onPickDocument('document')}
          onView={() => viewFile(form.document_path)}
          onDelete={() => onDeleteFile('document')}
        />

        <View row spread centerV marginV-20>
          <Text text60>Hoàn thành</Text>
          <Switch
            value={form.is_complete}
            onValueChange={v => handleInputChange('is_complete', v)}
          />
        </View>
      </ScrollView>

      <SelectImageFrom
        isVisible={visibleSelectImage}
        onDismiss={() => setVisibleSelectImage(false)}
        onImageSelected={response => {
          setVisibleSelectImage(false); // Đóng dialog trước
          onAvatarSelect(response);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {padding: 20},
  loadingOverlay: {backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 60},
  avatar: {
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  inputGender: {
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingBottom: 4,
  },
});

export default TaskForm;
