import { IDataRow } from '.';
import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/workspaceInfo.dto';

export const getDuplicateToValues = (data: IDataRow[]): Set<string> => {
  const toValues = data.map(row => row.to).filter(to => to !== '');
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
  return fields.some(field => field.id === value);
};

export const hasDataValidationErrors = (
  data: IDataRow[],
  toFields?: IAmoCRMField[] | ISenlerField[]
): boolean => {
  const duplicates = getDuplicateToValues(data);
  if (duplicates.size > 0) return true;

  if (toFields && toFields.length > 0) {
    const hasInvalidTo = data.some(row => row.to && !isValueInFields(row.to, toFields));
    if (hasInvalidTo) return true;
  }

  return false;
};
