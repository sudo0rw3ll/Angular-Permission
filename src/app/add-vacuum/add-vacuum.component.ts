import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-vacuum',
  templateUrl: './add-vacuum.component.html',
  styleUrls: ['./add-vacuum.component.css']
})
export class AddVacuumComponent implements OnInit {

  vacuumName: string;

  constructor() {
    this.vacuumName = '';
  }

  ngOnInit(): void {

  }

  setVacuumName(event: Event): void {
    this.vacuumName = (<HTMLInputElement>event.target).value;
  }

  async createVacuumCleaner(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try { 
        let jwt = localStorage.getItem('jwtToken');

        let fetch_config = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          },
        }

        const res = await fetch(`http://localhost:8080/api/vacuums/create?vacuumName=${this.vacuumName}`, fetch_config);

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

}
