import { deleteIntegrationStepTemplates } from "@/api/Backend/templates";
import { useState } from "react";

interface MySelectProps {
  value?: string;
  onValueChange: (newValue: string) => void;
  options: { value: string; label: string; id: string }[];
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  refreshTemplates: () => Promise<void>
  resaveTemplate: (id: string) => Promise<void>
}

export const MySelectDropdown = ({ value, onValueChange, options, isOpen, setIsOpen, refreshTemplates, resaveTemplate }: MySelectProps) => {
  const isLoaded = Boolean(options);

  const [selectedLabel, setSelectedLabel] = useState("Выберите шаблон");

  const handleDocumentClick = () => {
    setIsOpen(false);
    document.removeEventListener("click", handleDocumentClick);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const deleteTemplate = async (id: string) => {
    const res = await deleteIntegrationStepTemplates(id)
    if (res.ok) {
      console.log('template is delete')
      refreshTemplates()
    }
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        className={`w-full p-2 border text-left rounded transition-colors flex items-center justify-between
          ${isOpen ? "border-blue-500" : "border-gray-300"}
          ${!isLoaded ? "text-gray-400 cursor-not-allowed" : "hover:border-gray-400"}`}
        onClick={toggleDropdown}
        disabled={!isLoaded}
      >
        <span className="truncate">
          {!isLoaded ? "Загрузка..." : selectedLabel}
        </span>
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {isOpen && isLoaded && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg top-full">
          <div className="max-h-60 overflow-auto">
            {options?.map((item) => (
              <div
                key={item.value}
                className={`px-4 py-2 cursor-pointer transition-colors
                  ${value === item.value ? "bg-blue-50 text-blue-600 font-medium" : ""}
                  flex items-center min-h-10`}
                  onClick={() => {
                    onValueChange(item.value);
                    setSelectedLabel(item.label);
                    setIsOpen(false);
                  }}
              >
                <span className="truncate mr-auto">{item.label}</span>
                <div
                  className="hover:bg-blue-50 mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    resaveTemplate(item.id);
                  }}
                  >
                  <i className='fa fa-pencil'></i>
                </div>
                <div
                  className="hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTemplate(item.id);
                  }}
                  >
                  <i className='fa fa-trash text-danger'></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
