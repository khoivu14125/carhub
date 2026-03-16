const CART_KEY = 'cart';

const cartService = {
  getCart: () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  },

  saveCart: (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  addToCart: (car) => {
    const cart = cartService.getCart();

    const exists = cart.find((item) => item.id === car.id);
    if (exists) {
      return { success: false, message: 'Xe này đã có trong giỏ hàng' };
    }

    const cartItem = {
      id: car.id,
      brand: car.brand,
      model_name: car.model_name,
      price: car.price,
      images: car.images,
      seller_name: car.seller_name,
      seller_phone: car.seller_phone,
    };

    const updatedCart = [...cart, cartItem];
    cartService.saveCart(updatedCart);

    return { success: true, message: 'Đã thêm xe vào giỏ hàng' };
  },

  removeFromCart: (carId) => {
    const cart = cartService.getCart();
    const updatedCart = cart.filter((item) => item.id !== carId);
    cartService.saveCart(updatedCart);
    return updatedCart;
  },

  clearCart: () => {
    localStorage.removeItem(CART_KEY);
  },

  getCartCount: () => {
    return cartService.getCart().length;
  },

  getCartTotal: () => {
    return cartService.getCart().reduce((sum, item) => sum + Number(item.price || 0), 0);
  },
};

export default cartService;