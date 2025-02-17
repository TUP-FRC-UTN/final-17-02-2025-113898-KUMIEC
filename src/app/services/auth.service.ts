import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private userRole: string | null = null;
  private userName: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

login(email: string, password: string): boolean {
  if (this.validateEmail(email) && this.validatePassword(email, password)) {
    const playerName = email.split('@')[0]; 
    this.userRole = email.startsWith('admin') ? 'admin' : 'student';
    
    this.http.get<{ name: string }[]>(`https://679b8dc433d31684632448c9.mockapi.io/users?email=${email}`)
      .subscribe(users => {
        if (users.length > 0) {
          const realName = users[0].name;
          console.log('Nombre real:', realName);
          localStorage.setItem('realUserName', realName);  
        }
      });

    this.isAuthenticated.next(true);
    localStorage.setItem('playerName', playerName);
    
    this.router.navigate(['/game'], { queryParams: { name: playerName } });
    return true;
  }
  return false;
}

  logout(): void {
    this.isAuthenticated.next(false);
    this.userRole = null;
    this.userName = null;
    localStorage.removeItem('playerName');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getUserRole(): string | null {
    return this.userRole;
  }

  getUserName(): string | null {
    return this.userName;
  }

  private validateEmail(email: string): boolean {
    const pattern = /^[a-zA-Z0-9]+@tecnicatura\.frc\.utn\.edu\.ar$/;
    return pattern.test(email);
  }

  private validatePassword(email: string, password: string): boolean {
    return password === email.split('@')[0]; 
  }
}
