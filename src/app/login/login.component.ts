import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Add your CSS file if needed
})
export class LoginComponent implements OnInit {

  username: string;
  password: string

  constructor(private router: Router) {
    this.username = "";
    this.password = "";
  }

  ngOnInit(): void {

  }

  async login(): Promise<any> {
    if (this.username === "" || this.password === "") {
      alert('Username or password cannot be blank');
      return;
    }

    let req_params = {
      email: this.username,
      password: this.password
    }

    let fetch_config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req_params)
    }

    const auth_response = await fetch("http://localhost:8080/auth/login", fetch_config);
    const result = await auth_response.json();

    if (!result['token']) {
      alert('Login is not successfull');
      return;
    }

    alert('Login successfull');

    let roles = JSON.parse(window.atob(result['token'].split('.')[1]))['roles'];

    if (!roles) {
      alert('No permissions granted');
      return;
    }

    localStorage.setItem('jwtToken', result['token']);
    localStorage.setItem('roles', roles);

    this.router.navigateByUrl('/home');
  }

  setUsername(event: Event): void {
    this.username = (<HTMLInputElement>event.target).value;
  }

  setPassword(event: Event): void {
    this.password = (<HTMLInputElement>event.target).value;
  }
}