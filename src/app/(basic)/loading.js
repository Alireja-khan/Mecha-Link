import React from 'react';

const loading = () => {
    return (
            <div className="flex items-center justify-center h-screen w-screen">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
            </div>
    );
};

export default loading;