import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskInterface } from '../interfaces/task.interface';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc, query, where, docData, Query, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private collectionName = 'tasks';
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  private getCurrentUserUid(): Observable<string | null> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }
        return of(user.uid);
      }),
      catchError(error => {
        return of(null);
      })
    );
  }

  private getUserTasksCollection(): Observable<any> {
    return this.getCurrentUserUid().pipe(
      switchMap(userId => {
        if (!userId) {
          return of(null);
        }
        return of(collection(this.firestore, `users/${userId}/tasks`) as Query<TaskInterface>);
      }),
      catchError(error => {
        return of(null);
      })
    );
  }
  getTasks(): Observable<TaskInterface[]> {
    return this.getUserTasksCollection().pipe(
      switchMap(tasksCollection => {
        return collectionData(tasksCollection, { idField: 'id' }) as Observable<TaskInterface[]>;
      }),
      catchError(error => {
        return of([]);
      })
    );
  }
  

  addTask(task: TaskInterface): Observable<void> {
    return this.getUserTasksCollection().pipe(
      switchMap(async tasksCollection => {
        if (!tasksCollection) throw new Error('Coleção de tarefas não encontrada');
        try {
          await addDoc(tasksCollection, task);
        } catch (error) {
          throw error;
        }
      }),
      catchError(error => {
        return of(void 0);
      })
    );
  }

  updateTask(task: TaskInterface): Observable<void> {
    return this.getCurrentUserUid().pipe(
      switchMap(uid => {
        if (!uid) throw new Error('Usuário não autenticado');
        const taskDocRef = doc(this.firestore, `users/${uid}/tasks/${task.id}`);
        return updateDoc(taskDocRef, { ...task }).then().catch((error) => {
          throw error;
        });
      }),
      catchError(error => {
        return of(void 0);
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.getCurrentUserUid().pipe(
      switchMap(uid => {
        if (!uid) throw new Error('Usuário não autenticado');
        const taskDocRef = doc(this.firestore, `users/${uid}/tasks/${id}`);
        return deleteDoc(taskDocRef).then().catch((error) => {
          throw error;
        });
      }),
      catchError(error => {
        return of(void 0);
      })
    );
  }

  getTaskById(id: string): Observable<TaskInterface | null> {
    return this.getCurrentUserUid().pipe(
      switchMap(uid => {
        if (!uid) throw new Error('Usuário não autenticado');
        const taskDocRef = doc(this.firestore, `users/${uid}/tasks/${id}`);
        return docData(taskDocRef, { idField: 'id' }) as Observable<TaskInterface | null>;
      }),
      catchError(error => {
        return of(null);
      })
    );
  }

  getTasksByDateRange(startDate: string, endDate: string): Observable<TaskInterface[]> {
    return this.getCurrentUserUid().pipe(
      switchMap(uid => {
        if (!uid) {
          return of([]);  
        }
        const tasksCollection = collection(this.firestore, `users/${uid}/tasks`);
        const tasksQuery = query(
          tasksCollection,
          where('dueDate', '>=', startDate),
          where('dueDate', '<=', endDate)
        );
        return getDocs(tasksQuery).then(querySnapshot => {
          const tasks: TaskInterface[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data['title'] || '',  
              description: data['description'] || '',
              dueDate: data['dueDate'] || '', 
              responsibleCpf: data['responsibleCpf'] || '',
              responsibleEmail: data['responsibleEmail'] || '',
              responsibleName: data['responsibleName'] || '',
              status: data['status'] || 'pending', 
            };
          });

          return tasks;
        }).catch(error => {
          console.error('Erro ao buscar tarefas por data:', error);
          return [];
        });
      }),
      catchError(error => {
        console.error('Erro ao buscar tarefas:', error);
        return of([]);  
      })
    );
  }

}
