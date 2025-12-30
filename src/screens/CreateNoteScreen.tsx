import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ToastAndroid, TextInput } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamList } from '../types';
import AppButton from '../components/AppButton';

type Props = {
  navigation: NativeStackNavigationProp<ParamList, 'CreateNote'>;
};

const CreateNoteScreen = ({ navigation }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      ToastAndroid.show('Title is required', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('notes').insert({
      title,
      content,
      user_id: user?.id,
    });
    setLoading(false);

    if (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    } else {
      ToastAndroid.show('Note created', ToastAndroid.SHORT);
      navigation.goBack();
    }
  }, [title, content, user?.id, navigation]);

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
        title="Save Note"
        onPress={handleSave}
        loading={loading}
        style={styles.button}
      />
    </View>
  );
};

export default CreateNoteScreen;

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
