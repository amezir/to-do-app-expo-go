import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    };
    loadTasks();
  }, []);

  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches', error);
    }
  };

  const addTask = () => {
    if (taskText.trim()) {
      const newTasks = [...tasks, { id: Date.now().toString(), text: taskText, completed: false }];
      setTasks(newTasks);
      saveTasks(newTasks);
      setTaskText('');
      Alert.alert('Succès', 'Tâche ajoutée');
    } else {
      Alert.alert('Erreur', 'Veuillez entrer une tâche');
    }
  };

  const toggleTaskCompleted = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const confirmDeleteTask = (taskId) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: () => deleteTask(taskId) },
      ],
      { cancelable: true }
    );
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerText}>Ma To-Do Liste</ThemedText>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nouvelle tâche"
          placeholderTextColor="#A0A0A0"
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Ionicons name="add-circle-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ThemedText style={styles.taskListTitle}>Mes Tâches</ThemedText>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity
              style={[styles.taskButton, item.completed && styles.completedButton]}
              onPress={() => toggleTaskCompleted(item.id)}
              onLongPress={() => confirmDeleteTask(item.id)}
            >
              <ThemedText style={[styles.taskText, item.completed && styles.completedText]}>
                {item.text}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDeleteTask(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#FF6347" />
            </TouchableOpacity>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#000000',
    padding: 20,
    width: '100%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'space-between',
  },
  taskButton: {
    flex: 1,
    paddingVertical: 10,
  },
  completedButton: {
    backgroundColor: '#F9F9F9',
    borderRadius: 5,
  },
  taskText: {
    fontSize: 18,
    padding: 10,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'grey',
  },
});