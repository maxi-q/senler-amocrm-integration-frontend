import React, { useState } from 'react';

interface IDataRow {
  id1: string;
  id2: string;
}

interface IEditableTableProps {
  data: IDataRow[];
  changeData: (updatedData: IDataRow[]) => void;
}

const EditableTable = ({ data, changeData }: IEditableTableProps) => {
  const [currentData, setCurrentData] = useState<IDataRow[]>(data);

  const handleValueChange = (rowIndex: number, key: keyof IDataRow, newValue: string) => {
    setCurrentData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [key]: newValue };
      return updatedData;
    });
  };

  const handleSave = () => {
    changeData(currentData);
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>ID1</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>ID2</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                <input
                  type="text"
                  value={row.id1}
                  onChange={(e) => handleValueChange(rowIndex, 'id1', e.target.value)}
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
                  value={row.id2}
                  onChange={(e) => handleValueChange(rowIndex, 'id2', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditableTable;
