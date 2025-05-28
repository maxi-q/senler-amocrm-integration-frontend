import { getUrlParams } from '@/helpers';
import { useState, useEffect } from 'react';
import { VariablesModal } from './NotSenlerVariablesModal';

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

interface MessageEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  options?: {
    value: string;
    label: string;
  }[];
  type?: 'senler' | 'no-senler'
}

export const MessageEditor = ({
  initialContent = '',
  onContentChange,
  options,
  type
}: MessageEditorProps) => {
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState(initialContent);

  const { senlerGroupId } = getUrlParams()

  console.log(options)

  const handleInsertVariable = (value: string) => {
    const newContent = content + value;
    setContent(newContent);
    onContentChange?.(newContent);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onContentChange?.(newValue);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <textarea
          value={content}
          onChange={handleTextChange}
          className="w-full h-14 p-3 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Введите текст сообщения..."
        />
        <button
          onClick={() => setShowModal(true)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#428BCA] hover:bg-[#025aa5] text-white w-8 h-8 flex items-center justify-center rounded-full transition-colors"
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

      {
        type === 'senler' ?
        <SenlerVariablesModal
          groupId={senlerGroupId}
          show={showModal}
          options={options}
          onHide={() => setShowModal(false)}
          onInsert={handleInsertVariable}
        /> :
        <VariablesModal
          groupId={senlerGroupId}
          show={showModal}
          options={options}
          onHide={() => setShowModal(false)}
          onInsert={handleInsertVariable}
        />
      }
    </div>
  );
};

const SenlerVariablesModal = ({ groupId, show, onHide, onInsert, options }: VariablesModalProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGlobalAddModal, setShowGlobalAddModal] = useState(false);
  const [customVars, setCustomVars] = useState<Variable[]>([]);
  const [globalVars, setGlobalVars] = useState<Variable[]>([]);
  const [selectedCustomVar, setSelectedCustomVar] = useState('');
  const [selectedGlobalVar, setSelectedGlobalVar] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // const wildcards = options || [];
  const wildcards = [
    { value: '%username%', label: 'Имя' },
    { value: '%fullname%', label: 'Полное имя' },
    { value: '%userid%', label: 'ID получателя' },
    // { value: '%domain%', label: 'Короткий адрес страницы' },
    // { value: '[city]%city%|город не выбран[/city]', label: 'Город' },
    // { value: '[country]%country%|страна не выбрана[/country]', label: 'Страна' },
    // { value: '[relation]%relation%|семейное положение не выбрано[/relation]', label: 'Семейное положение' },
    // { value: '[public192639504|novasex]', label: 'Ссылка на сообщество' },
    // { value: '[gender]Этот текст увидит парень|Этот текст увидит девушка[/gender]', label: 'Мужчинам|Женщинам' },
    // { value: '[date]%e %month|+1 day[/date]', label: 'Дата' },
    // { value: '[rand]текст 1|текст 2|текст 3[/rand]', label: 'Случайный текст' },
    // { value: '[rand]1:9999[/rand]', label: 'Случайное число' },
    // { value: '%unsubscribe%', label: 'Отписаться' },
  ];

  useEffect(() => {
    if (!show) return;

    const fetchVariables = async () => {
      setCustomVars(options || []);
      setError('');
      setLoading(false);

      try {
        const [customRes, globalRes] = await Promise.all([
          fetch(`/vars/list?group_id=${groupId}`),
          fetch(`/vars/list?group_id=${groupId}&type=glob_vars`)
        ]);

        const customData = await customRes.json();
        const globalData = await globalRes.json();

        setCustomVars(customData);
        setGlobalVars(globalData);


        setError('');
      } catch (err) {
        setError('Ошибка загрузки переменных');
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
    onInsert(`${selectedCustomVar}`);
    onHide();
  };

  const handleInsertGlobal = () => {
    if (!selectedGlobalVar) {
      setError('Выберите переменную');
      return;
    }
    onInsert(`${selectedGlobalVar}`);
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

          {/* Wildcards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {wildcards.map((card) => (
              <button
                key={card.value}
                onClick={() => {
                  onInsert(card.value);
                  onHide();
                }}
                className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-base border"
              >
                {card.label}
              </button>
            ))}
          </div>

          {/* Custom Variables Section */}
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

            {/* Global Variables Section */}
            <div className="space-y-4">
              <label className="block text-xl font-semibold">Глобальные переменные</label>
              <div className="flex gap-4">
                <select
                  value={selectedGlobalVar}
                  onChange={(e) => setSelectedGlobalVar(e.target.value)}
                  className="flex-1 p-3 border-2 rounded-lg bg-white text-lg"
                  disabled={loading}
                >
                  <option value="">Выберите переменную</option>
                  {globalVars.map((varItem) => (
                    <option key={varItem.value} value={varItem.value}>
                      {varItem.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleInsertGlobal}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                  Вставить
                </button>
              </div>
              <button
                onClick={() => {
                  setShowGlobalAddModal(true);
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
            onInsert(`${name}`);
            setShowAddModal(false);
          }}
        />
      )}

      {showGlobalAddModal && (
        <VarGlobalAddModal
          groupId={groupId}
          onClose={() => {
            setShowGlobalAddModal(false);
          }}
          onSuccess={(name) => {
            onInsert(`${name}`);
            setShowGlobalAddModal(false);
          }}
        />
      )}
    </div>
  );
};

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group_id: groupId,
          n: name
        }),
      });

      if (!response.ok) throw new Error('Ошибка сервера');

      const data = await response.json();
      if (data.success) {
        onSuccess(name);
      } else {
        setError(data.message || 'Ошибка создания переменной');
      }
    } catch (err) {
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
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className={`w-full p-2 border rounded ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
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

// Add Global Variable Modal Component
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group_id: groupId,
          n: name,
          v: value
        }),
      });

      if (!response.ok) throw new Error('Ошибка сервера');

      const data = await response.json();
      if (data.success) {
        onSuccess(name);
      } else {
        setError(data.message || 'Ошибка создания переменной');
      }
    } catch (err) {
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
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className={`w-full p-2 border rounded ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Значение</label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded h-32"
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