/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  ActivityIndicator,
  StyleSheet,
  InteractionManager,
} from 'react-native';
import {
  View,
  Text,
  FloatingButton,
  SearchInput,
  Colors,
} from 'react-native-ui-lib';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {fetchTasks} from '../redux/action/task.action';
import {useDebounce} from '../hooks/useDebouce';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {nav} from '../navigation/nav.name';
import ItemTask from '../components/ItemTask';
import FilterChip, {ValueFilter} from '../components/FilterChip';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();

  const {tasks, status, currentPage, totalPages, totalTasks} = useSelector(
    (state: RootState) => ({
      tasks: state.task.tasks,
      status: state.task.status,
      currentPage: state.task.currentPage,
      totalPages: state.task.totalPages,
      totalTasks: state.task.totalTasks,
    }),
    shallowEqual,
  );

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ValueFilter>({
    genderFilter: undefined,
    completionFilter: undefined,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchDebounce = useDebounce(search, 500);
  const data = useMemo(() => {
    return Object.values(tasks).sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }, [tasks]);
  const [dataFilter, setDataFilter] = useState(data);

  useEffect(() => {
    setIsRefreshing(true);
    const timer = setTimeout(() => {
      setIsRefreshing(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchDebounce, filter]);

  useEffect(() => {
    const t = InteractionManager.runAfterInteractions(async () => {
      const filtered = await Promise.resolve().then(() => {
        if (
          !searchDebounce &&
          !filter.genderFilter &&
          filter.completionFilter === undefined
        ) {
          return data;
        }

        const q = searchDebounce.toLowerCase();
        return data.filter(task => {
          const matchesSearch =
            task.fullname.toLowerCase().includes(q) ||
            task.major.toLowerCase().includes(q);

          const matchesGender = filter.genderFilter
            ? task.gender === filter.genderFilter
            : true;

          const matchesCompletion =
            filter.completionFilter !== undefined
              ? task.is_complete === filter.completionFilter
              : true;

          return matchesSearch && matchesGender && matchesCompletion;
        });
      });
      setDataFilter(filtered);
    });
    return () => t.cancel();
  }, [data, filter.genderFilter, filter.completionFilter, searchDebounce]);

  const [visibleAdd, setVisibleAdd] = useState(true);
  const scrollY = useRef(0);
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY > 50 && currentScrollY > scrollY.current && visibleAdd) {
      setVisibleAdd(false);
    }
    if (currentScrollY < scrollY.current && !visibleAdd) {
      setVisibleAdd(true);
    }
    scrollY.current = currentScrollY;
  };

  // Fetch dữ liệu, tìm kiếm và phân trang
  useEffect(() => {
    const apiParams: any = {
      page: 1,
      limit: 20,
      search: searchDebounce,
      gender: filter.genderFilter,
      is_complete: filter.completionFilter,
    };

    dispatch(fetchTasks(apiParams));
  }, [dispatch, filter.completionFilter, filter.genderFilter, searchDebounce]);

  const handleLoadMore = useCallback(() => {
    const apiParams: any = {
      page: currentPage + 1,
      limit: 20,
      search: searchDebounce,
      gender: filter.genderFilter,
      is_complete: filter.completionFilter,
    };
    if (status !== 'loading' && currentPage < totalPages) {
      dispatch(fetchTasks(apiParams));
    }
  }, [currentPage, totalPages, status, searchDebounce, filter, dispatch]);

  // Refresh thủ công
  const handleRefresh = useCallback(async () => {
    const apiParams: any = {
      page: 1,
      limit: 20,
      search: searchDebounce,
      gender: filter.genderFilter,
      is_complete: filter.completionFilter,
    };
    setIsRefreshing(true);
    await dispatch(fetchTasks(apiParams));
    setIsRefreshing(false);
  }, [dispatch, filter.completionFilter, filter.genderFilter, searchDebounce]);

  const renderFooter = () => {
    if (status === 'loading' && currentPage > 1) {
      return (
        <View center paddingV-20>
          <ActivityIndicator size="large" color={Colors.blue30} />
        </View>
      );
    }
    return null;
  };

  return (
    <View flex useSafeArea>
      <View padding-16>
        <Text text40BO>
          Công việc (
          {data.length
            ? data.length > totalTasks
              ? data.length
              : totalTasks
            : totalTasks}
          )
        </Text>
        <SearchInput
          placeholder="Tìm theo tên, chuyên ngành..."
          onChangeText={setSearch}
          value={search}
          containerStyle={styles.searchInput}
        />
        <FilterChip onValueChange={setFilter} />
      </View>

      <FlatList
        data={dataFilter}
        renderItem={({item}) => <ItemTask task={item} />}
        keyExtractor={item => item.id}
        onScroll={handleScroll}
        removeClippedSubviews
        scrollEventThrottle={16}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.7}
        ListFooterComponent={renderFooter}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View center padding-20>
            <Text text70 grey30>
              Không tìm thấy công việc nào.
            </Text>
          </View>
        }
      />

      <View absB absR marginR-20>
        <FloatingButton
          visible={visibleAdd}
          button={{
            label: 'Thêm',
            onPress: () => navigation.navigate(nav.add_task),
          }}
          hideBackgroundOverlay
          bottomMargin={20}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    marginTop: 10,
  },
  separator: {
    height: 10,
    backgroundColor: Colors.grey70,
    marginHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
