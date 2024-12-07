import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCuPf6Hy4Q3r4Nb8evTWgh_PUC34ja_qOw",
  authDomain: "gestaotarefas-129b1.firebaseapp.com",
  projectId: "gestaotarefas-129b1",
  storageBucket: "gestaotarefas-129b1.firebasestorage.app",
  messagingSenderId: "893762163022",
  appId: "1:893762163022:web:c7320f2a67bf98c5ddce1f"
}; 


export const appConfig: ApplicationConfig = {
  
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
