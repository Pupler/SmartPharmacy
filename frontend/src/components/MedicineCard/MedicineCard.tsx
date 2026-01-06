import React from 'react';
import './MedicineCard.css';

interface MedicineCardProps {
    id: number;
    name: string;
    price: number;
    stock: number;
    requiresPrescription: boolean;
    onAddToCart: (id: number, name: string, price: number) => void;
    onRemoveFromCart: (id: number) => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({
    id,
    name,
    price,
    stock,
    requiresPrescription,
    onAddToCart
}) => {

    const isInStock = stock > 0;

    return (
        <div className={`medicine-card medicine-card${id}`}>
            <div className="medicine-header">
                <h3 className="medicine-name">{name}</h3>
                {requiresPrescription && (
                    <div className="prescription-badge">📋 Prescription Required</div>
                )}
            </div>

            <div className="medicine-content">
                <div className="medicine-price">{price} €</div>

                <div className={`stock-status ${isInStock ? "in-stock" : "out-of-stock"}`}>
                    {isInStock ? `In stock: ${stock}` : "Out of stock"}
                </div>
            </div>

            <button className="add-to-cart-btn"
                    disabled={!isInStock}
                    onClick={() => onAddToCart(id, name, price)}
            >
                Add To Cart
            </button>
        </div>
    );
};

export default MedicineCard;