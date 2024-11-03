// utils/cart.ts
interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export function addToCart(product: Product) {
    // Ambil data keranjang belanja dari localStorage
    let cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');

    // Cek apakah produk sudah ada di keranjang belanja
    const index = cart.findIndex(item => item.id === product.id);
    if (index !== -1) {
        // Jika ya, tambahkan quantity
        cart[index].quantity += 1;
    } else {
        // Jika tidak, tambahkan produk ke keranjang belanja
        cart.push({ ...product, quantity: 1 });
    }

    // Simpan kembali keranjang belanja ke localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}