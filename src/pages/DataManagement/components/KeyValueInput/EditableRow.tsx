import { memo } from 'react';
import { IDataRow } from '.';

interface IEditableRowProps {
  row: IDataRow;
  rowIndex: number;
  onValueChange: (rowIndex: number, key: keyof IDataRow, newValue: string) => void;
  onDelete: (rowIndex: number) => void;
}

const EditableRow = memo(({ row, rowIndex, onValueChange, onDelete }: IEditableRowProps) => {
  return (
    <tr>
      <td>
        <input
          type="text"
          value={row.from}
          onChange={(e) => onValueChange(rowIndex, 'from', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </td>
      <td>
        <input
          type="text"
          value={row.to}
          onChange={(e) => onValueChange(rowIndex, 'to', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
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
