import { useState } from "react";

interface MySelectProps {
  value?: string;
  onValueChange: (newValue: string) => void;
  options: { value: string; label: string }[];
}

export const MySelectDropdown = ({ value, onValueChange, options }: MySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoaded = Boolean(options);
  console.log('test -- test ', isLoaded, isOpen, options)
  // const selectedLabel = options?.find((opt) => opt.value === value)?.label || "Выберите шаблон";
  const selectedLabel = "Выберите шаблон";

  const handleDocumentClick = () => {
    setIsOpen(false);
    document.removeEventListener("click", handleDocumentClick);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        className={`w-full p-2 border text-left rounded transition-colors
          ${isOpen ? "border-blue-500" : "border-gray-300"}
          ${!isLoaded ? "text-gray-400 cursor-not-allowed" : "hover:border-gray-400"}`}
        onClick={toggleDropdown}
        disabled={!isLoaded}
      >
        {!isLoaded ? "Загрузка..." : selectedLabel}
        <span className="float-right transform translate-y-1">▾</span>
      </button>

      {isOpen && isLoaded && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
          <div className="max-h-60 overflow-auto">
            {options?.map((item) => (
              <div
                key={item.value}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                  value === item.value ? "bg-blue-50 text-blue-600" : ""
                }`}
                onClick={() => {
                  onValueChange(item.value);
                  setIsOpen(false);
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
