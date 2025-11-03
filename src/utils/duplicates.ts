export interface DuplicableItem {
  id: string;
  title: string | null;
}

export interface DuplicateGroup<T extends DuplicableItem> {
  key: string;
  items: T[];
}

export interface DuplicateGroups<T extends DuplicableItem> {
  strict: DuplicateGroup<T>[];
  similar: DuplicateGroup<T>[];
}

const normalizeTitle = (title: string | null) => {
  if (!title) return "";
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const levenshteinDistance = (a: string, b: string) => {
  const aLength = a.length;
  const bLength = b.length;
  if (aLength === 0) return bLength;
  if (bLength === 0) return aLength;
  let previous = new Array(bLength + 1).fill(0);
  let current = new Array(bLength + 1).fill(0);
  for (let j = 0; j <= bLength; j++) previous[j] = j;
  for (let i = 1; i <= aLength; i++) {
    current[0] = i;
    for (let j = 1; j <= bLength; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    [previous, current] = [current, previous];
  }
  return previous[bLength];
};

const similarityScore = (a: string, b: string) => {
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 1;
  const distance = levenshteinDistance(a, b);
  return 1 - distance / maxLength;
};

export const computeDuplicateGroups = <T extends DuplicableItem>(
  items: T[],
  options?: { similarityThreshold?: number }
): DuplicateGroups<T> => {
  const threshold = options?.similarityThreshold ?? 0.78;
  const strictMap = new Map<string, T[]>();
  const strictIds = new Set<string>();
  const strict: DuplicateGroup<T>[] = [];
  for (const item of items) {
    const normalized = normalizeTitle(item.title);
    if (!normalized) continue;
    const existing = strictMap.get(normalized);
    if (existing) {
      existing.push(item);
    } else {
      strictMap.set(normalized, [item]);
    }
  }
  for (const [key, value] of strictMap.entries()) {
    if (value.length > 1) {
      strict.push({ key: value[0].title ?? key, items: value });
      value.forEach((entry) => strictIds.add(entry.id));
    }
  }
  strict.sort((a, b) => b.items.length - a.items.length);
  const remaining = items.filter((item) => {
    if (strictIds.has(item.id)) return false;
    return normalizeTitle(item.title).length > 0;
  });
  const used = new Set<string>();
  const similar: DuplicateGroup<T>[] = [];
  for (let i = 0; i < remaining.length; i++) {
    const base = remaining[i];
    if (used.has(base.id)) continue;
    const baseNormalized = normalizeTitle(base.title);
    if (!baseNormalized) continue;
    const group: T[] = [base];
    for (let j = i + 1; j < remaining.length; j++) {
      const candidate = remaining[j];
      if (used.has(candidate.id)) continue;
      const candidateNormalized = normalizeTitle(candidate.title);
      if (!candidateNormalized) continue;
      const score = similarityScore(baseNormalized, candidateNormalized);
      if (score >= threshold) {
        group.push(candidate);
        used.add(candidate.id);
      }
    }
    if (group.length > 1) {
      group.forEach((entry) => used.add(entry.id));
      similar.push({ key: base.title ?? baseNormalized, items: group });
    }
  }
  similar.sort((a, b) => b.items.length - a.items.length);
  return { strict, similar };
};
