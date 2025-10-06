import React from 'react';

const loading = () => {
    return (
            <div className="flex items-center justify-center h-screen w-full bg-base-100">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
            </div>
    );
};

export default loading;