import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <div className="text-white font-bold text-xl">
                        <Link to="/">Parts Manager</Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-4">
                        <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                        <Link to="/locations" className="text-white hover:text-gray-300">Locations</Link>
                        <Link to="/parts" className="text-white hover:text-gray-300">Parts</Link>
                    </div>

                    {/* Hamburger Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-white focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden mt-4">
                        <div className="flex flex-col space-y-3">
                            <Link 
                                to="/" 
                                className="text-white hover:text-gray-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/locations" 
                                className="text-white hover:text-gray-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Locations
                            </Link>
                            <Link 
                                to="/parts" 
                                className="text-white hover:text-gray-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Parts
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
