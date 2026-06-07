import { Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MikaEntityConfig, MikaFieldConfig } from '@mikaverse/core';

@Injectable({ providedIn: 'root' })
export class MikaFormContextService {
  form!: FormGroup;
  config!: MikaEntityConfig;
  selectedTab = signal('main');

  setContext(config: MikaEntityConfig, form: FormGroup) {
    this.config = config;
    this.form = form;
  }

  get groupedFields(): Array<{ key: string; fields: MikaFieldConfig[] }> {
    const groups: Record<string, MikaFieldConfig[]> = {};
    for (const field of this.config?.form?.fields ?? []) {
      const groupKey = field.group || 'General';
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(field);
    }
    return Object.entries(groups).map(([key, fields]) => ({ key, fields }));
  }
}
