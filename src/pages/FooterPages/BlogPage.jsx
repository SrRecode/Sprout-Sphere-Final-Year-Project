import React from 'react';
import PlaceholderPage from './PlaceholderPage';

const BlogPage = () => {
  return (
    <PlaceholderPage 
      title="SproutSphere Blog" 
      subtitle="Insights and inspiration for plant lovers"
      breadcrumbItems={[{ label: 'Blog' }]}
    />
  );
};

export default BlogPage; 