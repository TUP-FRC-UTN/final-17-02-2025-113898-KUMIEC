import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Score } from '../../models/score';

@Component({
  selector: 'app-game',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  word: string = '';
  hiddenWord: string[] = [];
  incorrectLetters: string[] = [];
  correctLetters: string[] = [];
  maxAttempts: number = 6;
  remainingAttempts: number = 6;
  gameOver: boolean = false;
  isWinner: boolean = false;
  keyboard: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  playerName: string = '';  

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.startNewGame();
    this.playerName = localStorage.getItem('playerName') || ''; 
    this.startNewGame();
  }

  startNewGame(): void {
    this.gameService.getRandomWord().subscribe(
      (response) => {
        console.log('API Response:', response); 
    
        if (response.length > 0) { 
          const randomIndex = Math.floor(Math.random() * response.length);
          this.word = response[randomIndex].word.toUpperCase();
          console.log('Word set:', this.word);
        } else {
          console.error('Error: No word found in API response');
        }
    
        this.hiddenWord = Array(this.word.length).fill('_');
        this.incorrectLetters = [];
        this.correctLetters = [];
        this.remainingAttempts = this.maxAttempts;
        this.gameOver = false;
        this.isWinner = false;
      },
      (error) => {
        console.error('Error fetching word:', error);
      }
    );
  }
  
  

  guessLetter(letter: string): void {
    if (this.gameOver || this.correctLetters.includes(letter) || 
        this.incorrectLetters.includes(letter)) {
      return;
    }

    if (this.word.includes(letter)) {
      this.correctLetters.push(letter);
      this.updateHiddenWord(letter);
      this.checkWin();
    } else {
      this.incorrectLetters.push(letter);
      this.remainingAttempts--;
      this.checkLoss();
    }
  }

  private updateHiddenWord(letter: string): void {
    for (let i = 0; i < this.word.length; i++) {
      if (this.word[i] === letter) {
        this.hiddenWord[i] = letter;
      }
    }
    console.log('Updated hiddenWord:', this.hiddenWord.join(' ')); 
  }

  private checkWin(): void {
    if (!this.hiddenWord.includes('_')) {
      this.gameOver = true;
      this.isWinner = true;
      this.saveGameScore();
    }
  }

  private checkLoss(): void {
    if (this.remainingAttempts === 0) {
      this.gameOver = true;
      this.isWinner = false;
      this.saveGameScore();
    }
  }

  private saveGameScore(): void {
    console.log(this.playerName)
    this.gameService.generateGameId(this.playerName).subscribe(gameId => {
      const scoreData: Score = {
        playerName: this.playerName,
        word: this.word,
        attemptsLeft: this.remainingAttempts,
        score: this.calculateScore(),
        date: new Date().toISOString().split('T')[0],
        idGame: gameId
      };
  
      this.gameService.saveScore(scoreData).subscribe({
        next: (response) => console.log('Score guardado:', scoreData),
        error: (error) => console.error('Error al guardar el score:', scoreData)
      });
    });
  }

  
  

  private calculateScore(): number {
    const scoreMap: { [key: number]: number } = {
      6: 100,
      5: 80,
      4: 60,
      3: 40,
      2: 20,
      1: 10,
      0: 0
    };
    return scoreMap[this.remainingAttempts];
  }
}