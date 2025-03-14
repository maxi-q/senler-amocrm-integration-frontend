import { memo } from 'react';
import { IDataRow } from '.';
import MySelect from './SelectField';
import { IAmoCRMField } from '@/api/Backend/fields/fields.dto';
import { ISenlerField } from '../../modules/SendDataToAmoCrm/SendDataToAmoCrm.dto';

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
          X
        </button>
      </td>
    </tr>
  );
});

export default EditableRow;