import { useState, useEffect } from 'react';
import { VarAddModal } from '.';

interface Variable {
  value: string;
  label: string;
}

interface VariablesModalProps {
  groupId: string;
  show: boolean;
  onHide: () => void;
  onInsert: (value: string) => void;
  options?: {
    value: string;
    label: string;
  }[];
}

export const VariablesModal = ({ groupId, show, onHide, onInsert, options }: VariablesModalProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [customVars, setCustomVars] = useState<Variable[]>([]);
  const [selectedCustomVar, setSelectedCustomVar] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    setCustomVars(options || []);
    setError('');
    setLoading(false);
  }, [show, groupId]);

  const handleInsertCustom = () => {
    if (!selectedCustomVar) {
      setError('Выберите переменную');
      return;
    }
    onInsert(`${selectedCustomVar}`);
    onHide();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Main Modal Content */}
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-2xl font-bold">Вставить переменную</h3>
          <button
            onClick={onHide}
            className="text-gray-500 hover:text-gray-700 text-4xl leading-none p-2"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6">
          {error && <div className="text-red-500 mb-6 text-lg">{error}</div>}

          <div className="space-y-6 mb-8">
            <div className="space-y-4">
              <label className="block text-xl font-semibold">Пользовательские переменные</label>
              <div className="flex gap-4">
                <select
                  value={selectedCustomVar}
                  onChange={(e) => setSelectedCustomVar(e.target.value)}
                  className="flex-1 p-3 border-2 rounded-lg bg-white text-lg"
                  disabled={loading}
                >
                  <option value="">Выберите переменную</option>
                  {customVars.map((varItem) => (
                    <option key={varItem.value} value={varItem.value}>
                      {varItem.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleInsertCustom}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                  Вставить
                </button>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(true);
                }}
                className="text-blue-600 hover:text-blue-700 text-lg"
              >
                Создать новую переменную
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Variable Modals (остаются без изменений) */}
      {showAddModal && (
        <VarAddModal
          groupId={groupId}
          onClose={() => {
            setShowAddModal(false);
          }}
          onSuccess={(name) => {
            onInsert(`%${name}%`);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};