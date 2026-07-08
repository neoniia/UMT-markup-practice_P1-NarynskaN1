import { products } from './products.js';

const API_BASE_URL = window.FLORA_API_URL || '';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function normalizeQuery(value) {
  return String(value || '').trim().toLowerCase();
}

function filterProducts(items, state) {
  const search = normalizeQuery(state.search);
  const category = normalizeQuery(state.category);

  return items.filter(item => {
    const matchesSearch = !search || `${item.name} ${item.description}`.toLowerCase().includes(search);
    const matchesCategory = !category || item.category === category;
    return matchesSearch && matchesCategory;
  });
}

function sortProducts(items, sort) {
  const sorted = [...items];

  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      sorted.sort((a, b) => b.popular - a.popular);
  }

  return sorted;
}

function paginateProducts(items, page, limit) {
  const currentPage = Math.max(1, Number(page) || 1);
  const perPage = Math.max(1, Number(limit) || 8);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    totalItems,
    totalPages,
    currentPage: safePage,
  };
}

export async function getProducts(state) {
  if (API_BASE_URL) {
    const params = new URLSearchParams({
      page: state.page,
      limit: state.limit,
      sort: state.sort,
    });

    if (state.search) params.set('search', state.search);
    if (state.category) params.set('category', state.category);

    const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch products from API');
    }

    return response.json();
  }

  await delay(150);
  const filtered = filterProducts(products, state);
  const sorted = sortProducts(filtered, state.sort);
  return paginateProducts(sorted, state.page, state.limit);
}

export async function getProductById(id) {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);

    if (!response.ok) {
      throw new Error('Product not found');
    }

    return response.json();
  }

  await delay(80);
  const product = products.find(item => item.id === id);

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
}

export async function createOrder(orderData) {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return response.json();
  }

  await delay(120);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    status: 'created',
    ...orderData,
  };
}

export function getBestSellers() {
  return products.filter(item => item.bestseller).slice(0, 3);
}
