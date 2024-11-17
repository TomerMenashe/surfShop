import React from 'react';

const PageWrapper = ({ children }) => {
  return (
    <div style={{ paddingTop: '60px', boxSizing: 'border-box' }}>
      {children}
    </div>
  );
};

export default PageWrapper;
