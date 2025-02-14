import { memo } from 'react';
import { IDataRow } from '.';
import { IAmoCRMField } from '@/api/Backend/fields';
import { ISenlerField } from '../../modules/SendDataToAmoCrm';
import MySelect from './SelectField';

interface IEditableRowProps {
  row: IDataRow;
  rowIndex: number;
  onValueChange: (rowIndex: number, key: keyof IDataRow, newValue: string) => void;
  onDelete: (rowIndex: number) => void;
  toFields?: IAmoCRMField[] | ISenlerField[],
  fromFields?: IAmoCRMField[] | ISenlerField[],
}

const EditableRow = memo(({ row, rowIndex, onValueChange, onDelete, toFields = [], fromFields = [] }: IEditableRowProps) => {
  const label = (field: IAmoCRMField | ISenlerField) => field instanceof IAmoCRMField ? field.name : field.text
  console.log(label(toFields[0]), toFields[0] instanceof IAmoCRMField)
  const amoCRMFieldsOptions = toFields?.map(field => ({ value: field.id, label: label(field) }))
  const senlerFieldsOptions = fromFields?.map(field => ({ value: field.id, label: label(field) }))

  return (
    <tr>
      <td>
        <MySelect value={row.from} rowIndex={rowIndex} onValueChange={onValueChange} options={senlerFieldsOptions} label='Senler' sourceKey='from'/>
      </td>
      <td>
        <MySelect value={row.to} rowIndex={rowIndex} onValueChange={onValueChange} options={amoCRMFieldsOptions} label='AmoCRM' sourceKey='to'/>
      </td>
      <td>
        <button
          onClick={() => onDelete(rowIndex)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Удалить строку"
        >
          X
        </button>
      </td>
    </tr>
  );
});

export default EditableRow;
