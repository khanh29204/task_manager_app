import React from 'react';
import {View, Text, Button, Colors} from 'react-native-ui-lib';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {getFileName} from '../utils/fileHelper';

interface Props {
  label: string;
  fileUrl?: string;
  isUploading: boolean;
  onSelect: () => void;
  onView: () => void;
  onDelete: () => void;
}

const FileAttachmentRow: React.FC<Props> = ({
  label,
  fileUrl,
  isUploading,
  onSelect,
  onView,
  onDelete,
}) => {
  if (isUploading) {
    return (
      <View style={styles.container} centerV>
        <ActivityIndicator size="small" color={Colors.grey40} />
        <Text marginL-10 grey40>
          Đang tải lên...
        </Text>
      </View>
    );
  }

  if (fileUrl) {
    return (
      <View style={styles.container}>
        <View row spread centerV>
          <View row centerV flex>
            <Text text80 grey10 flex numberOfLines={1}>
              {getFileName(fileUrl)}
            </Text>
          </View>
          {/* Nút Xóa */}
          <Button label="Xóa" link onPress={onDelete} />
        </View>
        <View row marginT-10>
          <Button
            label="Xem"
            flex
            outline
            onPress={onView}
            style={styles.actionButton}
          />
          <Button
            label="Thay đổi"
            flex
            outline
            onPress={onSelect}
            style={styles.actionButton}
          />
        </View>
      </View>
    );
  }

  return (
    <Button label={`Chọn ${label}`} outline marginV-10 onPress={onSelect} />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.grey70,
    borderRadius: 8,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  actionButton: {
    marginHorizontal: 5,
  },
});

export default FileAttachmentRow;
