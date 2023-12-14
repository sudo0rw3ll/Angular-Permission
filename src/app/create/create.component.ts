import { Component, OnInit } from '@angular/core';
import { Permission } from '../model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  permissions: Permission[];
  checked_buttons: Map<number, boolean> = new Map<number, boolean>();
  email: string;
  first_name: string;
  last_name: string;
  password: string;

  constructor() {
    this.permissions = [];
    this.email = "";
    this.first_name = "";
    this.last_name = "";
    this.password = "";
  }

  async creatUserAndGrantPerms(): Promise<Boolean> {
    return new Promise<Boolean>(async (resolve, reject) => {
      let jwt = localStorage.getItem('jwtToken');

      const userId = await this.createUser();

      try {
        this.checked_buttons.forEach(async (value, key) => {
          if (value === true) {
            let fetch_config = {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
              },
            }

            await fetch(`http://localhost:8080/api/permissions/grant/${key}/user/${userId}`, fetch_config);
          }
        });
        resolve(true);
        alert('User added successfully!');
      } catch (error) {
        reject(false);
      }
    });
  }

  async createUser(): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (this.checkFields()) {
          let jwt = localStorage.getItem('jwtToken');

          let req_params = {
            email: this.email,
            password: this.password,
            firstName: this.first_name,
            lastName: this.last_name
          }

          let fetch_config = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify(req_params)
          }

          const auth_response = await fetch("http://localhost:8080/api/users/", fetch_config);
          const result = await auth_response.json();

          resolve(result.id);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  checkFields(): Boolean {
    if (this.email === "") {
      return false;
    }

    if (this.first_name === "") {
      return false;
    }

    if (this.last_name === "") {
      return false;
    }

    if (this.password === "") {
      return false;
    }

    let can_create = false;

    this.checked_buttons.forEach((value, key) => {
      if (value === true) {
        can_create = true;
      }
    });

    return can_create;
  }

  setEmail(event: Event): void {
    this.email = (<HTMLInputElement>event.target).value;
  }

  setFirstName(event: Event): void {
    this.first_name = (<HTMLInputElement>event.target).value;
  }

  setLastName(event: Event): void {
    this.last_name = (<HTMLInputElement>event.target).value;
  }

  setPassword(event: Event): void {
    this.password = (<HTMLInputElement>event.target).value;
  }

  async ngOnInit(): Promise<any> {
    const req_headers = {
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json'
    }

    const fetch_config: RequestInit = {
      method: 'GET',
      headers: req_headers
    }

    let perms_resp = await fetch("http://localhost:8080/api/permissions/", fetch_config);
    let perms_result = await perms_resp.json();

    this.permissions = perms_result;

    for (let permission of this.permissions) {
      this.checked_buttons.set(permission.id, false);
    }

    console.log(this.permissions);
  }

  checkButton(button: number) {
    this.checked_buttons.set(button, !this.checked_buttons.get(button));
    console.log(this.checked_buttons.get(button));
  }
}
