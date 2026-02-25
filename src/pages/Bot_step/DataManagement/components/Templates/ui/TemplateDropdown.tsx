import { deleteIntegrationStepTemplates } from "@/api/Backend/templates";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface TemplatesDropdownProps {
  value?: string;
  onValueChange: (newValue: string) => void;
  options: { value: string; label: string; id: string }[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTemplates: () => Promise<void>;
  resaveTemplate: (id: string) => Promise<void>;
  onReorder?: (orderedIds: string[]) => void;
}

function SortableTemplateRow({
  item,
  isSelected,
  onSelect,
  onResave,
  onDelete,
}: {
  item: { value: string; label: string; id: string };
  isSelected: boolean;
  onSelect: () => void;
  onResave: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`px-4 py-2 cursor-pointer transition-colors flex items-center min-h-10
        ${isSelected ? "bg-blue-50 text-blue-600 font-medium" : ""}
        ${isDragging ? "opacity-50 shadow-md bg-white" : ""}`}
      onClick={onSelect}
    >
      <div
        className="hover:bg-blue-50 mr-2 cursor-grab active:cursor-grabbing touch-none flex items-center shrink-0"
        onClick={(e) => e.stopPropagation()}
        {...attributes}
        {...listeners}
        title="Перетащите для изменения порядка"
      >
        <FontAwesomeIcon icon="grip-vertical" className="text-gray-400" />
      </div>
      <span className="truncate mr-auto">{item.label}</span>
      <div
        className="hover:bg-blue-50 mr-1 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onResave();
        }}
      >
        <FontAwesomeIcon icon="pencil" />
      </div>
      <div
        className="hover:bg-blue-50 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <FontAwesomeIcon icon="trash" style={{ color: "#dc3545" }} />
      </div>
    </div>
  );
}

export const TemplatesDropdown = ({
  value,
  onValueChange,
  options,
  isOpen,
  setIsOpen,
  refreshTemplates,
  resaveTemplate,
  onReorder,
}: TemplatesDropdownProps) => {
  const isLoaded = Boolean(options);

  const [selectedLabel, setSelectedLabel] = useState("Выберите шаблон");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDocumentClick = () => {
    setIsOpen(false);
    document.removeEventListener("click", handleDocumentClick);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const deleteTemplate = async (id: string) => {
    const res = await deleteIntegrationStepTemplates(id);
    if (res.ok) {
      console.log("template is delete");
      refreshTemplates();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;
    const ids = options.map((o) => o.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(ids, oldIndex, newIndex);
    onReorder(reordered);
  };

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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={options.map((o) => o.id)} strategy={verticalListSortingStrategy}>
                {options?.map((item) => (
                  <SortableTemplateRow
                    key={item.id}
                    item={item}
                    isSelected={value === item.value}
                    onSelect={() => {
                      onValueChange(item.value);
                      setSelectedLabel(item.label);
                      setIsOpen(false);
                    }}
                    onResave={() => resaveTemplate(item.id)}
                    onDelete={() => deleteTemplate(item.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );
};
