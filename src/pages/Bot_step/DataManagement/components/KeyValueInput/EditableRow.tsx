import { IDataRow } from '.';
import MySelect, { MySelectOldV } from './SelectField';
import { IAmoCRMField, ISenlerField } from '@/api/Backend/fields/workspaceInfo.dto';

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
  isDuplicateTo?: boolean;
  isInvalidTo?: boolean;
}

const EditableRow = ({
    row,
    rowIndex,
    onValueChange,
    onDelete,
    toFields = [],
    fromFields = [],
    type='no-senler',
    isDuplicateTo = false,
    isInvalidTo = false
  }: IEditableRowProps) => {
  const getLabel = (field: IAmoCRMField | ISenlerField): string => {
    return field instanceof ISenlerField ? field.text : field.name;
  };

  const amoCRMFieldsOptions = toFields.map(field => ({ value: ''+field.id, label: getLabel(field) }));
  const senlerFieldsOptions = fromFields.map(field => ({ value: ''+field.id, label: getLabel(field) }));

  useEffect(()=>{
    console.log('EditableRow', row)
  }, [row])

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col flex-grow gap-3">
        <div>
          <label>{type == 'no-senler' ? "В переменную Senler" : "В переменную amoCRM"}</label>
          <div className="flex gap-2 mt-1">
            <div className={`flex-1 ${(isDuplicateTo || isInvalidTo) ? styles['error-field'] : ''}`}>
              <MySelectOldV
                value={row.to}
                rowIndex={rowIndex}
                onValueChange={onValueChange}
                options={amoCRMFieldsOptions}
                sourceKey="to"
                type={type}
              />
              {isInvalidTo && (
                <span className="block text-[#ff4d4f] text-xs mt-1">Выбранное поле не найдено в списке доступных</span>
              )}
              {isDuplicateTo && !isInvalidTo && (
                <span className="block text-[#ff4d4f] text-xs mt-1">Это поле уже выбрано в другой строке</span>
              )}
            </div>
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
        className="px-2.5 py-2 bg-[#428BCA] hover:bg-[#025aa5] text-white border-none rounded cursor-pointer mt-7"
        title="Удалить строку"
      >
        <FontAwesomeIcon icon={'trash'} className="text-danger"/>
      </button>
    </div>
  );
};

export default EditableRow;