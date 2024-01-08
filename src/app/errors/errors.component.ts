import { Component, OnInit } from '@angular/core';
import { Error } from '../model';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {

  errors: Array<Error>;

  constructor() {
    this.errors = [];
  }

  ngOnInit(): void {
    this.fetchErrors();
  }


  async fetchErrors(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {

        let jwt = localStorage.getItem('jwtToken');

        let fetch_config = {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          },
        }

        const resp = await fetch('http://localhost:8080/api/errors/', fetch_config);
        const respJson = await resp.json();

        this.errors = respJson;

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}
