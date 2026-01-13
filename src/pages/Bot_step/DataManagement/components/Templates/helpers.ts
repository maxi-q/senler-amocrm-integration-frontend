import { integrationStepTemplate } from "@/api/Backend/templates"

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


