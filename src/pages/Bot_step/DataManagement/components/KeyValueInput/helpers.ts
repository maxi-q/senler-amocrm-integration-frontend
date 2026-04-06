import { IDataRow } from '.';
import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/workspaceInfo.dto';

export const getDuplicateToValues = (data: IDataRow[] | undefined): Set<string> => {
  const rows = data ?? [];
  const toValues = rows.map(row => row.to).filter(to => to !== '');
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of toValues) {
    if (seen.has(value)) {
      duplicates.add(value);
    } else {
      seen.add(value);
    }
  }

  return duplicates;
};

export const isValueInFields = (value: string, fields: IAmoCRMField[] | ISenlerField[]): boolean => {
  if (!value) return true;
  return fields.some(field => ''+field.id === value);
};

export const hasDataValidationErrors = (
  data: IDataRow[] | undefined,
  toFields?: IAmoCRMField[] | ISenlerField[]
): boolean => {
  const rows = data ?? [];
  const duplicates = getDuplicateToValues(rows);
  if (duplicates.size > 0) return true;

  if (toFields && toFields.length > 0) {
    const hasInvalidTo = rows.some(row => row.to && !isValueInFields(row.to, toFields));
    if (hasInvalidTo) return true;
  }

  return false;
};
