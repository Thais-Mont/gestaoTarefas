import { UserInterface } from './../interfaces/user.interface';
import { Injectable, OnDestroy } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile, UserCredential } from 'firebase/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy {

  private userSubscription: any;

  constructor(private firebaseAuth: Auth) {
    this.initUserState();
  }

  user$ = user(this.firebaseAuth);
  currentUserSig = new BehaviorSubject<UserInterface | null | undefined>(undefined);

  private initUserState() {
    this.userSubscription = this.user$.subscribe((user) => {
      this.currentUserSig.next(user ? {
        uid: user.uid,
        email: user.email || '',
        username: user.displayName || ''
      } : null);
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then((response) => updateProfile(response.user, { displayName: username }))
      .catch((error) => {
        console.error('Error during registration:', error);
        throw error;
      });
    return from(promise);
  }

  login(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password);
    return from(promise);
  }

  forgotPassword(email: string): Observable<void> {
    const promise = sendPasswordResetEmail(this.firebaseAuth, email).catch((error) => {
      console.error('Error sending password reset email:', error);
      throw error;
    });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  get currentUserUid(): string | null {
    return this.currentUserSig.value?.uid ?? null;
  }
  
}
