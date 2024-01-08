import { Component, OnInit, ViewChild } from '@angular/core';
import { Vacuum, VacuumJob } from '../model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vacuums',
  templateUrl: './vacuums.component.html',
  styleUrls: ['./vacuums.component.css']
})
export class VacuumsComponent implements OnInit {
  @ViewChild('content') content: any;

  vacuumName: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  statuses: Array<string>;
  checkedStatuses: Map<string, boolean> = new Map<string, boolean>();
  vacuumCleaners: Array<Vacuum>;
  vacuumCleanerJobs: Array<VacuumJob>;
  vacuumId: number | undefined;
  vacuumCleanerJobDate: Date | null;
  vacuumCleanerJobDateUnix: number | undefined;
  closeResult = '';
  selectedVacuumCleanerId: number | undefined;

  constructor(private modalService: NgbModal) {
    this.vacuumName = '';
    this.dateFrom = null;
    this.dateTo = null
    this.vacuumCleanerJobDate = null;
    this.statuses = [];
    this.vacuumCleaners = [];
    this.vacuumCleanerJobs = [];
  }

  ngOnInit(): void {
    this.fetchVacuumCleaners();
    this.fetchVacuumCleanerJobs();
  }

  open() {
    this.modalService.open('content', { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
      }
    );
  }

  changeVacuumState(isStartChecked: boolean, isStopChecked: boolean, isDischargeChecked: boolean): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let action = '';

        if (isStartChecked) {
          action = 'START';
        }

        if (isStopChecked) {
          action = 'STOP';
        }

        if (isDischargeChecked) {
          action = 'DISCHARGE';
        }

        let jwt = localStorage.getItem('jwtToken');

        let fetch_config = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          },
        }
        console.log(action);
        const stateChange = await fetch(`http://localhost:8080/api/vacuums/${this.selectedVacuumCleanerId}/changeState?action=${action}`, fetch_config);

        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  openModal(vacuum_id: number) {
    this.selectedVacuumCleanerId = vacuum_id;
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
  }

  async fetchVacuumCleaners(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let jwt = localStorage.getItem('jwtToken');

        const params: Record<string, any> = {};

        if (this.vacuumName !== "") {
          params['name'] = this.vacuumName;
        }

        if (this.dateFrom !== null) {
          params['dateFrom'] = parseInt((this.dateFrom.getTime() / 1000).toFixed(0));
        }

        if (this.dateTo !== null) {
          params['dateTo'] = parseInt((this.dateTo.getTime() / 1000).toFixed(0));
        }

        const result = this.checkStatuses();

        if (result !== "") {
          params['statuses'] = result;
        }

        console.log(params['dateTo']);
        console.log(params['dateFrom']);

        let fetch_config = {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          },
        }

        console.log(new URLSearchParams(params));

        const resp = await fetch('http://localhost:8080/api/vacuums/search/?' + new URLSearchParams(params), fetch_config);
        const fetchRes = await resp.json();

        console.log(fetchRes);

        this.vacuumCleaners = fetchRes;

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async fetchVacuumCleanerJobs(): Promise<boolean> {
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

        const resp = await fetch('http://localhost:8080/api/jobs/', fetch_config);
        const res = await resp.json();

        this.vacuumCleanerJobs = res;

        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  };

  async removeVacuum(vacuum_id: number): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let jwt = localStorage.getItem('jwtToken');

        let fetch_config = {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          },
        }

        const res = await fetch(`http://localhost:8080/api/vacuums/${vacuum_id}`, fetch_config);
        this.fetchVacuumCleaners();
        resolve(true);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  async createVacuumJob(isStart: boolean, isStop: boolean, isDischarge: boolean): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        let jwt = localStorage.getItem('jwtToken');

        let actionP = '';

        if (isStart) {
          actionP = 'RUNNING';
        }

        if (isStop) {
          actionP = 'STOPPED';
        }

        if (isDischarge) {
          actionP = 'DISCHARGED';
        }

        let obj = {
          vacuum_id: this.vacuumId,
          is_active: 1,
          action: actionP,
          time: this.vacuumCleanerJobDateUnix
        }

        let fetch_config = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          },
          body: JSON.stringify(obj)
        }

        const resp = await fetch('http://localhost:8080/api/jobs/create', fetch_config);

        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  setVacuumName(event: Event): void {
    this.vacuumName = (<HTMLInputElement>event.target).value;
  }

  setDateFrom(event: Event): void {
    this.dateFrom = new Date((<HTMLInputElement>event.target).value);
    console.log(this.dateFrom);
  }

  setDateTo(event: Event): void {
    this.dateTo = new Date((<HTMLInputElement>event.target).value);
    console.log(this.dateTo);
  }

  setVacuumJobId(event: Event): void {
    this.vacuumId = Number.parseInt((<HTMLInputElement>event.target).value);
  }

  setVacuumJobDate(event: Event): void {
    this.vacuumCleanerJobDate = new Date((<HTMLInputElement>event.target).value);
    this.vacuumCleanerJobDateUnix = parseInt((this.vacuumCleanerJobDate.getTime() / 1000).toFixed(0));
  }

  checkStatus(name: string): void {
    this.checkedStatuses.set(name, !this.checkedStatuses.get(name));
  }

  checkStatuses(): string {
    const resultString = Array.from(this.checkedStatuses.entries())
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key)
      .join(', ');

    return resultString;
  }
}
