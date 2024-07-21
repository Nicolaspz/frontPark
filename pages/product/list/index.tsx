import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import CustomDataGrid from '../../../components/TableList';
import { setupAPIClient } from '../../../services/api';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { AiOutlineDelete,AiOutlineEdit  } from "react-icons/ai";
import {ImEyePlus} from "react-icons/im"
import Modal from 'react-modal';
import { ModalConfirm } from '../../../components/ModalConfirm';
import {toast} from 'react-toastify'
import { useRouter } from 'next/router';
import Link from 'next/link';
import {API_BASE_URL} from '../../../config'


const ProductsList = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [productsId, setProductsId] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal(){
    setModalVisible(false);
  }
  const fetchData = async () => {
    const apiClient = setupAPIClient();
    if (user && user.organization) {
      
      try {
        const response = await apiClient.get('/produts', {
          params: {
            organizationId: user.organization,
          },
        });
        setProductsData(response.data);
        //console.log(response.data);
      } catch (error) {
        //console.error('Erro ao buscar dados:', error);
        //console.log(error.response);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]); // Adicione user como dependência para reagir a alterações em user

  const handleEdit = (selectedRows) => {
    
    setProductsId(selectedRows)
    const id =selectedRows[0];
    router.push(`/product/edit/${id}`);
    
  };

  const handleDelete = (selectedIds) => {
    setProductsId(selectedIds)
    //console.log('Deletando IDs:', selectedIds);
    setModalVisible(true);
    

  };
  const buttonStyle = {
    margin: '5px',
    padding: '8px 12px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#4CAF50', // Cor de fundo verde
    color: 'white', // Cor do texto branco
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };
 
  const columns = [
    {
      field: 'banner',
      headerName: 'Banner',
      width: 100,
      renderCell: (params) => (
        <img
          src={`${API_BASE_URL}/tmp/${params.row.banner}`}
          alt={params.row.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ),
    },
    { field: 'name', headerName: 'Nome', width: 150 },
    { field: 'description', headerName: 'Descrição', width: 200 },
    { field: 'price', headerName: 'Preço', width: 100 },
    {
      field: 'Category',
      headerName: 'Categoria',
      width: 150,
      valueGetter: (params) => params.row.Category.name,
    },
    
    {
      field: 'actions',
      headerName: 'Ações',
      width: 200,
      renderCell: (params) => (
        <>
        <Link 
        href={`/product/edit/${params.row.id}`}
         passHref
         style={buttonStyle}
         >
           
            <AiOutlineEdit size={20} />
          
        </Link>
          <button
            style={{ ...buttonStyle, backgroundColor: '#FF5733' }}
            onClick={() => handleDelete(params.row.id)}
          >
             <AiOutlineDelete size={20}/>
          </button>

          <button
            style={{ ...buttonStyle, backgroundColor: '#2b2bae' }}
            
          >
             <ImEyePlus size={20}/>
          </button>
        </>
      ),
    },
    // Adicione mais colunas conforme necessário
  ];
  async function handleFinishOrder(){
    const apiClient = setupAPIClient();
    //console.log(productsId)
    try {
      const response = await apiClient.delete('/produt', {
        params: {
          productId: productsId,
        },
      });
      setModalVisible(false);
      fetchData();
      toast.success("Produto Eliminado com Sucesso!");
    } catch (error) {
      //console.error('Erro ao Eliminar produto:', error);
      //console.log(error.response);
      setModalVisible(false);
      fetchData();
      toast.warning("Produto não pode ser eliminado, está associado a um evento!", {
        autoClose: 10000, // Tempo em milissegundos (5 segundos neste exemplo)
        closeOnClick: true, // Permitir fechamento manual pelo usuário clicando no toast
      });
    }
    
  }

  Modal.setAppElement('#__next');

  return (
    <Sidebar>
      <Header />
      <div className='bg-gray-100 min-h-screen'>
      <div className='flex justify-between px-4 pt-4 ml-16'>
        <h2>Produtos</h2>
        <button className="">
         <Link 
        href={`/product/`}
         passHref
         className='btn btn-primary'
         > Novo produto 
         </Link>
         </button>
      </div>
      <div className='p-4'>
        <div className='w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto'>
        
      <div style={{width:'90%', margin:'2px auto'}}>
      <CustomDataGrid
        rows={productsData}
        columns={columns}
        fetchDataFn={fetchData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      </div>
          
        </div>
      </div>
    </div>
      
     

      
      { modalVisible && (
        <ModalConfirm
          isOpen={modalVisible}
          onRequestClose={handleCloseModal}
          
          customStyles={{
            content: {
              width: '30%', // Largura personalizada
              maxWidth: '350px', // Largura máxima personalizada
              height: '30%', // Altura personalizada
              overflowY: 'hidden',
            },
          }}
        >
          
          <h1 className="font-bold m-4 text-start ">
                    Tem a certeza que quer Eliminar?
          </h1>
          
          <button className="bg-blue-600 w-full sm:w-auto" onClick={handleFinishOrder}>
                     Sim
          </button>

          </ModalConfirm>
      )}
    </Sidebar>
  );
};

export default ProductsList;
