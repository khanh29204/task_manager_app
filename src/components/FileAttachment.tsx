import React from 'react';
import {View, Text, Button, Colors, Icon} from 'react-native-ui-lib';
import {StyleSheet} from 'react-native';

interface Props {
  label: string;
  originalPath?: string;
  newlyPickedName?: string | null;
  onSelect: () => void;
  onClear?: () => void;
}

const getFileName = (path?: string) => {
  if (!path) {
    return 'Chưa có file';
  }
  if (path.startsWith('https://') || path.startsWith('http://')) {
    try {
      const url = new URL(path);
      return url.pathname.split('/').pop() || 'File từ server';
    } catch (e) {
      return path.split('/').pop() || 'File từ server';
    }
  }
  return path.split('/').pop() || 'File không rõ tên';
};

const FileAttachment: React.FC<Props> = ({
  label,
  originalPath,
  newlyPickedName,
  onSelect,
  onClear,
}) => {
  if (newlyPickedName) {
    return (
      <View style={styles.container} row spread centerV>
        <View row centerV flex>
          <Icon
            assetGroup="icons"
            assetName="check"
            size={20}
            style={styles.icon}
          />
          <Text text70 grey10 flex numberOfLines={1}>
            Mới chọn: {newlyPickedName}
          </Text>
        </View>
        <Button label="Xóa" link red30 onPress={onClear} />
      </View>
    );
  }

  if (originalPath) {
    return (
      <View style={styles.container} row spread centerV>
        <View row centerV flex>
          <Icon
            assetGroup="icons"
            assetName="file"
            size={20}
            style={styles.icon}
          />
          <Text text70 grey10 flex numberOfLines={1}>
            {getFileName(originalPath)}
          </Text>
        </View>
        <Button label="Thay đổi" link onPress={onSelect} />
      </View>
    );
  }

  return <Button label={label} outline marginV-10 onPress={onSelect} />;
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.grey60,
    borderRadius: 8,
    marginVertical: 10,
  },
  icon: {marginRight: 10},
});

export default FileAttachment;
