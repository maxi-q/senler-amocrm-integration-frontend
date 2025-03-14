import { memo, useEffect, useState } from 'react';
import EditableRow from './EditableRow';
import { IAmoCRMField } from '@/api/Backend/fields/fields.dto';
import { ISenlerField } from '../../modules/SendDataToSenler';

export interface IDataRow {
  from: string;
  to: string;
}

interface IEditableTableProps {
  data: IDataRow[];
  changeData: (updatedData: IDataRow[]) => void;
  toFields: IAmoCRMField[] | ISenlerField[],
  fromFields: IAmoCRMField[] | ISenlerField[],
}

const EditableTable = memo(({ data = [], changeData, toFields, fromFields }: IEditableTableProps) => {
  const [currentData, setCurrentData] = useState<IDataRow[]>(data);

  useEffect(() => {
    setCurrentData(data)
  }, [data])

  const handleValueChange = (rowIndex: number, key: keyof IDataRow, newValue: string) => {
    setCurrentData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [key]: newValue };
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
            <th>Откуда</th>
            <th>Куда</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentData?.map((row, rowIndex) => (
            <EditableRow
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              onValueChange={handleValueChange}
              onDelete={handleDeleteRow}
              toFields={toFields}
              fromFields={fromFields}
            />
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddRow}
        className="px-4 py-2 mt-2 bg-[#428BCA] text-white rounded-md hover:bg-[#025aa5] transition-colors duration-200"
      >
        Добавить соответствие
      </button>
    </div>
  );
});

export default EditableTable;
