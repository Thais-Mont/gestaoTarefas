import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskInterface } from '../interfaces/task.interface';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  docData,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private collectionName = 'tasks';

  // Injetando o Firestore
  private firestore = inject(Firestore);

  // Referência para a coleção 'tasks'
  private tasksCollection = collection(this.firestore, this.collectionName);

  // Obter todas as tarefas
  getTasks(): Observable<TaskInterface[]> {
    return collectionData(this.tasksCollection, { idField: 'id' }) as Observable<TaskInterface[]>;
  }

  // Adicionar uma nova tarefa
  addTask(task: TaskInterface): Promise<void> {
    addDoc(this.tasksCollection, task).then((resp) => {
      console.log(resp)
      // Optional: You can add additional logic here if needed, like logging or updating UI
    });
  
    return Promise.resolve(); // Explicitly return a resolved Promise<void>
  }

  // Atualizar uma tarefa
  updateTask(task: TaskInterface): Promise<void> {
    const taskDocRef = doc(this.firestore, `${this.collectionName}/${task.id}`);
    // Atualiza o documento com os novos dados
    return updateDoc(taskDocRef, { ...task });
  }

  // Deletar uma tarefa
  deleteTask(id: string): Promise<void> {
    const taskDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    // Deleta o documento
    return deleteDoc(taskDocRef);
  }

  // Obter uma tarefa específica (opcional, caso queira buscar por id)
  getTaskById(id: string): Observable<TaskInterface> {
    const taskDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(taskDocRef, { idField: 'id' }) as Observable<TaskInterface>;
  }

  // Buscar tarefas com um critério específico (por exemplo, por status)
  getTasksByStatus(status: string): Observable<TaskInterface[]> {
    const q = query(
      this.tasksCollection,
      where('status', '==', status)
    );
    return collectionData(q, { idField: 'id' }) as Observable<TaskInterface[]>;
  }
}
