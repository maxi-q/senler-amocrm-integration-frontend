import { useState } from 'react';

export interface IDataRow {
  from: string;
  to: string;
}

interface IEditableTableProps {
  data: IDataRow[];
  changeData: (updatedData: IDataRow[]) => void;
}

const EditableTable = ({ data = [], changeData }: IEditableTableProps) => {
  const [currentData, setCurrentData] = useState<IDataRow[]>(data);

  const handleValueChange = (rowIndex: number, key: keyof IDataRow, newValue: string) => {
    setCurrentData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [key]: newValue };
      changeData(updatedData);
      return updatedData;
    });
  };

  const handleAddRow = () => {
    setCurrentData(prevData => [
      ...prevData,
      {
        from: '',
        to: '',
      }
    ]);
  };

  const handleDeleteRow = (rowIndex: number) => {
    setCurrentData((prevData) => prevData.filter((_, index) => index !== rowIndex));
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>from</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>to</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                <input
                  type="text"
                  value={row.from}
                  onChange={(e) => handleValueChange(rowIndex, 'from', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                <input
                  type="text"
                  value={row.to}
                  onChange={(e) => handleValueChange(rowIndex, 'to', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>
                <button
                  onClick={() => handleDeleteRow(rowIndex)}
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
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleAddRow}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add Row
        </button>
      </div>
    </div>
  );
};

export default EditableTable;
