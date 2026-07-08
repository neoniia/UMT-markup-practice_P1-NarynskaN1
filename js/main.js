import { getBestSellers, getProductById, getProducts } from './api.js';
import { initMobileMenu } from './menu.js';
import { initModals, openProductModal } from './modal.js';
import {
  renderBestSellers,
  renderPagination,
  renderProducts,
  setEmptyMessage,
  setLoading,
  updateResultCounter,
} from './render.js';

const state = {
  page: 1,
  limit: 8,
  search: '',
  category: '',
  sort: 'popular',
  totalPages: 1,
  totalItems: 0,
};

const productsList = document.querySelector('#products-list');
const topProductsList = document.querySelector('#top-products-list');
const filtersForm = document.querySelector('#filters-form');
const resetFiltersBtn = document.querySelector('#reset-filters');
const pagination = document.querySelector('#pagination');
const loader = document.querySelector('#loader');
const emptyMessage = document.querySelector('#empty-message');
const resultCounter = document.querySelector('#result-counter');

function debounce(callback, delay = 300) {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback(...args), delay);
  };
}

function syncStateFromFilters() {
  const formData = new FormData(filtersForm);
  state.search = String(formData.get('search') || '').trim();
  state.category = String(formData.get('category') || '');
  state.sort = String(formData.get('sort') || 'popular');
  state.page = 1;
}

async function loadProducts() {
  try {
    setLoading(loader, true);
    setEmptyMessage(emptyMessage, false);

    const data = await getProducts(state);
    state.page = data.currentPage;
    state.totalPages = data.totalPages;
    state.totalItems = data.totalItems;

    renderProducts(productsList, data.items);
    renderPagination(pagination, state.page, state.totalPages);
    updateResultCounter(resultCounter, state.totalItems, state.page, state.totalPages);
    setEmptyMessage(emptyMessage, data.items.length === 0);
  } catch (error) {
    resultCounter.textContent = 'Failed to load bouquets.';
    productsList.innerHTML = '';
    pagination.innerHTML = '';
  } finally {
    setLoading(loader, false);
  }
}

async function handleProductClick(event) {
  const button = event.target.closest('[data-product-id]');
  if (!button) return;

  try {
    const product = await getProductById(button.dataset.productId);
    openProductModal(product);
  } catch (error) {
    alert('Product was not found.');
  }
}

initMobileMenu();
initModals();
renderBestSellers(topProductsList, getBestSellers());
loadProducts();

filtersForm.addEventListener('input', debounce(() => {
  syncStateFromFilters();
  loadProducts();
}, 250));

filtersForm.addEventListener('change', () => {
  syncStateFromFilters();
  loadProducts();
});

resetFiltersBtn.addEventListener('click', () => {
  filtersForm.reset();
  state.page = 1;
  state.search = '';
  state.category = '';
  state.sort = 'popular';
  loadProducts();
});

pagination.addEventListener('click', event => {
  const button = event.target.closest('[data-page]');
  if (!button || button.disabled) return;

  const nextPage = Number(button.dataset.page);
  if (!nextPage || nextPage === state.page) return;

  state.page = nextPage;
  loadProducts();
});

productsList.addEventListener('click', handleProductClick);
topProductsList.addEventListener('click', handleProductClick);
