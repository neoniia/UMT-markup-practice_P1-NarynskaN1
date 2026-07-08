import { createOrder } from './api.js';

let selectedProduct = null;

const productModal = document.querySelector('[data-product-modal]');
const orderModal = document.querySelector('[data-order-modal]');
const productCloseBtn = document.querySelector('[data-product-modal-close]');
const orderCloseBtn = document.querySelector('[data-order-modal-close]');
const orderFromDetailsBtn = document.querySelector('[data-order-from-details]');
const orderProductName = document.querySelector('[data-order-product-name]');
const orderForm = document.querySelector('#order-form');

const productImage = document.querySelector('[data-product-modal-image]');
const productTitle = document.querySelector('[data-product-modal-title]');
const productPrice = document.querySelector('[data-product-modal-price]');
const productDescription = document.querySelector('[data-product-modal-description]');
const quantityInput = document.querySelector('[data-order-quantity]');

function showModal(modal) {
  modal.hidden = false;
  document.body.classList.add('modal-open');
}

function hideModal(modal) {
  modal.hidden = true;

  if (productModal.hidden && orderModal.hidden) {
    document.body.classList.remove('modal-open');
  }
}

export function openProductModal(product) {
  selectedProduct = product;
  productImage.src = product.image;
  productImage.alt = product.name;
  productTitle.textContent = product.name;
  productPrice.textContent = `$${Number(product.price).toFixed(0)}`;
  productDescription.textContent = product.description;
  quantityInput.value = '1';
  showModal(productModal);
}

function openOrderModal() {
  if (selectedProduct) {
    orderProductName.textContent = `${selectedProduct.name} · $${selectedProduct.price}`;
  }
  hideModal(productModal);
  showModal(orderModal);
}

function closeProductModal() {
  hideModal(productModal);
}

function closeOrderModal() {
  hideModal(orderModal);
}

export function initModals() {
  productCloseBtn.addEventListener('click', closeProductModal);
  orderCloseBtn.addEventListener('click', closeOrderModal);
  orderFromDetailsBtn.addEventListener('click', openOrderModal);

  [productModal, orderModal].forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        hideModal(modal);
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!productModal.hidden) hideModal(productModal);
    if (!orderModal.hidden) hideModal(orderModal);
  });

  orderForm.addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(orderForm);

    const payload = {
      productId: selectedProduct?.id || null,
      productName: selectedProduct?.name || '',
      quantity: Number(quantityInput.value) || 1,
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      message: formData.get('message'),
    };

    try {
      await createOrder(payload);
      orderForm.reset();
      closeOrderModal();
      alert('Order created successfully.');
    } catch (error) {
      alert('Order was not created. Please try again.');
    }
  });
}
