import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Score } from '../models/score';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'https://671fe287e7a5792f052fdf93.mockapi.io/'; 
 
  constructor(private http: HttpClient) {}

  getRandomWord(): Observable<{ word: string }[]> {
    console.log('word')
    return this.http.get<{ word: string }[]>(`${this.apiUrl}words`);
  }

  getUserScores(playerName: string): Observable<Score[]> {
    const encodedPlayerName = encodeURIComponent(playerName);  
    return this.http.get<Score[]>(`${this.apiUrl}scores?playerName=${encodedPlayerName}`);
  }
  

  generateGameId(playerName: string): Observable<string> {
    const encodedPlayerName = encodeURIComponent(playerName);
    return this.http.get<Score[]>(`${this.apiUrl}scores?playerName=${encodedPlayerName}`).pipe(
      map(scores => {
        const numGames = scores.length;  
        const initials = this.getInitials(playerName);
        return `P${numGames + 1}${initials}`;
      }),
      catchError(error => {
        if (error.status === 404) {
          const initials = this.getInitials(playerName);
          return of(`P1${initials}`);
        }
        return throwError(error);
      })
    );
  }
  
  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase(); 
  
    const firstNameInitial = parts[0].charAt(0).toUpperCase();
    const lastNameInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    
    return firstNameInitial + lastNameInitial;
  }

  saveScore(score: Score): Observable<Score> {
    console.log('Datos a enviar:', score);
    return this.http.post<Score>(`${this.apiUrl}scores`, score);
  }
  private extractInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  getAllScores(): Observable<Score[]> {
    return this.http.get<Score[]>('https://671fe287e7a5792f052fdf93.mockapi.io/scores');
  }  
}
