interface IOption {
  label: string;
  value: string;
}

interface ISelectField {
  label?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  options: IOption[];
}

export const SelectField = ({ label, value, setValue, options }: ISelectField) => {
  return (
    <div style={{
      width: '100%',
      margin: 'auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {label && (
        <label
          htmlFor="custom-select"
          style={{
            display: 'block',
            fontWeight: '500',
            marginBottom: '8px',
            color: '#374151',
            fontSize: '14px'
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        <select
          id="custom-select"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 36px 10px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            backgroundColor: '#fff',
            fontSize: '14px',
            color: '#1F2937',
            appearance: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            cursor: 'pointer'
          }}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}>
          ▾
        </div>
      </div>
    </div>
  );
};
