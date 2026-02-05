// data/products.js
// Single source of truth for UI/static products.
// This file merges handcrafted products + generated NCERT catalog.

import { baseProducts } from './products.base';
import { ncertProducts } from './ncertCatalog';

function mergeUniqueById(...lists) {
  const byId = new Map();
  for (const list of lists) {
    for (const item of list) {
      const key = String(item._id ?? item.id);
      if (!byId.has(key)) byId.set(key, item);
    }
  }
  return Array.from(byId.values());
}

export const products = mergeUniqueById(baseProducts, ncertProducts);
