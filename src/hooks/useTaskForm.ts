import {useState, useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';

import {AppDispatch} from '../redux/store';
import {uploadFile} from '../redux/action/task.action';
import {Task} from '../models/task';
import {documentTypeFile} from '../utils/constraint';

// Kiểu dữ liệu trả về của hook
export interface UseTaskFormReturn {
  form: Partial<Task>;
  isDirty: boolean;
  setForm: React.Dispatch<React.SetStateAction<Partial<Task>>>;
  handleInputChange: (field: keyof Task, value: any) => void;
  handlePickAndUploadDocument: (fileType: 'cv' | 'document') => Promise<void>;
  handleAvatarSelected: (response: any) => Promise<void>;
  handleDeleteFile: (fileType: 'cv' | 'document') => void;
  uploadingState: {
    isAvatarUploading: boolean;
    isCvUploading: boolean;
    isDocUploading: boolean;
  };
}

export const useTaskForm = (initialTask: Partial<Task>): UseTaskFormReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<Partial<Task>>(initialTask);
  const [isDirty, setIsDirty] = useState(false);

  const [isAvatarUploading, setAvatarUploading] = useState(false);
  const [isCvUploading, setCvUploading] = useState(false);
  const [isDocUploading, setDocUploading] = useState(false);

  const handleInputChange = (field: keyof Task, value: any) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const uploadAndSetField = useCallback(
    async (
      formData: FormData,
      field: keyof Task,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
      setLoading(true);
      try {
        const newUrl = await dispatch(uploadFile(formData)).unwrap();
        handleInputChange(field, newUrl);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const handlePickAndUploadDocument = useCallback(
    async (fileType: 'cv' | 'document') => {
      try {
        const result = await DocumentPicker.pickSingle({
          type: documentTypeFile,
        });
        const formData = new FormData();
        formData.append('file', {
          uri: result.uri,
          type: result.type,
          name: result.name || result.uri.split('/').pop(),
        });
        const field = fileType === 'cv' ? 'cv_path' : 'document_path';
        const setLoading = fileType === 'cv' ? setCvUploading : setDocUploading;
        await uploadAndSetField(formData, field, setLoading);
      } catch (e) {
        if (!DocumentPicker.isCancel(e)) {
          Alert.alert('Lỗi', 'Không thể chọn file.');
        }
      }
    },
    [uploadAndSetField],
  );

  const handleAvatarSelected = useCallback(
    async (response: any) => {
      if (response.didCancel || !response.assets?.[0]?.uri) {
        return;
      }
      const asset = response.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName,
      });
      await uploadAndSetField(formData, 'avatar', setAvatarUploading);
    },
    [uploadAndSetField],
  );

  const handleDeleteFile = (fileType: 'cv' | 'document') => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa file ${
        fileType === 'cv' ? 'CV' : 'Tài liệu'
      } này không?`,
      [
        {text: 'Hủy'},
        {
          text: 'Xóa',
          onPress: () => {
            handleInputChange(
              fileType === 'cv' ? 'cv_path' : 'document_path',
              undefined,
            );
          },
          style: 'destructive',
        },
      ],
    );
  };

  useEffect(() => {
    const initialTaskString = JSON.stringify(initialTask);
    const formString = JSON.stringify(form);

    const hasChanged = initialTaskString !== formString;

    if (hasChanged !== isDirty) {
      setIsDirty(hasChanged);
    }
  }, [form, initialTask, isDirty]);

  return {
    form,
    isDirty,
    setForm,
    handleInputChange,
    handlePickAndUploadDocument,
    handleAvatarSelected,
    handleDeleteFile,
    uploadingState: {isAvatarUploading, isCvUploading, isDocUploading},
  };
};
