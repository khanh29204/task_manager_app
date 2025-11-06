import FileViewer from 'react-native-file-viewer';
import {Alert} from 'react-native';
import RNBlobUtil from 'react-native-blob-util';

export const viewFile = async (fileUrl?: string) => {
  // Kiểm tra file đó có trong máy chưa, sau đó mới tải
  if (!fileUrl) {
    Alert.alert('Lỗi', 'Không có đường dẫn file để mở.');
    return;
  }

  const fileName = fileUrl.split('/').pop();
  if (!fileName) {
    Alert.alert('Lỗi', 'Không thể xác định tên file.');
    return;
  }

  const localFile = `${RNBlobUtil.fs.dirs.CacheDir}/${fileName}`;

  try {
    // Kiểm tra xem file đã tồn tại cục bộ chưa
    const fileExists = await RNBlobUtil.fs.exists(localFile);

    if (fileExists) {
      console.log('File already exists locally, opening:', localFile);
      await FileViewer.open(localFile);
    } else {
      console.log('File not found locally, downloading from:', fileUrl);
      // Tải file nếu chưa có
      const res = await RNBlobUtil.config({
        fileCache: true,
        path: localFile,
      }).fetch('GET', fileUrl);

      console.log('File downloaded to:', res.path());
      await FileViewer.open(res.path());
    }
  } catch (e: any) {
    console.error('Error viewing file:', e);
    Alert.alert('Lỗi', `Không thể mở file: ${e.message}`);
  }
};

export const saveFileToCache = async (fileUrl?: string) => {
  if (!fileUrl) {
    return;
  }

  const fileName = fileUrl.split('/').pop();
  if (!fileName) {
    return;
  }

  const localFile = `${RNBlobUtil.fs.dirs.CacheDir}/${fileName}`;

  try {
    const fileExists = await RNBlobUtil.fs.exists(localFile);

    if (fileExists) {
      return localFile;
    } else {
      const res = await RNBlobUtil.config({
        fileCache: true,
        path: localFile,
      }).fetch('GET', fileUrl);

      return res.path();
    }
  } catch (e: any) {
    console.error('Error saving file to cache:', e);
    return null;
  }
};
