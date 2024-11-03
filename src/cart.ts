import { map } from 'nanostores';

export type CartItem = {
    id: string;
    name: string;
    price: number;
    imgSrc: string;
    quantity: number;
};

export type CartItemInfo = Pick<CartItem, 'id' | 'name' | 'price' | 'imgSrc'>;

export const cartItems = map<Record<string, CartItem>>({});

export function addCartItem({ id, name, imgSrc }: CartItemInfo) {
    const existingEntry = cartItems.get()[id];
    if (existingEntry) {
        cartItems.setKey(id, {
            ...existingEntry,
            quantity: existingEntry.quantity + 1,
        });
    } else {
        cartItems.setKey(id, {
            id,
            name,
            imgSrc,
            price: 0,
            quantity: 1,
        });
    }
}
