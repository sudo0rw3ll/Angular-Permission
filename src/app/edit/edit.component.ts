import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from '../model';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  userToEdit: any;
  permissions: Permission[];
  checked_buttons: Map<number, boolean> = new Map<number, boolean>();


  constructor(private router: Router) {
    this.permissions = [];

    const nav = this.router.getCurrentNavigation();

    if (nav && nav.extras.state) {
      this.userToEdit = nav.extras.state['data'];
      console.log('user ', this.userToEdit);

      for (let perm of this.userToEdit.permissions) {
        this.checked_buttons.set(perm.id, true);
      }

      console.log(this.checked_buttons);
    }
  }

  getPerm(id: number): Object {
    for (let permission of this.permissions) {
      if (permission.id === id) {
        return permission;
      }
    }

    return 0;
  }

  checkUpdate(): Boolean {
    if (this.userToEdit.email === "") {
      alert('Email cannot be empty!');
      return false;
    }

    if (this.userToEdit.first_name === "") {
      alert('First name cannot be empty!');
      return false;
    }

    if (this.userToEdit.last_name === "") {
      alert('Last name cannot be empty!');
      return false;
    }

    if (this.userToEdit.password === "") {
      alert('Password cannot be empty!');
      return false;
    }

    let can_update = false;

    this.checked_buttons.forEach((value, key) => {
      if (value === true) {
        can_update = true;
      }
    });

    return can_update;
  }

  async updateUser(): Promise<any> {
    let jwt = localStorage.getItem('jwtToken');

    let permsToWrite: any = [];
    let permsToDelete = [];
    let ids: any = [];

    this.checked_buttons.forEach((value, key) => {
      if (value === true) {
        permsToWrite.push(this.getPerm(key) as Permission);
      } else {
        ids.push(key);
      }
    });

    for (let perm of this.userToEdit.permissions) {
      for (let id of ids) {
        if (perm.id === id) {
          permsToDelete.push(this.getPerm(id) as Permission);
        }
      }
    }

    let data = {
      email: this.userToEdit.email,
      firstName: this.userToEdit.first_name,
      lastName: this.userToEdit.last_name,
      password: this.userToEdit.password,
      permissions: permsToWrite
    }

    console.log(data);

    let fetch_config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
    }

    for (let perm of permsToWrite) {
      await fetch(`http://localhost:8080/api/permissions/grant/${perm.id}/user/${this.userToEdit.id}`, fetch_config);
    }

    fetch_config['method'] = 'DELETE';

    for (let perm of permsToDelete) {
      await fetch(`http://localhost:8080/api/permissions/disable/${perm.id}/user/${this.userToEdit.id}`, fetch_config);
    }

    alert('User has been sucessfully updated!');

    this.router.navigateByUrl('/home');
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
  }

  setEmail(event: Event) {
    this.userToEdit.email = (<HTMLInputElement>event.target).value;
  }

  setFirstName(event: Event): void {
    this.userToEdit.first_name = (<HTMLInputElement>event.target).value;
  }


  setLastName(event: Event) {
    this.userToEdit.last_name = (<HTMLInputElement>event.target).value;
  }

  setPassword(event: Event) {
    this.userToEdit.password = (<HTMLInputElement>event.target).value;
  }

  checkButton(button: number) {
    this.checked_buttons.set(button, !this.checked_buttons.get(button));
    console.log(this.checked_buttons.get(button));
  }
}
