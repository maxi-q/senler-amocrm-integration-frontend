import { memo, useEffect, useState } from 'react';
import EditableRow from './EditableRow';
import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/fields.dto';


export interface IDataRow {
  from: string;
  to: string;
}

interface IEditableTableProps {
  data: IDataRow[];
  changeData: (updatedData: IDataRow[]) => void;
  toFields: IAmoCRMField[] | ISenlerField[],
  fromFields: IAmoCRMField[] | ISenlerField[],
  type?: 'no-senler' | 'senler'
}

const EditableTable = memo(({ data = [], changeData, toFields, fromFields, type='senler' }: IEditableTableProps) => {
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
    setCurrentData((prevData) => {
      const newData = [
        ...prevData,
        { from: '', to: '' },
      ]
      changeData(newData)
      return newData
    });
  };

  const handleDeleteRow = (rowIndex: number) => {
    setCurrentData((prevData) => prevData.filter((_, index) => index !== rowIndex));
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      <div className='flex w-full justify-between items-center'>
        <h3>Передача значений</h3>
        <button
          onClick={handleAddRow}
          className="px-4 py-2 mt-2 bg-[#428BCA] text-white rounded-md hover:bg-[#025aa5] transition-colors duration-200"
        >
          Добавить
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
              type={type}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default EditableTable;
