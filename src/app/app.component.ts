import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  username: string;
  password: string

  constructor() {
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
    console.log(result);
  }
}
