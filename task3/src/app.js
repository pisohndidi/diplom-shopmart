'use strict';

// ── ДАННЫЕ ТОВАРОВ (из shop_db.sql) ──
const PRODUCTS = [
  { id: 1, category_id: 1, category: 'Электроника', name: 'Смартфон Samsung Galaxy A55', desc: '6.6" AMOLED, 128 GB, пятикратный оптический зум', price: 34990, stock: 50, emoji: '📱', badge: 'Хит' },
  { id: 2, category_id: 1, category: 'Электроника', name: 'Ноутбук Lenovo IdeaPad 3',    desc: '15.6", Core i5, 8 GB RAM, SSD 512 GB',         price: 59990, stock: 20, emoji: '💻', badge: null },
  { id: 3, category_id: 1, category: 'Электроника', name: 'Наушники Sony WH-1000XM5',   desc: 'Беспроводные, активное шумоподавление',        price: 24990, stock: 35, emoji: '🎧', badge: 'Новинка' },
  { id: 4, category_id: 2, category: 'Книги',       name: 'Мастер и Маргарита',          desc: 'М. А. Булгаков. Классика мировой литературы',  price:   420, stock: 100, emoji: '📖', badge: null },
  { id: 5, category_id: 2, category: 'Книги',       name: 'Чистый код',                  desc: 'Роберт Мартин. IT-бестселлер для разработчиков', price: 890, stock: 80, emoji: '📚', badge: 'Популярное' },
  { id: 6, category_id: 3, category: 'Одежда',      name: 'Футболка Adidas Essentials',  desc: 'Хлопок 100%, размеры S-XL, несколько цветов', price: 1290, stock: 200, emoji: '👕', badge: null },
  { id: 7, category_id: 3, category: 'Одежда',      name: 'Джинсы Levi\'s 501',          desc: 'Классический крой, синий индиго, прямой силуэт', price: 5490, stock: 60, emoji: '👖', badge: null },
  { id: 8, category_id: 4, category: 'Спорт',       name: 'Скакалка скоростная',         desc: 'Алюминиевые ручки, стальной трос 3 м',        price:   850, stock: 150, emoji: '🪂', badge: null },
  { id: 9, category_id: 4, category: 'Спорт',       name: 'Гиря 16 кг',                 desc: 'Чугун, покрытие эмаль, плоское основание',    price: 2200, stock: 40, emoji: '🏋️', badge: null },
];

const CATEGORIES = [
  { id: 0, name: 'Все товары' },
  { id: 1, name: 'Электроника' },
  { id: 2, name: 'Книги' },
  { id: 3, name: 'Одежда' },
  { id: 4, name: 'Спорт' },
];

// ── КОРЗИНА ──
const Cart = {
  _key: 'shop_cart',

  getItems() {
    try { return JSON.parse(localStorage.getItem(this._key)) || []; }
    catch { return []; }
  },

  saveItems(items) {
    localStorage.setItem(this._key, JSON.stringify(items));
  },

  add(productId, qty = 1) {
    const items = this.getItems();
    const existing = items.find(i => i.id === productId);
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
      items.push({ id: productId, qty });
    }
    this.saveItems(items);
    this.updateBadge();
  },

  remove(productId) {
    const items = this.getItems().filter(i => i.id !== productId);
    this.saveItems(items);
    this.updateBadge();
  },

  setQty(productId, qty) {
    const items = this.getItems();
    const item = items.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
      this.saveItems(items);
    }
    this.updateBadge();
  },

  count() {
    return this.getItems().reduce((s, i) => s + i.qty, 0);
  },

  total() {
    return this.getItems().reduce((s, i) => {
      const p = PRODUCTS.find(p => p.id === i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },

  clear() {
    localStorage.removeItem(this._key);
    this.updateBadge();
  },

  updateBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
      const n = this.count();
      badge.textContent = n;
      badge.style.display = n > 0 ? 'flex' : 'none';
    }
  },
};

// ── HELPERS ──
function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' \u20bd';
}

function showToast(text, icon = '✓') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${text}</span>`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// Инициализация бейджа корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
