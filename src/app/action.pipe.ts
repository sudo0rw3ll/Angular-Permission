import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'action'
})
export class ActionPipe implements PipeTransform {

  transform(value: string): string {
    if (value === "RUNNING") {
      return "RUN";
    }

    if (value === "STOPPED") {
      return "STOP";
    }

    if (value === "DISCHARGING") {
      return "DISCHARGE";
    }

    return "";
  }

}
