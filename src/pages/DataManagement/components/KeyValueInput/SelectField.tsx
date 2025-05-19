import { IDataRow } from '.';
import { MessageEditor } from '../../modules/AmoCRM/components/VariablesModal';

interface MySelectProps {
  value: string;
  label?: string;
  rowIndex: number;
  onValueChange: (rowIndex: number, key: keyof IDataRow, newValue: string) => void;
  sourceKey: keyof IDataRow;
  options?: {
    value: string;
    label: string;
  }[];
  type: 'senler' | 'no-senler'
}

const MySelect = ({ value, rowIndex, onValueChange, options, sourceKey, type}: MySelectProps) => {
  options = options?.map(el => ({...el, value: `%${el.value}%`}));
  return (
    <div>
      <MessageEditor type={type} options={options} initialContent={value} onContentChange={(content) => onValueChange(rowIndex, sourceKey, content)} />
    </div>
  );
};

export const MySelectOldV = ({ value, rowIndex, onValueChange, options, sourceKey }: MySelectProps) => {
  const isLoad = Boolean(options);

  return (
    <select
      onChange={(e) => onValueChange(rowIndex, sourceKey, e.target.value)}
      className="w-full p-2 border border-gray-300 rounded"
      value={value}
      disabled={!isLoad}
    >
      {!isLoad ? (
        <option value="">Загрузка...</option>
      ) : (
        <>
          <option value="">Выберите значение</option>
          {options?.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </>
      )}
    </select>
  );
};

export default MySelect;
