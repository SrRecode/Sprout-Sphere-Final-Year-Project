import React from 'react';
import PlaceholderPage from './PlaceholderPage';

const ShippingPage = () => {
  return (
    <PlaceholderPage 
      title="Shipping & Delivery" 
      subtitle="Information about our shipping policies and procedures"
      breadcrumbItems={[{ label: 'Shipping' }]}
    />
  );
};

export default ShippingPage; 