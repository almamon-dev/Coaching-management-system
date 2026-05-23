import React, { createContext, useContext, useState } from 'react';

const FrontendContext = createContext();

export const FrontendProvider = ({ children }) => {
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [addedProduct, setAddedProduct] = useState(null);
    const [addedQuantity, setAddedQuantity] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    // Persistent Cart State
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    // Sync cart with localStorage
    React.useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item => 
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                image: product.image || (product.primary_image?.full_url),
                quantity: quantity 
            }];
        });
        
        // Open the success modal
        setAddedProduct(product);
        setAddedQuantity(quantity);
        setIsCartModalOpen(true);
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const openCartModal = (product, quantity = 1) => {
        addToCart(product, quantity);
    };

    const closeCartModal = () => setIsCartModalOpen(false);
    const toggleCartSidebar = () => setIsCartOpen(!isCartOpen);

    return (
        <FrontendContext.Provider value={{ 
            isCartModalOpen, 
            addedProduct, 
            addedQuantity,
            isCartOpen, 
            cartItems,
            addToCart,
            removeFromCart,
            openCartModal, 
            closeCartModal, 
            toggleCartSidebar,
            setIsCartOpen
        }}>
            {children}
        </FrontendContext.Provider>
    );
};

export const useFrontend = () => {
    const context = useContext(FrontendContext);
    if (!context) {
        throw new Error('useFrontend must be used within a FrontendProvider');
    }
    return context;
};
