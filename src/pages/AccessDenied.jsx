
import React from 'react';

const AccessDenied = () => {
  return (
    <div className='container text-center'> 
      <h1 className='text-danger'>Access Denied</h1>
      <h3 className='text-danger'>Only Admins have permissions to visit this page.</h3>
    </div>
  );
};

export default AccessDenied;
