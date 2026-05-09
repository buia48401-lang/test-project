export interface FavoriteItem {
  id: string;
  productName: string;
  platform: string;
  productType: string;
  style: string;
  styleTitle: string;
  prompt: string;
  createdAt: number;
  tags: string[];
}

export interface Collection {
  id: string;
  name: string;
  itemIds: string[];
}

export interface FavoritesStorage {
  items: FavoriteItem[];
  collections: Collection[];
}

const STORAGE_KEY = "productprompt_favorites";
const MAX_FAVORITES = 100;

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function getStorage(): FavoritesStorage {
  if (typeof window === "undefined") return { items: [], collections: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], collections: [] };
    const parsed = JSON.parse(raw) as FavoritesStorage;
    return {
      items: Array.isArray(parsed?.items) ? parsed.items : [],
      collections: Array.isArray(parsed?.collections) ? parsed.collections : [],
    };
  } catch {
    return { items: [], collections: [] };
  }
}

function saveStorage(storage: FavoritesStorage): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

/* Items */

export function getFavorites(): FavoriteItem[] {
  return getStorage().items;
}

export function isFavorited(productName: string, style: string): boolean {
  return getStorage().items.some(
    (item) => item.productName === productName && item.style === style
  );
}

export function getFavoriteId(productName: string, style: string): string | undefined {
  return getStorage().items.find(
    (item) => item.productName === productName && item.style === style
  )?.id;
}

export function saveFavorite(
  productName: string,
  platform: string,
  productType: string,
  style: string,
  styleTitle: string,
  prompt: string
): FavoriteItem {
  const storage = getStorage();

  const existingIndex = storage.items.findIndex(
    (item) => item.productName === productName && item.style === style
  );

  if (existingIndex >= 0) {
    return storage.items[existingIndex];
  }

  const item: FavoriteItem = {
    id: generateId(),
    productName,
    platform,
    productType,
    style,
    styleTitle,
    prompt,
    createdAt: Date.now(),
    tags: [],
  };

  storage.items.unshift(item);
  if (storage.items.length > MAX_FAVORITES) {
    storage.items.length = MAX_FAVORITES;
  }

  saveStorage(storage);
  return item;
}

export function deleteFavorite(id: string): void {
  const storage = getStorage();
  storage.items = storage.items.filter((item) => item.id !== id);
  storage.collections = storage.collections.map((col) => ({
    ...col,
    itemIds: col.itemIds.filter((itemId) => itemId !== id),
  }));
  saveStorage(storage);
}

export function updateFavoriteTags(id: string, tags: string[]): FavoriteItem | null {
  const storage = getStorage();
  const index = storage.items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  storage.items[index] = { ...storage.items[index], tags };
  saveStorage(storage);
  return storage.items[index];
}

/* Collections */

export function getCollections(): Collection[] {
  return getStorage().collections;
}

export function createCollection(name: string): Collection {
  const storage = getStorage();
  const collection: Collection = {
    id: generateId(),
    name,
    itemIds: [],
  };
  storage.collections.push(collection);
  saveStorage(storage);
  return collection;
}

export function deleteCollection(id: string): void {
  const storage = getStorage();
  storage.collections = storage.collections.filter((col) => col.id !== id);
  saveStorage(storage);
}

export function renameCollection(id: string, name: string): Collection | null {
  const storage = getStorage();
  const index = storage.collections.findIndex((col) => col.id === id);
  if (index < 0) return null;
  storage.collections[index] = { ...storage.collections[index], name };
  saveStorage(storage);
  return storage.collections[index];
}

export function addToCollection(collectionId: string, itemId: string): Collection | null {
  const storage = getStorage();
  const index = storage.collections.findIndex((col) => col.id === collectionId);
  if (index < 0) return null;
  const col = storage.collections[index];
  if (!col.itemIds.includes(itemId)) {
    col.itemIds.push(itemId);
    saveStorage(storage);
  }
  return col;
}

export function removeFromCollection(collectionId: string, itemId: string): Collection | null {
  const storage = getStorage();
  const index = storage.collections.findIndex((col) => col.id === collectionId);
  if (index < 0) return null;
  const col = storage.collections[index];
  col.itemIds = col.itemIds.filter((id) => id !== itemId);
  saveStorage(storage);
  return col;
}
