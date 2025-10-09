import { IDataRow } from '.';
import MySelect, { MySelectOldV } from './SelectField';
import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/fields.dto';

import styles from './styles.module.css';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IEditableRowProps {
  row: IDataRow;
  rowIndex: number;
  onValueChange: (rowIndex: number, key: keyof IDataRow, newValue: string) => void;
  onDelete: (rowIndex: number) => void;
  toFields?: IAmoCRMField[] | ISenlerField[];
  fromFields?: IAmoCRMField[] | ISenlerField[];
  type: 'no-senler' | 'senler';
}

const EditableRow = ({ row, rowIndex, onValueChange, onDelete, toFields = [], fromFields = [], type='no-senler' }: IEditableRowProps) => {
  const getLabel = (field: IAmoCRMField | ISenlerField): string => {
    return field instanceof ISenlerField ? field.text : field.name;
  };

  const amoCRMFieldsOptions = toFields.map(field => ({ value: field.id, label: getLabel(field) }));
  const senlerFieldsOptions = fromFields.map(field => ({ value: field.id, label: getLabel(field) }));

  useEffect(()=>{
    console.log('EditableRow', row)
  }, [row])

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '12px' }}>
        <div>
          <label>{type == 'no-senler' ? "В переменную Senler" : "В переменную amoCRM"}</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <MySelectOldV
              value={row.to}
              rowIndex={rowIndex}
              onValueChange={onValueChange}
              options={amoCRMFieldsOptions}
              sourceKey="to"
              type={type}
            />
          </div>
        </div>

        <div>
          <label>{type == 'no-senler' ? "Из amoCRM" : "Из Senler"}</label>
          <MySelect
            value={row.from}
            rowIndex={rowIndex}
            onValueChange={onValueChange}
            options={senlerFieldsOptions}
            sourceKey="from"
            type={type}
          />
        </div>
      </div>

      <button
        onClick={() => onDelete(rowIndex)}
        className={styles['delete-button']}
        title="Удалить строку"
        style={{ marginTop: '28px' }}
      >
        <FontAwesomeIcon icon={'trash'} className="text-danger"/>
      </button>
    </div>
  );
};

export default EditableRow;