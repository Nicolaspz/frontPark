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
import { ModalUniversal } from '../../../components/UniversalModal';
import styles from '../styles.module.scss'


const ProductsList = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [productsData2, setProductsData2] = useState([]);
  const [productsId, setProductsId] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleadd, setModalVisibleadd] = useState(false);
  const [modalUniVisible, setModalUniVisible] = useState(false);
  const [qtd,setQtd]=useState(0);
  const [precoVenda,setPrecoVenda]=useState('');
  const [precoCompra,setPrecoCompra]=useState('');
  const { id } = router.query;
  const [isEdit,setIsEdit]=useState(false);

  const handleQtdChange = (event) => {
    const inputValue = event.target.value;
    // Use parseFloat para garantir que conseguimos um número ou NaN
    const numericValue = parseFloat(inputValue);

    if (!isNaN(numericValue)) {
      // Defina o valor como um número válido
      setQtd(numericValue);
    } else {
      // Se o valor não for um número válido, defina como 0 ou outra lógica desejada
      setQtd(0);
    }
  };
  function handleCloseModal(){
    setModalVisible(false);
  }
  function handleCloseModaladd(){
    setModalVisibleadd(true);
  }
  function handleCloseModaladd2(){
    setModalVisibleadd(false);
    setPrecoCompra('');
      setPrecoVenda('');
  }
  
  function handleCloseModalUni(){
    setModalUniVisible(false);
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
  const fetchData2 = async () => {
    const apiClient = setupAPIClient();
    if (user && user.organization) {
      
      try {
        const response = await apiClient.get('/produts_list_compra', {
          params: {
            purchaseId: id,
          },
        });
        setProductsData2(response.data);
        //console.log(response.data);
      } catch (error) {
        //console.error('Erro ao buscar dados:', error);
        //console.log(error.response);
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchData2();
  }, [user]); // Adicione user como dependência para reagir a alterações em user

  const handleEdit = (selectedId) => {
    
    setProductsId(selectedId)
    setModalVisibleadd(true);
    console.log(productsId);
    setIsEdit(false);
    setQtd(0);
    setPrecoVenda('');
    
  };
  async function handleEditProdCompra(){
    const apiClient = setupAPIClient();
    //console.log(productsId)
    try {
      await apiClient.delete('/remuvProdcompra',{
        params: {
          productId: productsId,
          purchaseId:id,
        },
      });
      //setModalVisible(false);
      fetchData2();
      toast.success("Produto Eliminado com Sucesso!");
      setModalVisible(false);
    } catch (error) {
      //console.error('Erro ao Eliminar produto:', error);
      //console.log(error.response);
     
      fetchData2();
      toast.warning("Produto não pode ser eliminado, está associado a um evento!", {
        autoClose: 10000, // Tempo em milissegundos (5 segundos neste exemplo)
        closeOnClick: true, // Permitir fechamento manual pelo usuário clicando no toast
      });
    }
    
  }

  const handleDelete = (selectedIds) => {
    setProductsId(selectedIds)
    
    setModalVisible(true);
    

  };
  const handleEditCompra = (id,preco,quantity) => {
    setIsEdit(true);
    setQtd(quantity);
    setPrecoVenda(preco);
    setModalVisibleadd(true);
    setProductsId(id);
  }
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
    
    { field: 'name', headerName: 'Nome', width: 150,valueGetter: (params) => params.row.product.name, },
    { field: 'salePrice_unitario', headerName: 'Preço', width: 100 },
    { field: 'quantity', headerName: 'Quantidade', width: 200 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 200,
      renderCell: (params) => (
        <>
        <button
            style={{ ...buttonStyle, backgroundColor: '#FF5733' }}
            onClick={() => handleDelete(params.row.id)}
          >
             <AiOutlineDelete size={20}/>
          </button>
        <button
            style={{ ...buttonStyle, backgroundColor: '#4CAF50' }}
            onClick={() => handleEditCompra(params.row.id,params.row.salePrice_unitario,params.row.quantity)}

          >
             <AiOutlineEdit  size={20}/>
          </button>
        </>
      ),
    },
    // Adicione mais colunas conforme necessário
  ];
  const columns2 = [
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
        <button
          style={{ ...buttonStyle, backgroundColor: '#2b2bae' }}
           onClick={() => handleEdit(params.row.id)} 
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

  async function handleFinishAdd() {
    event.preventDefault();
    const apiClient = setupAPIClient();
    
    // Validação dos campos
    if (!precoCompra || !precoVenda || !qtd) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
  
    if (isNaN(parseFloat(precoCompra)) || isNaN(parseFloat(precoVenda))) {
      toast.error("Os campos de preço e quantidade devem ser valores numéricos.");
      return;
    }
  
    try {

      if (isEdit) {
        // Se for uma edição, faça a chamada de atualização
       {/**  await apiClient.put(`/compra_produt/${productsId}`, {
          purchasePrice: parseFloat(precoCompra),
          quantity: qtd,
          purchaseId: id,
          salePrice_unitario: parseFloat(precoVenda)
        });
        */}
        toast.warning("Método ainda na implementado");
      } else {
        // Se não for uma edição, faça a chamada de adição
        await apiClient.post('/compra_produt', {
          purchasePrice: parseFloat(precoCompra),
          quantity: qtd,
          purchaseId: id,
          productId: productsId,
          productTypeId: "1",
          salePrice_unitario: parseFloat(precoVenda)
        });
      }
  
      setModalVisibleadd(false);
      fetchData2();
      setPrecoCompra('');
      setPrecoVenda('');
      toast.success("Produto Adicionado com Sucesso!");
    } catch (error) {
      
      console.log(error);
      toast.warning("Produto Ja existe na Lista");
    }
  }
  
function addProdu(){
  setModalUniVisible(true)
}

  Modal.setAppElement('#__next');

  return (
    <Sidebar>
      <Header />
      <div className='bg-gray-100 min-h-screen'>
      <div className='flex justify-between px-4 pt-4 pl-16'>
        <h2>Detalhe da compra</h2>
        <button className="">
         <Link 
        href={`/product/`}
         passHref
         className='btn btn-primary'
         > Cancelar a Compra 
         </Link>
         </button>
      </div>
      <div className='p-4'>
        <div className='w-full m-auto border rounded-lg overflow-y-auto'>
      
      <div className='p-4'>
        <div className='w-90 m-auto p-4 border rounded-lg bg-white overflow-y-auto '>
       
       {/*  <form className={styles.form} onSubmit={handleRegister}>
        <input 
        type="text"
        placeholder="Digite o nome do Produto"
        className={styles.input}
        value="{name}"
        onChange="{(e)=>setName(e.target.value)}"
        />
        <input 
        type="text"
        placeholder="Preço do Produto"
        className={styles.input}
        value=""
        onChange="{(e)=>setPreco(e.target.value)}"
        
        />
        
        <button className={styles.buttonAdd} type="submit">
          <h1> Cadastrar</h1>
        </button>
        
      </form>
      */}
        </div>
      </div>
        
        <div className={styles['flex-container']}>
       
  <div className={styles['flex-item']}>
  <h1 className='text-center py-4 font-bold'>Lista dos produtos da compra</h1>
        
    <CustomDataGrid
      rows={productsData2}
      columns={columns}
      fetchDataFn={fetchData2}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
    <div className='w-full h-full flex items-center justify-center py-4'>
  <button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto">
    Salvar a compra
  </button>
</div>
  </div>

  <div className={styles['flex-item']}>
    <div style={{ width: '100%', margin: '2px auto' }}>
    <h1 className='text-center py-4 font-bold'>Lista dos produtos</h1>
      <CustomDataGrid
        rows={productsData}
        columns={columns2}
        fetchDataFn={fetchData}
       
      />
    </div>
  </div>
</div>


      
        </div>
      </div>
</div>
      
     
    { modalVisibleadd && (
        <ModalConfirm
        isOpen={modalVisibleadd}
        onRequestClose={handleCloseModaladd2}
        customStyles={{
          content: {
            width: '50%', // Largura personalizada
            maxWidth: '500px', // Largura máxima personalizada
            height: '60%', // Altura personalizada
            
          },
        }}
      >
          <div className="flex flex-col items-start">
            <h2> {isEdit ? 'Actualizar o produto da compra' : 'Enviar Produto a compra'}</h2>
          <form className={styles.form} onSubmit={handleFinishAdd}>
              <input 
              type="text"
              placeholder="Inserir a quantidade"
              className={styles.input}
              value={qtd}
              onChange={handleQtdChange}
              />
              <input 
              type="text"
              placeholder="Inserir o preço da compra"
              className={styles.input}
              value={precoCompra}
              onChange={(e)=>setPrecoCompra(e.target.value)}
              
              />
              <input 
              type="text"
              placeholder="Inserir o preço da Venda"
              className={styles.input}
              value={precoVenda}
              onChange={(e)=>setPrecoVenda(e.target.value)}
              />
              
              
              <button className={styles.buttonAdd} type="submit">
                <h1>Adicionar</h1>
              </button>
              
            </form>
          </div>
          </ModalConfirm>
      )}
      
      { modalVisible && (
        <ModalConfirm
          isOpen={modalVisible}
          onRequestClose={handleCloseModal}
          customStyles={{
            content: {
              width: '30%', // Largura personalizada
              maxWidth: '350px', // Largura máxima personalizada
              height: '20%', // Altura personalizada
              overflowY: 'hidden',
            },
          }}
        >
          
          <h1 className="font-bold m-4 text-start ">
                    Tem a certeza que quer Eliminar?
          </h1>
          
          <button className="bg-blue-600 w-full sm:w-auto" onClick={handleEditProdCompra}>
                     Sim
          </button>

          </ModalConfirm>
      )}

         
    </Sidebar>
  );
};

export default ProductsList;
