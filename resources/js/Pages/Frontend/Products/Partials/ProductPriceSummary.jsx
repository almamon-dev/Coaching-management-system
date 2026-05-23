import React from 'react';

const ProductPriceSummary = ({ product }) => {
    if (!product) return null;

    const formattedPrice = new Intl.NumberFormat('en-BD').format(product.price);

    return (
        <></>
    );
};

export default ProductPriceSummary;
