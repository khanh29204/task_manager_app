import React, {useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {View, Text, Chip, Colors} from 'react-native-ui-lib';
import {Gender} from '../models/task';

export interface ValueFilter {
  genderFilter?: Gender;
  completionFilter?: boolean;
}

interface FilterChipProps {
  onValueChange?: (value: ValueFilter) => void;
}

type CompletionFilter = 'all' | 'completed' | 'incomplete';
type GenderFilter = 'all' | Gender;
const FilterChip: React.FC<FilterChipProps> = ({onValueChange}) => {
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [completionFilter, setCompletionFilter] =
    useState<CompletionFilter>('all');
  React.useEffect(() => {
    if (onValueChange) {
      onValueChange({
        genderFilter: genderFilter === 'all' ? undefined : genderFilter,
        completionFilter:
          completionFilter === 'all'
            ? undefined
            : completionFilter === 'completed'
            ? true
            : false,
      });
    }
  }, [genderFilter, completionFilter, onValueChange]);
  return (
    <View gap-8>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text text80 grey30 marginR-8>
          Trạng thái:
        </Text>
        <View row gap-4>
          <Chip
            label="Tất cả"
            backgroundColor={
              completionFilter === 'all' ? Colors.blue30 : undefined
            }
            labelStyle={{
              color: completionFilter === 'all' ? Colors.white : Colors.black,
            }}
            onPress={() => setCompletionFilter('all')}
          />
          <Chip
            label="Hoàn thành"
            backgroundColor={
              completionFilter === 'completed' ? Colors.blue30 : undefined
            }
            labelStyle={{
              color:
                completionFilter === 'completed' ? Colors.white : Colors.black,
            }}
            onPress={() => setCompletionFilter('completed')}
          />
          <Chip
            backgroundColor={
              completionFilter === 'incomplete' ? Colors.blue30 : undefined
            }
            labelStyle={{
              color:
                completionFilter === 'incomplete' ? Colors.white : Colors.black,
            }}
            onPress={() => setCompletionFilter('incomplete')}
            label="Chưa hoàn thành"
          />
        </View>
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text text80 grey30 marginR-8>
          Giới tính:
        </Text>
        <View row gap-4>
          <Chip
            label="Tất cả"
            labelStyle={{
              color: genderFilter === 'all' ? Colors.white : Colors.black,
            }}
            backgroundColor={genderFilter === 'all' ? Colors.blue30 : undefined}
            onPress={() => setGenderFilter('all')}
          />
          <Chip
            label="Nam"
            backgroundColor={
              genderFilter === Gender.MALE ? Colors.blue30 : undefined
            }
            labelStyle={{
              color: genderFilter === Gender.MALE ? Colors.white : Colors.black,
            }}
            onPress={() => setGenderFilter(Gender.MALE)}
          />
          <Chip
            backgroundColor={
              genderFilter === Gender.FEMALE ? Colors.blue30 : undefined
            }
            labelStyle={{
              color:
                genderFilter === Gender.FEMALE ? Colors.white : Colors.black,
            }}
            onPress={() => setGenderFilter(Gender.FEMALE)}
            label="Nữ"
          />
          <Chip
            backgroundColor={
              genderFilter === Gender.OTHER ? Colors.blue30 : undefined
            }
            labelStyle={{
              color:
                genderFilter === Gender.OTHER ? Colors.white : Colors.black,
            }}
            onPress={() => setGenderFilter(Gender.OTHER)}
            label="Khác"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FilterChip;
