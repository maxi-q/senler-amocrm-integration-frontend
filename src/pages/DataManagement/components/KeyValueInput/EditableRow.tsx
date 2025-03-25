import { memo } from 'react';
import { IDataRow } from '.';
import MySelect from './SelectField';
import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/fields.dto';

import styles from './styles.module.css'

interface IEditableRowProps {
  row: IDataRow;
  rowIndex: number;
  onValueChange: (rowIndex: number, key: keyof IDataRow, newValue: string) => void;
  onDelete: (rowIndex: number) => void;
  toFields?: IAmoCRMField[] | ISenlerField[];
  fromFields?: IAmoCRMField[] | ISenlerField[];
}

const EditableRow = memo(({ row, rowIndex, onValueChange, onDelete, toFields = [], fromFields = [] }: IEditableRowProps) => {
  const getLabel = (field: IAmoCRMField | ISenlerField): string => {
    return field instanceof ISenlerField ? field.text : field.name;
  };

  const amoCRMFieldsOptions = toFields.map(field => ({ value: field.id, label: getLabel(field) }));
  const senlerFieldsOptions = fromFields.map(field => ({ value: field.id, label: getLabel(field) }));

  return (
    <tr className='my-2'>
      <td className='w-[47%]'>
        <MySelect
          value={row.from}
          rowIndex={rowIndex}
          onValueChange={onValueChange}
          options={senlerFieldsOptions}
          sourceKey="from"
        />
      </td>
      <td className='w-[47%]'>
        <MySelect
          value={row.to}
          rowIndex={rowIndex}
          onValueChange={onValueChange}
          options={amoCRMFieldsOptions}
          sourceKey="to"
        />
      </td>
      <td className='w-[6%]'>
        <button
          onClick={() => onDelete(rowIndex)}
          className={styles['delete-button']}
          title="Удалить строку"
        >
          <svg style={{width: "24px", height: "24px"}} viewBox="0 0 24 24">
            <path fill='#fff' d="M8 4v-2h8v2h5v2h-18v-2h5zm-3 16v-14h14v14q0 1.25-.875 2.125t-2.125.875h-8q-1.25 0-2.125-.875t-.875-2.125zm2-2h10v-12h-10v12z"/>
          </svg>
        </button>
      </td>
    </tr>
  );
});

export default EditableRow;