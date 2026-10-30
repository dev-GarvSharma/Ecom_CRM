import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem('velvet-cart')) || [];
  } catch {
    return [];
  }
};

const persist = (items) => localStorage.setItem('velvet-cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart(), saved: [] },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const variant = product.selectedVariant || product.variants?.find((item) => item.active && item.stock > 0);
      if (!variant) return;
      const lineId = `${product.id}:${variant.id}`;
      const existing = state.items.find((item) => item.id === lineId);
      if (existing) existing.quantity += product.quantity || 1;
      else state.items.push({
        ...product,
        id: lineId,
        productId: product.id,
        variantId: variant.id,
        sku: variant.sku,
        variantOptions: variant.options,
        price: variant.price,
        oldPrice: variant.compareAtPrice,
        stock: variant.stock,
        quantity: product.quantity || 1,
      });
      persist(state.items);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
      persist(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persist(state.items);
    },
    saveForLater: (state, action) => {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) state.saved.push(item);
      state.items = state.items.filter((entry) => entry.id !== action.payload);
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist([]);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, saveForLater, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
