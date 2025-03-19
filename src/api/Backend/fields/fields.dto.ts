export class IAmoCRMField {
  id: string;
  name: string;
  type: string;
  account_id: number;
  code: string;
  sort: number | null;
  is_api_only: boolean;
  enums: null;
  group_id: string;
  required_statuses: Array<string>;
  is_deletable: boolean;
  is_predefined: boolean;
  entity_type: string;
  tracking_callback: null;
  remind: null;
  triggers: Array<string>;
  currency: null;
  hidden_statuses: Array<string>;
  chained_lists: null;
  _links: {
      self: {
          href: string;
      };
  };

  constructor(data: {
    id: string;
    name: string;
    type: string;
    account_id: number;
    code: string;
    sort?: number | null;
    is_api_only: boolean;
    enums?: null;
    group_id: string;
    required_statuses: Array<string>;
    is_deletable: boolean;
    is_predefined: boolean;
    entity_type: string;
    tracking_callback?: null;
    remind?: null;
    triggers: Array<string>;
    currency?: null;
    hidden_statuses: Array<string>;
    chained_lists?: null;
    _links: {
        self: {
            href: string;
        };
    };
  }) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.account_id = data.account_id;
    this.code = data.code;
    this.sort = data.sort ?? null;
    this.is_api_only = data.is_api_only;
    this.enums = data.enums ?? null;
    this.group_id = data.group_id;
    this.required_statuses = data.required_statuses;
    this.is_deletable = data.is_deletable;
    this.is_predefined = data.is_predefined;
    this.entity_type = data.entity_type;
    this.tracking_callback = data.tracking_callback ?? null;
    this.remind = data.remind ?? null;
    this.triggers = data.triggers;
    this.currency = data.currency ?? null;
    this.hidden_statuses = data.hidden_statuses;
    this.chained_lists = data.chained_lists ?? null;
    this._links = data._links;
  }
}

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
    selected?: boolean;
    disabled?: boolean;
  }) {
    this.id = data.id;
    this.text = data.text;
    this.contain = data.contain;
    this.selected = data.selected ?? false;
    this.disabled = data.disabled ?? false;
  }
}
