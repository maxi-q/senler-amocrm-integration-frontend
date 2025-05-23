import { memo } from 'react';
import { IDataRow } from '.';
import MySelect, { MySelectOldV } from './SelectField';
import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/fields.dto';

import styles from './styles.module.css';

interface IEditableRowProps {
  row: IDataRow;
  rowIndex: number;
  onValueChange: (rowIndex: number, key: keyof IDataRow, newValue: string) => void;
  onDelete: (rowIndex: number) => void;
  toFields?: IAmoCRMField[] | ISenlerField[];
  fromFields?: IAmoCRMField[] | ISenlerField[];
  type: 'no-senler' | 'senler';
}

const EditableRow = memo(({ row, rowIndex, onValueChange, onDelete, toFields = [], fromFields = [], type='no-senler' }: IEditableRowProps) => {
  const getLabel = (field: IAmoCRMField | ISenlerField): string => {
    return field instanceof ISenlerField ? field.text : field.name;
  };

  const amoCRMFieldsOptions = toFields.map(field => ({ value: field.id, label: getLabel(field) }));
  const senlerFieldsOptions = fromFields.map(field => ({ value: field.id, label: getLabel(field) }));

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '12px' }}>
        <div>
          <label>{type == 'no-senler' ? "В Senler" : "В amoCRM"}</label>
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          style={{ width: "24px", height: "24px" }}
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
        </svg>
      </button>
    </div>
  );
});

export default EditableRow;