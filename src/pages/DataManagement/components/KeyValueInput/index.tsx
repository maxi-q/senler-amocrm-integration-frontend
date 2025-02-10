import { useEffect, useState } from 'react';
import EditableRow from './EditableRow';
import { IAmoCRMField } from '@/api/Backend/fields';
import { ISenlerField } from '../../modules/SendDataToAmoCrm';

export interface IDataRow {
  from: string;
  to: string;
}

interface IEditableTableProps {
  data: IDataRow[];
  changeData: (updatedData: IDataRow[]) => void;
  amoCRMFields: IAmoCRMField[],
  senlerFields: ISenlerField[]
}

const EditableTable = ({ data = [], changeData, amoCRMFields, senlerFields }: IEditableTableProps) => {
  const [currentData, setCurrentData] = useState<IDataRow[]>(data);

  useEffect(() => {
    console.log('data', data)
    console.log('currentData', currentData)
  }, [data, currentData])

  const handleValueChange = (rowIndex: number, key: keyof IDataRow, newValue: string) => {
    setCurrentData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [+key]: newValue };
      changeData(updatedData);
      return updatedData;
    });
  };

  const handleAddRow = () => {
    setCurrentData((prevData) => [
      ...prevData,
      { from: '', to: '' },
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
            <th>from</th>
            <th>to</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <EditableRow
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              onValueChange={handleValueChange}
              onDelete={handleDeleteRow}
              amoCRMFields={amoCRMFields}
              senlerFields={senlerFields}
            />
          ))}
        </tbody>
      </table>
      <button onClick={handleAddRow}>Add Row</button>
    </div>
  );
};

export default EditableTable;
