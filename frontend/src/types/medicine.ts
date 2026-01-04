export interface Medicine {
    id: number;
    name: string;
    price: number;
    stock: number;
    requiresPrescription: boolean;
}

export interface CartItem extends Medicine {
    quantity: number;
}