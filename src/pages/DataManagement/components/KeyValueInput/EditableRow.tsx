// import { memo } from 'react';
import { IDataRow } from '.';
import { IAmoCRMField } from '@/api/Backend/fields';
import { ISenlerField } from '../../modules/SendDataToAmoCrm';
// import MySelect from './SelectField';

interface IEditableRowProps {
  row: IDataRow;
  rowIndex: number;
  onValueChange: (rowIndex: number, key: keyof IDataRow, newValue: string) => void;
  onDelete: (rowIndex: number) => void;
  amoCRMFields?: IAmoCRMField[]
  senlerFields?: ISenlerField[]
}

const EditableRow = (({ row, rowIndex, onValueChange, onDelete, amoCRMFields = [], senlerFields = [] }: IEditableRowProps) => {
  console.log('amoCRMFields', amoCRMFields, senlerFields)
  const amoCRMFieldsOptions = amoCRMFields?.map(field => ({ value: field.id, label: field.name }))
  const senlerFieldsOptions = senlerFields?.map(field => ({ value: field.id, label: field.text }))
  console.log(amoCRMFieldsOptions, senlerFieldsOptions, row, onValueChange)
  return (
    <tr>
      {/* <td>
        <MySelect value={row.from} rowIndex={rowIndex} onValueChange={onValueChange} options={amoCRMFieldsOptions} label='Senler' sourceKey='from'/>
      </td>
      <td>
        <MySelect value={row.to} rowIndex={rowIndex} onValueChange={onValueChange} options={senlerFieldsOptions} label='AmoCRM' sourceKey='to'/>
      </td> */}
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
