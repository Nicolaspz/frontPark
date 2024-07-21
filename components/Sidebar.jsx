import React from 'react';
import Link from 'next/link';
import { FiSettings, FiCoffee } from 'react-icons/fi';
import { RxDashboard, RxPerson } from 'react-icons/rx';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useRouter } from 'next/router';

const Sidebar = ({ children }) => {
  const router = useRouter();

  const links = [
    { href: '/', label: 'Home', icon: <FiSettings size={20} /> },
    { href: '/dashboard', label: 'Relatórios', icon: <RxDashboard size={20} /> },
    { href: '/marcacao', label: 'Marcações', icon: <RxDashboard size={20} /> },
    { href: '/user', label: 'Usuários', icon: <RxPerson size={20} /> },
    { href: '/entrada/list', label: 'Entradas', icon: <FiCoffee size={20} /> },
    { href: '/vaga', label: 'Vagas', icon: <HiOutlineShoppingBag size={20} /> },
    { href: '/ocorrencia', label: 'Ocorrência', icon: <RxPerson size={20} /> },
    { href: '/pagamento', label: 'Pagamentos', icon: <RxPerson size={20} /> },
  ];

  return (
    <div className='flex'>
      <div className='fixed w-30 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between'>
        <div className='flex flex-col items-center'>
          {links.map(({ href, label, icon }, index) => (
            <Link key={index} href={href}>
              <div
                style={{ width: '140px' }}
                className={`flex justify-center items-center rounded-lg my-4 p-2 inline-block ${
                  router.pathname === href ? 'bg-purple-800 text-white' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                }`}
              >
                {React.cloneElement(icon, {
                  className: `mr-1 ${router.pathname === href ? 'text-white' : 'text-purple-800'}`,
                })}
                <span className={`${router.pathname === href ? 'text-white' : 'text-purple-800'}`}>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <main className='ml-20 pl-16 w-full'>{children}</main>
    </div>
  );
};

export default Sidebar;
