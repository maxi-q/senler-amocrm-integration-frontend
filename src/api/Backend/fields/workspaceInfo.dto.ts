export class IAmoCRMField {
  id: number;
  name: string;
  type: string;
  is_api_only: boolean;

  constructor(data: {
    id: number;
    name: string;
    type: string;
    is_api_only: boolean;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.is_api_only = data.is_api_only;
  }
}

export class IAmoCRMStatus {
  id: number;
  name: string;

  constructor(data: {
    id: number;
    name: string;
  }) {
    this.id = data.id;
    this.name = data.name;
  }
}

export class IAmoCRMPipeline {
  id: number;
  name: string;
  statuses: Array<IAmoCRMStatus>;

  constructor(data: {
    id: number;
    name: string;
    statuses: Array<IAmoCRMStatus>;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.statuses = data.statuses.map(status => new IAmoCRMStatus(status));
  }
}

export class IAmoCRMUser {
  id: number;
  name: string;

  constructor(data: {
    id: number;
    name: string;
  }) {
    this.id = data.id;
    this.name = data.name;
  }
}

export class IAmoCRMFullResponse {
  fields: Array<IAmoCRMField>;
  pipelines: Array<IAmoCRMPipeline>;
  users: Array<IAmoCRMUser>;

  constructor(data: {
    fields: Array<IAmoCRMField>;
    pipelines: Array<IAmoCRMPipeline>;
    users: Array<IAmoCRMUser>;
  }) {
    this.fields = data.fields.map(field => new IAmoCRMField(field));
    this.pipelines = data.pipelines.map(pipeline => new IAmoCRMPipeline(pipeline));
    this.users = data.users.map(user => new IAmoCRMUser(user));
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

export interface IApiError {
  name: string;
  code: number;
  message: string;
}

export interface IApiErrorResponse {
  error: IApiError;
}
