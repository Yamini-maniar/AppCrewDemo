import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Note } from '../types';
import { useAuth } from '../auth/AuthProvider';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList } from '../types';
import { Plus, Trash2 } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppInput from '../components/AppInput';

type Props = {
  navigation: NativeStackNavigationProp<ParamList, 'Home'>;
};

const HomeScreen = ({ navigation }: Props) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchNotes = useCallback(async () => {
    if (!user) return;

    if (!refreshing) setLoading(true);

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      ToastAndroid.show(
        'Error fetching notes: ' + error.message,
        ToastAndroid.LONG,
      );
    } else {
      setNotes(data || []);
    }
    setLoading(false);
    setRefreshing(false);
  }, [user, refreshing]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes]),
  );

  const filteredNotes = useMemo(() => {
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      return notes.filter(n => n.title.toLowerCase().includes(lower));
    }
    return notes;
  }, [searchQuery, notes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotes();
  }, [fetchNotes]);

  const deleteNote = useCallback(
    async (id: number) => {
      Alert.alert('Delete Note', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('notes')
              .delete()
              .eq('id', id);
            if (error) {
              ToastAndroid.show(error.message, ToastAndroid.LONG);
            } else {
              ToastAndroid.show('Note deleted', ToastAndroid.SHORT);
              fetchNotes();
            }
          },
        },
      ]);
    },
    [fetchNotes],
  );

  const renderItem = useCallback(
    ({ item }: { item: Note }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('EditNote', { note: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <TouchableOpacity onPress={() => deleteNote(item.id)}>
            <Trash2 size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardContent} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.date}>
          {new Date(item.updated_at).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    ),
    [navigation, deleteNote],
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <AppInput
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>No notes found. Create one!</Text>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateNote')}
      >
        <Plus size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
});
