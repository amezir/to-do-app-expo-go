import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function TabTwoScreen() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  // Charger les tâches depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    };
    loadTasks();
  }, []);

  // Sauvegarder les tâches dans AsyncStorage à chaque modification
  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches', error);
    }
  };

  // Fonction pour ajouter une tâche
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

  // Fonction pour marquer une tâche comme complétée
  const toggleTaskCompleted = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Fonction pour supprimer une tâche avec confirmation
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
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000000', dark: '#ffffff' }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ light: '#000000', dark: '#ffffff' }}>Ma To-Do Liste</ThemedText>
      </ThemedView>

      {/* Zone de saisie pour ajouter une tâche */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nouvelle tâche"
          placeholderTextColor="#A0A0A0"
          value={taskText}
          onChangeText={setTaskText}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <ThemedText style={{ color: '#FFF' }}>Ajouter</ThemedText>
        </TouchableOpacity>
      <ThemedText style={{ light: '#000000', dark: '#ffffff' }}>Mes Tâches</ThemedText>
      {/* Liste des tâches */}
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    justifyContent: 'start',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#000000',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'transparent',
    margin: 3,
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