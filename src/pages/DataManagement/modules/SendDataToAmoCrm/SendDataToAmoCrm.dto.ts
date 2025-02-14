export class ISenlerField {
  id: string;
  text: string;
  contain: string;
  selected: boolean;
  disabled: boolean;

  constructor(data: {
    id: string;
    text: string;
    contain: string;
    selected?: boolean; // Опциональный параметр
    disabled?: boolean; // Опциональный параметр
  }) {
    this.id = data.id;
    this.text = data.text;
    this.contain = data.contain;
    this.selected = data.selected ?? false; // Значение по умолчанию false, если не передано
    this.disabled = data.disabled ?? false; // Значение по умолчанию false, если не передано
  }
}