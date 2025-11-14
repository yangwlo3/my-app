import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'search', standalone: true })
export class SearchPipe implements PipeTransform {
  transform(items: any[], query: string, fields: string[]): any[] {
    if (!items || !query) return items;
    const lower = query.toLowerCase();
    return items.filter(item =>
      fields.some(f => item[f]?.toString().toLowerCase().includes(lower))
    );
  }
}
