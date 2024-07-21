import React,{ useContext, useState } from 'react';
import Modal from 'react-modal';
import router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import { data } from '../../data/data.js';
import Sidebar from '../../components/Sidebar'
import Header from  '../../components/Header'
import { ModalConfirm } from '../../components/ModalConfirm';
import { setupAPIClient } from "../../services/api"
import { AuthContext } from '../../contexts/AuthContext';
import {toast} from 'react-toastify'


const orders = () => {

  const [compraId, setCompraId] = useState(null);
  const { user } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
    //setCompraId(null);
  };
  
  
  
  const router = useRouter();
  const [compras, setCompras] = useState([]);

  const fetchData2 = async (id) => {
    const apiClient = setupAPIClient();
    if (user && user.organization) {
      
      try {
        const response = await apiClient.get('/produts_list_compra', {
          params: {
            purchaseId: id,
          },
        });
        console.log(response.data);
        const productsArray = response.data;
        const formattedData = productsArray.map(item => ({
        productId:item.productId,
        salePrice_unitario:item.salePrice_unitario,
        quantity: item.quantity, 
    }));
    console.log(formattedData);

    await apiClient.post('/stock', {
      products: formattedData,
      organizationId: user.organization,
      purchaseId: id,
    });
    toast.success("compra enviada ao Stock com sucesso!");
    setModalVisible(false);
    fetchData();

      } catch (error) {
        
      }
    }
  };


  const adicionarAoStock = (id) => {
    router.push(`/compra/nova/${id}`);
    //console.log(compraId)
  };

  const enviarAoStock = (id) => {
   setCompraId(id);
   setModalVisible(true);

    };
  async function createCompra() {
    const apiClient = setupAPIClient();
  
    if (user && user.organization) {
      try {
        const response = await apiClient.post('/compra',{name:"Default",description:"Default",qtdCompra:0,organizationId:user.organization,SupplierId:"1",});
  
        console.log(response.data.id);
        router.push(`/compra/nova/${response.data.id}`);
        // Sucesso - Você pode adicionar mais lógica aqui, se necessário
      } catch (error) {
        console.error("Erro ao criar compra:", error);
  
        // Adicione manipulação de erros para entender melhor o problema
        if (error.response) {
          console.error("Status do erro:", error.response.status);
          console.error("Detalhes do erro:", error.response.data);
        } else if (error.request) {
          console.error("Erro na requisição:", error.request);
        } else {
          console.error("Erro inesperado:", error.message);
        }
  
        // Trate o erro de acordo com sua lógica de negócios
      }
    }
  }
  async function EnviarAoStok() {
    const apiClient = setupAPIClient();
  
    if (user && user.organization) {
      try {
        const response = await apiClient.post('/compra',{name:"Default",description:"Default",qtdCompra:0,organizationId:user.organization,SupplierId:"1",});
  
        console.log(response.data.id);
        router.push(`/compra/nova/${response.data.id}`);
        // Sucesso - Você pode adicionar mais lógica aqui, se necessário
      } catch (error) {
        console.error("Erro ao criar compra:", error);
  
        // Adicione manipulação de erros para entender melhor o problema
        if (error.response) {
          console.error("Status do erro:", error.response.status);
          console.error("Detalhes do erro:", error.response.data);
        } else if (error.request) {
          console.error("Erro na requisição:", error.request);
        } else {
          console.error("Erro inesperado:", error.message);
        }
  
        // Trate o erro de acordo com sua lógica de negócios
      }
    }
  }
  const fetchData = async () => {
    const apiClient = setupAPIClient();
    if (user && user.organization) {
      
      try {
        const response = await apiClient.get('/compra', {
          params: {
            organizationId: user.organization,
          },
        });
        setCompras(response.data);
        //console.log(response.data);
      } catch (error) {
        //console.error('Erro ao buscar dados:', error);
        //console.log(error.response);
      }
    }
  };
  function handleAceitar(){
    fetchData2(compraId);
  }
  useEffect(() => {
    
   
    console.log(compraId);
  
  }, [compraId]);

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
   <Sidebar>
    <Header/>
     <div className='bg-gray-100 min-h-screen'>
      <div className='flex justify-between ml-24 pt-4'>
      <h1 className='text-center py-4 font-bold'>Compras</h1>
        
        <button onClick={createCompra} className='bg-green-500 text-white px-4 py-2 rounded mr-2'>Nova Compra</button>

      </div>
      <div className='p-4 ml-20'>
        <div className='w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto'>
        {compras.map((compra) => (
        <div key={compra.id} className="bg-gray-100 rounded-md p-4 mb-4 flex justify-between items-center">
          <div>
            <p className="text-lg font-bold">{compra.name}</p>
            <p className="text-gray-500"> <strong>Descrição</strong> {compra.description}</p>
            <p className="text-gray-500">Quantidade: {compra.qtdCompra}</p>
            
          </div>
          <div className="flex items-end">
          
          <button
            onClick={() => adicionarAoStock(compra.id)}
            className={`bg-green-500 text-white px-4 py-2 rounded mr-2 ${
              compra.status === true ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
            }`}
            disabled={compra.status === 'true'}
          >
            Editar a Compra
  </button>
  <button
    onClick={() => enviarAoStock(compra.id)}
    className={`bg-blue-500 text-white px-4 py-2 rounded ${
      compra.status === true ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
    }`}
    disabled={compra.status === 'true'}
  >
    Enviar ao Stock
  </button>
          </div>
        </div>
      ))}

     
    
        
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
              maxWidth: '400px', // Largura máxima personalizada
              height: '30%', // Altura personalizada
              overflowY: 'hidden',
            },
          }}
        >
          
          <h1 className="font-bold m-4 text-start ">
          Tem a Certeza que quer Enviar ao Stock?
          
          </h1>
          
          
          <button className="bg-blue-600 w-full sm:w-auto" onClick={handleAceitar}>
                     Sim
          </button>

          </ModalConfirm>
      )}
    
   </Sidebar>
  );
};

export default orders;
