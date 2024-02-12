import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import exp from 'constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj: Login;

  constructor(private http: HttpClient, private router: Router) {
    this.loginObj = new Login();
  }

  onLogin() {
    const formData = new FormData();
    formData.append('username', this.loginObj.email);
    formData.append('password', this.loginObj.hashed_password);

    this.http.post('https://todo-app-iota-three-31.vercel.app/token', formData).subscribe((res:any)=>{
      if(res.token_type === 'bearer'){
        alert('login Success');
        localStorage.setItem('loginToken', res.access_token);
        this.router.navigateByUrl('/todo');
      } else {
        alert(res.detail);
      }
    })
  }

  onRegister() {
    debugger;
    this.http.post('https://todo-app-iota-three-31.vercel.app/register', this.loginObj).subscribe((res:any)=>{
      console.log(res)
      if(res.message === 'User created successfully'){
        alert('Registration Success');
        this.router.navigateByUrl('/login');
      } else {
        alert(res.detail);
      }
    })
  }
}

export class Login {
  email: string;
  hashed_password: string;
  constructor() {
    this.email = '';
    this.hashed_password = '';
  }
}
