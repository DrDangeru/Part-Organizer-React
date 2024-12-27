// import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-8">Welcome to Parts Manager</h1>
                <p className="text-xl mb-12 text-gray-600">
                    Organize and track your parts inventory efficiently
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Link 
                        to="/locations" 
                        className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <h2 className="text-2xl font-bold mb-4">Manage Locations</h2>
                        <p className="text-gray-600">
                            Create and organize storage locations for your parts
                        </p>
                    </Link>
                    
                    <Link 
                        to="/parts" 
                        className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <h2 className="text-2xl font-bold mb-4">Manage Parts</h2>
                        <p className="text-gray-600">
                            Add and track parts in your inventory
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
