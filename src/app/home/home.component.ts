import { Component, OnInit } from '@angular/core';
import { User } from '../model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  users: User[];
  roles: string;

  constructor(private router: Router) {
    this.users = [];
    this.roles = localStorage.getItem('roles')!;
  }

  onItemSelected(selectedItem: any) {
    this.router.navigate(['/edit'], { state: { data: selectedItem } });
  }

  async deleteItem(index: number) {
    let jwt = localStorage.getItem('jwtToken');

    let fetch_config = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
    }

    const resp = await fetch(`http://localhost:8080/api/users/${this.users.at(index)?.id}`, fetch_config);

    if (resp.status === 200) {
      this.users.splice(index, 1);
      alert('User deleted!');
    } else {
      alert('You cannot delete user!');
    }
  }

  logout(): void {
    localStorage.setItem('jwtToken', '');
    this.router.navigateByUrl('');
  }

  async ngOnInit(): Promise<any> {
    if (this.roles === "") {
      return;
    }

    if (!this.roles.includes('can_read_users')) {
      return;
    }

    let jwt = localStorage.getItem('jwtToken');

    const req_headers = {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    }

    const fetch_config: RequestInit = {
      method: 'GET',
      headers: req_headers
    }

    const users_resp = await fetch('http://localhost:8080/api/users/', fetch_config);
    const result = await users_resp.json();

    this.users = result;

    console.log(this.users);
  }

  checkRole(): Boolean {
    return this.roles.includes('can_read_users');
  }

  checkDelete(): Boolean {
    return this.roles.includes('can_delete_users');
  }
}
