import React, { useState } from 'react';
import {HomeSection,DownloadSection,SignupSection, ContactSection}  from '../components/Homesection'
import { BsPersonFill, BsThreeDotsVertical } from 'react-icons/bs';
import styles from '../styles/Home.module.scss';
const customers = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
  <>
    <nav className={`p-4 ${styles.menu}`}>
     <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
          <div className="text-white font-bold text-xl">Logo</div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-white">Home</a>
            
            <a href="#" className="text-white">Abrir Conta</a>
            <a href="#" className="text-white">Contact</a>
          </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
                      </div>
            {isMenuOpen && (
              <div className="md:hidden absolute top-16 left-0 w-full h-2/3 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
                <div className="flex flex-col">
                  <div className="text-white text-2xl">
                    <a href="#" onClick={toggleMenu}>Home</a>
                  </div>
                  <div className="text-white text-2xl">
                    <a href="#" onClick={toggleMenu}>Dowload</a>
                  </div>
                  <div className="text-white text-2xl">
                    <a href="#" onClick={toggleMenu}>Cadastro</a>
                  </div>
                  <div className="text-white text-2xl">
                    <a href="#" onClick={toggleMenu}>Contact</a>
                  </div>
                </div>
              </div>
            )}
          </div>

    </nav>
    <HomeSection/>
    </>
  );
};


export default customers;
