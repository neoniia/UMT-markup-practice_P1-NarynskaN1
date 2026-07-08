const formatPrice = price => `$${Number(price).toFixed(0)}`;

export function createProductCard(product) {
  return `
    <li class="product-card">
      <button type="button" data-product-id="${product.id}" aria-label="Open ${product.name} details">
        <img src="${product.cardImage || product.image}" alt="${product.name}" loading="lazy" />
        <h3>${product.name}</h3>
        <p>${formatPrice(product.price)}</p>
      </button>
    </li>
  `;
}

export function renderProducts(container, items) {
  container.innerHTML = items.map(createProductCard).join('');
}

export function renderBestSellers(container, items) {
  container.innerHTML = items.map(createProductCard).join('');
}

export function renderPagination(container, currentPage, totalPages) {
  container.innerHTML = '';

  if (totalPages <= 1) {
    return;
  }

  const previousDisabled = currentPage === 1 ? 'disabled' : '';
  const nextDisabled = currentPage === totalPages ? 'disabled' : '';
  const buttons = [];

  buttons.push(`
    <button type="button" data-page="${currentPage + 1}" data-kind="show-more" ${nextDisabled}>
      Show More
    </button>
  `);

  buttons.push(`
    <button type="button" data-page="${currentPage - 1}" data-kind="page" aria-label="Previous page" ${previousDisabled}>←</button>
  `);

  for (let page = 1; page <= totalPages; page += 1) {
    buttons.push(`
      <button type="button" data-page="${page}" data-kind="page" class="${page === currentPage ? 'is-active' : ''}">
        ${page}
      </button>
    `);
  }

  buttons.push(`
    <button type="button" data-page="${currentPage + 1}" data-kind="page" aria-label="Next page" ${nextDisabled}>→</button>
  `);

  container.innerHTML = buttons.join('');
}

export function updateResultCounter(element, totalItems, currentPage, totalPages) {
  element.textContent = `${totalItems} bouquets found · page ${currentPage} of ${totalPages}`;
}

export function setLoading(loader, isLoading) {
  loader.hidden = !isLoading;
}

export function setEmptyMessage(element, isVisible) {
  element.hidden = !isVisible;
}
