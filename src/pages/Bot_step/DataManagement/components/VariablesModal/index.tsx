import { getUrlParams } from '@/helpers';
import { useState, useEffect } from 'react';
import { VariablesModal } from './NotSenlerVariablesModal';
import { SelectField } from '@/pages/Bot_step/DataManagement/components/SelectField';

interface Variable {
  value: string;
  label: string;
}

interface VariablesModalProps {
  groupId: string;
  show: boolean;
  onHide: () => void;
  onInsert: (value: string) => void;
  options?: Variable[];
}

interface MessageEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  options?: Variable[];
  type?: 'senler' | 'no-senler';
}

const replaceValuesWithLabels = (text: string, options: Variable[] = []) => {
  let result = text;
  options.forEach(opt => {
    const regex = new RegExp(opt.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, `%${opt.label}%`);
  });
  return result;
};

export const MessageEditor = ({
  initialContent = '',
  onContentChange,
  options = [],
  type = 'no-senler',
}: MessageEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [showModal, setShowModal] = useState(false);

  const { senlerGroupId } = getUrlParams();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);
    onContentChange?.(newText);
  };

  const handleInsertVariable = (value: string) => {
    const newText = content + value;
    setContent(newText);
    onContentChange?.(newText);
  };

  // превью для отображения с подменой %value% → %label%
  const previewText = type === 'no-senler' ? replaceValuesWithLabels(content, options) : content;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <textarea
          value={content}
          onChange={handleChange}
          className="w-full min-h-24 p-3 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none resize-y"
          placeholder="Введите текст сообщения..."
        />
        <button
          onClick={() => setShowModal(true)}
          className="absolute right-2 top-2 bg-[#428BCA] hover:bg-[#025aa5] text-white w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          title="Вставить переменную"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" />
          </svg>
        </button>
      </div>

      {/* Превью текста */}
      <div className="p-3 border rounded bg-gray-50 whitespace-pre-wrap text-gray-800">
        {previewText}
      </div>

      {type === 'senler' ? (
        <SenlerVariablesModal
          groupId={senlerGroupId}
          show={showModal}
          options={options}
          onHide={() => setShowModal(false)}
          onInsert={handleInsertVariable}
        />
      ) : (
        <VariablesModal
          groupId={senlerGroupId}
          show={showModal}
          options={options}
          onHide={() => setShowModal(false)}
          onInsert={handleInsertVariable}
        />
      )}
    </div>
  );
};

// ====== Модалка SenlerVariablesModal ======
const SenlerVariablesModal = ({ groupId, show, onHide, onInsert, options }: VariablesModalProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGlobalAddModal, setShowGlobalAddModal] = useState(false);
  const [customVars, setCustomVars] = useState<Variable[]>([]);
  const [selectedCustomVar, setSelectedCustomVar] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    const fetchVariables = async () => {
      setCustomVars(options || []);
      setError('');
      setLoading(false);

      try {
        const [customRes] = await Promise.all([
          fetch(`/vars/list?group_id=${groupId}`)
        ]);
        const customData = await customRes.json();
        setCustomVars(customData);
        setError('');
      } catch (err) {
        setError('Ошибка загрузки переменных');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVariables();
  }, [show, groupId]);

  const handleInsertCustom = () => {
    if (!selectedCustomVar) {
      setError('Выберите переменную');
      return;
    }
    onInsert(selectedCustomVar);
    onHide();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-2xl font-bold">Вставить переменную</h3>
          <button
            onClick={onHide}
            className="text-gray-500 hover:text-gray-700 text-4xl leading-none p-2"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 p-6">
          <div className="space-y-6 mb-8">
            <div className="space-y-4">
              <label className="block text-xl font-semibold">Пользовательские переменные</label>
              <div className="flex gap-4">
                <SelectField
                  value={selectedCustomVar}
                  setValue={value => setSelectedCustomVar(value)}
                  options={customVars || []}
                  disabled={loading}
                />
                <button
                  onClick={handleInsertCustom}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                  Вставить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <VarAddModal
          groupId={groupId}
          onClose={() => setShowAddModal(false)}
          onSuccess={name => {
            onInsert(name);
            setShowAddModal(false);
          }}
        />
      )}

      {showGlobalAddModal && (
        <VarGlobalAddModal
          groupId={groupId}
          onClose={() => setShowGlobalAddModal(false)}
          onSuccess={name => {
            onInsert(name);
            setShowGlobalAddModal(false);
          }}
        />
      )}
    </div>
  );
};

// ====== VarAddModal ======
export const VarAddModal = ({ groupId, onClose, onSuccess }: {
  groupId: string;
  onClose: () => void;
  onSuccess: (name: string) => void;
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name.match(/^[a-zA-Z0-9_]+$/)) {
      setError('Только латинские буквы, цифры и подчеркивания');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://senler.ru/ajax/group/variables/VarLeadSave/${groupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: groupId, n: name }),
      });

      if (!response.ok) throw new Error('Ошибка сервера');
      const data = await response.json();
      if (data.success) {
        onSuccess(name);
      } else {
        setError(data.message || 'Ошибка создания переменной');
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Новая переменная</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block mb-2 font-medium">Имя переменной</label>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                setError('');
              }}
              className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ====== VarGlobalAddModal ======
export const VarGlobalAddModal = ({ groupId, onClose, onSuccess }: {
  groupId: string;
  onClose: () => void;
  onSuccess: (name: string) => void;
}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name.match(/^[a-zA-Z0-9_]+$/)) {
      setError('Только латинские буквы, цифры и подчеркивания');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://senler.ru/ajax/group/variables/VarGlobalSave/${groupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: groupId, n: name, v: value }),
      });

      if (!response.ok) throw new Error('Ошибка сервера');
      const data = await response.json();
      if (data.success) {
        onSuccess(name);
      } else {
        setError(data.message || 'Ошибка создания переменной');
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Глобальная переменная</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block mb-2 font-medium">Имя переменной</label>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                setError('');
              }}
              className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Значение</label>
            <textarea
              value={value}
              onChange={e => setValue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded min-h-32 h-32"
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
