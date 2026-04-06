import { integrationStepTemplate } from "@/api/Backend/templates"

export function normalizeAmoDomain(d: string | undefined | null): string {
  return (d ?? "").trim()
}

export function filterTemplatesByAmoDomain(
  list: integrationStepTemplate[] | undefined,
  amoCrmDomainName: string
): integrationStepTemplate[] {
  const safe = Array.isArray(list) ? list : []
  const key = normalizeAmoDomain(amoCrmDomainName)
  if (!key) return []
  return safe.filter(
    (t) =>
      normalizeAmoDomain(t.settings?.amoCrmDomainName as string | undefined) === key
  )
}

/**
 * Нормализует listIndex внутри каждого amoCRM-домена и сортирует: сначала по домену, затем по listIndex.
 */
export function normalizeAndSortTemplates(
  list: integrationStepTemplate[] | undefined
): integrationStepTemplate[] {
  const safe = Array.isArray(list) ? list : []
  const byDomain = new Map<string, integrationStepTemplate[]>()
  for (const t of safe) {
    const d =
      normalizeAmoDomain(t.settings?.amoCrmDomainName as string | undefined) || "_"
    if (!byDomain.has(d)) byDomain.set(d, [])
    byDomain.get(d)!.push(t)
  }
  const out: integrationStepTemplate[] = []
  for (const [, group] of [...byDomain.entries()].sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    const withIndex = group.map((t, i) => {
      const current = t.settings?.listIndex
      const hasIndex = typeof current === "number" && Number.isInteger(current)
      return {
        ...t,
        settings: {
          ...t.settings,
          private: t.settings?.private,
          public: t.settings?.public,
          listIndex: hasIndex ? (current as number) : i,
        },
      }
    })
    withIndex.sort(
      (a, b) => (a.settings.listIndex ?? 0) - (b.settings.listIndex ?? 0)
    )
    out.push(...withIndex)
  }
  return out
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

  const existingNames = new Set<string>();
  for (const { id, name } of templates) {
    if (excludeId && id === excludeId) continue;
    existingNames.add(trimName ? name.trim() : name);
  }

  if (!existingNames.has(safeBaseName)) {
    return safeBaseName;
  }

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
