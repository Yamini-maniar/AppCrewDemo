import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ToastAndroid, TextInput } from 'react-native';
import { supabase } from '../lib/supabase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '../types';
import AppButton from '../components/AppButton';

type Props = NativeStackScreenProps<ParamList, 'EditNote'>;

const EditNoteScreen = ({ route, navigation }: Props) => {
  const { note } = route.params;
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = useCallback(async () => {
    if (!title.trim()) {
      ToastAndroid.show('Title is required', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('notes')
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq('id', note.id);

    setLoading(false);

    if (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    } else {
      ToastAndroid.show('Note updated', ToastAndroid.SHORT);
      navigation.goBack();
    }
  }, [title, content, note.id, navigation]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Start writing..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        placeholderTextColor="#999"
      />
      <AppButton
        title="Update Note"
        onPress={handleUpdate}
        loading={loading}
        style={styles.button}
      />
    </View>
  );
};

export default EditNoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  contentInput: {
    fontSize: 16,
    flex: 1,
    marginBottom: 20,
  },
  button: {
    marginBottom: 10,
  },
});
