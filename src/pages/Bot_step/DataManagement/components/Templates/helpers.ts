import { integrationStepTemplate } from "@/api/Backend/templates"

/**
 * Присваивает listIndex тем шаблонам, у которых его нет, и сортирует по listIndex.
 */
export function normalizeAndSortTemplates(
  list: integrationStepTemplate[]
): integrationStepTemplate[] {
  const withIndex = list.map((t, i) => {
    const current = t.settings?.listIndex;
    const hasIndex = typeof current === "number" && Number.isInteger(current);
    return {
      ...t,
      settings: {
        ...t.settings,
        private: t.settings?.private,
        public: t.settings?.public,
        listIndex: hasIndex ? (current as number) : i,
      },
    };
  });
  return withIndex
    .slice()
    .sort((a, b) => (a.settings.listIndex ?? 0) - (b.settings.listIndex ?? 0));
}

export const generateUniqueTemplateName = (
  baseName: string,
  templates: integrationStepTemplate[],
  excludeId?: string,
  options: { maxAttempts?: number; trimName?: boolean } = {}
): string => {
  const { maxAttempts = 10000, trimName = true } = options;
  const safeBaseName = trimName ? baseName.trim() : baseName;
  
  if (!safeBaseName) {
    throw new Error("Base name cannot be empty after trimming");
  }

  // Создаем Set для O(1) проверок
  const existingNames = new Set<string>();
  for (const { id, name } of templates) {
    if (excludeId && id === excludeId) continue;
    existingNames.add(trimName ? name.trim() : name);
  }

  // Проверяем базовое имя
  if (!existingNames.has(safeBaseName)) {
    return safeBaseName;
  }

  // Ищем следующее доступное имя
  for (let counter = 1; counter <= maxAttempts; counter++) {
    const newName = `${safeBaseName} ${counter}`;
    if (!existingNames.has(newName)) {
      return newName;
    }
  }

  throw new Error(
    `Failed to generate unique name after ${maxAttempts} attempts. ` +
    `Consider increasing maxAttempts or cleaning up templates.`
  );
};


