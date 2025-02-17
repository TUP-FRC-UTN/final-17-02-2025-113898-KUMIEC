import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Score } from '../../models/score';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-scores',
    standalone: true, 
    imports: [CommonModule, ReactiveFormsModule,RouterModule], 
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent implements OnInit {
  scores: Score[] = [];
  isAdmin: boolean = false;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.checkIfAdmin();
    if (this.isAdmin) {
      this.loadScores();
    }
  }

  private checkIfAdmin(): void {
    const userRole = localStorage.getItem('userRole');
    this.isAdmin = userRole === 'admin';
  }
  

  private loadScores(): void {
    this.gameService.getAllScores().subscribe(data => {
      this.scores = data;
    });
  }
}
