import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule,RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
  
    this.http.get<User[]>(`https://679b8dc433d31684632448c9.mockapi.io/users?username=${email}&password=${password}`)
      .subscribe(users => {
        if (users.length > 0) {
          const user = users[0]; 
          localStorage.setItem('userRole', user.role); 
          localStorage.setItem('playerName', user.name);
          console.log(user.name)
          if (user.role === 'admin') {
            this.router.navigate(['/scores']); 
          } else {
            this.router.navigate(['/game'], { queryParams: { name: user.name } });
          }
        } else {
          this.errorMessage = 'Credenciales incorrectas';
        }
      }, error => {
        this.errorMessage = 'Error de conexión con el servidor';
      });
  }
  
  
}
