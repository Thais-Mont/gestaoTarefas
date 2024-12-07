import { UserInterface } from './../interfaces/user.interface';
import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    firebaseAuth = inject(Auth);
    user$ = user(this.firebaseAuth);
    currentUserSig = signal<UserInterface | null | undefined>(undefined);


    register(email: string, username: string, password: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
          .then((response) => {
            return updateProfile(response.user, { displayName: username });
          })
          .catch((error) => {
            console.error('Error during registration:', error);
            throw error;
          });
        return from(promise);
      };

    login(email: string, password: string): Observable<void> {
        const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then((response) => {
          console.log('User logged in:', response.user);
        })
        return from(promise);
      };

      forgotPassword(email: string): Observable<void> {
        const promise = sendPasswordResetEmail(this.firebaseAuth, email)
            .then(() => {
                console.log('Password reset email sent');
            })
            .catch((error) => {
                console.error('Error sending password reset email:', error);
                throw error;
            });
        return from(promise);
    };

     logout(): Observable<void> {
       const promise = signOut(this.firebaseAuth);
       return from(promise);
     } 
      
}