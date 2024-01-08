import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';

type DateFormat = 'full' | 'long' | 'medium' | 'short';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) { }

  transform(value: number, format: DateFormat = 'medium'): string {
    if (!value) return '';

    const date = new Date(value * 1000);

    return new Intl.DateTimeFormat(this.locale, { dateStyle: format }).format(date);
  }

}
