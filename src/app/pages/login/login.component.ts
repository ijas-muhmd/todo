import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import exp from 'constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj: Login;

  constructor(private http: HttpClient) {
    this.loginObj = new Login();
  }

  onLogin() {
    debugger;
    this.http.post('https://todo-app-iota-three-31.vercel.app/token', this.loginObj).subscribe((res:any)=>{
      if(res.token_type === 'bearer'){
        alert('login Success');
        localStorage.setItem('loginToken', res.access_token);
      } else {
        alert(res.detail);
      }
    })
  }
}

export class Login {
  Emailid: string;
  Password: string;
  constructor() {
    this.Emailid = '';
    this.Password = '';
  }
}
