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
          fill="currentColor"
        >
          <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
        </svg>
      </button>
    </div>
  );
});

export default EditableRow;