app.get('/carts/:id', (req, res) => {
    const cart = carts.find(c => c.id === req.params.id);
    if (!cart) res.status(404).send('Keranjang tidak ditemukan');
    res.send(cart);
});

// Membuat keranjang baru
app.post('/carts', (req, res) => {
    const newCart = {
        id: req.body.id,
        userId: req.body.userId,
        date: req.body.date,
        products: req.body.products,
        user: req.body.user
    };
    carts.push(newCart);
    res.send(newCart);
});

// Mengupdate keranjang
app.put('/carts/:id', (req, res) => {
    const cart = carts.find(c => c.id === req.params.id);
    if (!cart) res.status(404).send('Keranjang tidak ditemukan');

    cart.userId = req.body.userId;
    cart.date = req.body.date;
    cart.products = req.body.products;
    cart.user = req.body.user;

    res.send(cart);
});

// Menghapus keranjang
app.delete('/carts/:id', (req, res) => {
    const cart = carts.find(c => c.id === req.params.id);
    if (!cart) res.status(404).send('Keranjang tidak ditemukan');

    const index = carts.indexOf(cart);
    carts.splice(index, 1);

    res.send(cart);
});

// Mendapatkan semua item keranjang
app.get('/cartItems', (req, res) => {
    res.json(cartItems);
});

// Mendapatkan item keranjang berdasarkan id
app.get('/cartItems/:id', (req, res) => {
    const cartItem = cartItems.find(c => c.id === req.params.id);
    if (!cartItem) res.status(404).send('Item keranjang tidak ditemukan');
    res.send(cartItem);
});

// Mendapatkan item keranjang berdasarkan userId dan cartId
app.get('/cartItems/:userId/:cartId', (req, res) => {
    const cartItemsForUser = cartItems.filter(c => c.cart.userId === req.params.userId && c.cartId === req.params.cartId);
    if (cartItemsForUser.length === 0) res.status(404).send('Item keranjang tidak ditemukan');
    res.send(cartItemsForUser);
});

// Membuat item keranjang baru
app.post('/cartItems', (req, res) => {
    const newCartItem = {
        id: req.body.id,
        productId: req.body.productId,
        quantity: req.body.quantity,
        cartId: req.body.cartId,
        cart: req.body.cart,
        product: req.body.product
    };
    cartItems.push(newCartItem);
    res.send(newCartItem);
});

// Mengupdate item keranjang
app.put('/cartItems/:id', (req, res) => {
    const cartItem = cartItems.find(c => c.id === req.params.id);
    if (!cartItem) res.status(404).send('Item keranjang tidak ditemukan');

    cartItem.productId = req.body.productId;
    cartItem.quantity = req.body.quantity;
    cartItem.cartId = req.body.cartId;
    cartItem.cart = req.body.cart;
    cartItem.product = req.body.product;

    res.send(cartItem);
});

// Menghapus item keranjang
app.delete('/cartItems/:id', (req, res) => {
    const cartItem = cartItems.find(c => c.id === req.params.id);
    if (!cartItem) res.status(404).send('Item keranjang tidak ditemukan');

    const index = cartItems.indexOf(cartItem);
    cartItems.splice(index, 1);

    res.send(cartItem);
});