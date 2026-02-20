import { memo, useEffect, useMemo, useState } from 'react';
import EditableRow from './EditableRow';
import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/workspaceInfo.dto';
import { getDuplicateToValues, isValueInFields } from './helpers';


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

const EditableTable = memo(({ data, changeData, toFields, fromFields, type='senler' }: IEditableTableProps) => {
  const [currentData, setCurrentData] = useState<IDataRow[]>(data);

  const duplicateToValues = useMemo(() => getDuplicateToValues(currentData), [currentData]);

  useEffect(() => {
    setCurrentData(data)
  }, [data])

  useEffect(() => {
    if (currentData !== data) {
      changeData(currentData);
    }
  }, [currentData]);

  const handleValueChange = (rowIndex: number, key: keyof IDataRow, newValue: string) => {
    setCurrentData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [key]: newValue };
      return updatedData;
    });
  };

  const handleAddRow = () => {
    setCurrentData((prevData) => {
      const newData = [
        ...(prevData || []),
        { from: '', to: '' },
      ];
      return newData;
    });
  };

  const handleDeleteRow = (rowIndex: number) => {
    setCurrentData((prevData) => {
      const newData = prevData.filter((_, index) => index !== rowIndex)
      changeData(newData)
      return newData
    });
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      <div className='flex w-full justify-between items-center'>
        <div className='text-start'>
          <h3>Передача значений</h3>
          <p className="mt-1 text-[0.7rem]">Максимум 2000 символов ⚠️ подробнее в <a className='text-blue-700 hover:text-blue-800 underline' href='https://help.senler.ru/senler/kanaly/vkontakte/integracii/integraciya-s-amocrm'>документации</a></p>
        </div>

        <button
          onClick={handleAddRow}
          className="px-4 py-2 mt-2 bg-[#428BCA] hover:bg-[#025aa5] text-white rounded-md  transition-colors duration-200"
        >
          Добавить
        </button>
      </div>
      <div style={{ width: '100%', borderCollapse: 'collapse' }}>
        <div>
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
              isDuplicateTo={row.to !== '' && duplicateToValues.has(row.to)}
              isInvalidTo={!isValueInFields(row.to, toFields)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default EditableTable;
