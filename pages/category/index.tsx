
import Header from "../../components/Header"
import Head from "next/head"
import styles from './styles.module.scss'
import {FormEvent, useState,useContext, useEffect} from 'react'
import { setupAPIClient } from "../../services/api"
import { toast } from "react-toastify"
import { canSSRAuth } from "../../utils/canSSRAuth"
import Sidebar from "../../components/Sidebar"
import CustomDataGrid from "../../components/TableList"
import { AiOutlineDelete,AiOutlineEdit  } from "react-icons/ai";
import {ImEyePlus} from "react-icons/im"
import router, { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthContext } from '../../contexts/AuthContext';
import { Modal } from "@mui/material"
import { API_BASE_URL } from "../../config"
import { ModalConfirm } from '../../components/ModalConfirm';
import { Input } from '../../components/ui/input/index';
import {ModalUniversal} from '../../components/UniversalModal'


export default function Category(){
  const [name, setName]=useState('')
  const { user } = useContext(AuthContext);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryId, setCategory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUniVisible, setModalUniVisible] = useState(false);
  const [isEdit,setIsEdit]=useState(false);
  function handleCloseModal(){
    setModalVisible(false);
    setModalUniVisible(false);
    setIsEdit(false);
    setName('');
  }
  function abrirNova(){
    setModalUniVisible(true);
  }
  const fetchData = async () => {
    const apiClient = setupAPIClient();
    if (user && user.organization) {
      
      try {
        const response = await apiClient.get('/category', {
          params: {
            organizationId: user.organization,
          },
        });
        setCategoryData(response.data);
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

  const handleEdit = (selectedRows,selectname) => {
    
    setCategory(selectedRows)
    setIsEdit(true);
    setName(selectname);
    setModalUniVisible(true)
    
  };

  const handleDelete = (selectedIds) => {
    setCategory(selectedIds)
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
  
    { field: 'name', headerName: 'Nome', width: 150 },
   
   
    {
      field: 'actions',
      headerName: 'Ações',
      width: 200,
      renderCell: (params) => (
        <>
        <button
            style={{ ...buttonStyle, backgroundColor: '#FF5733' }}
            onClick={() => handleEdit(params.row.id,params.row.name)}
          >
             <AiOutlineEdit size={20} />
          </button>
           
            
          
        
          <button
            style={{ ...buttonStyle, backgroundColor: '#FF5733' }}
            onClick={() => handleDelete(params.row.id)}
          >
             <AiOutlineDelete size={20}/>
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
      const response = await apiClient.delete('/category', {
        params: {
          id: categoryId,
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

 

  async function handleRegister(event:FormEvent) {
    event.preventDefault()
    if(name === ''){
      return;
    }
    const apiClient = setupAPIClient();
    if (isEdit) {
      // Lógica para atualização
      await apiClient.put('/category', {name}, { params: { id: categoryId } })
      toast.success('Categoria atualizada com sucesso!');
      setModalUniVisible(false);
      fetchData();
    } else {
      // Lógica para adição
      await apiClient.post('/category',{name,organizationId:user?.organization});
      toast.success('Categoria cadastrada com sucesso!');
      setModalUniVisible(false);
      fetchData();
    }

    // Limpeza do formulário
    setName('');
    setIsEdit(false);
  }
  //
return(
  <>
   <Head>
    <title>Nova categorias - Sujeito Pizzaria</title>
    </Head>
    
    <Sidebar>
      <Header/>
   
      <div className='bg-gray-100 min-h-screen px-8'>
      <div className='flex justify-between mx-4 pt-4 mx-12'>
        <h2>Categorias</h2>
        <button className={styles.buttonAdd} onClick={abrirNova}>Nova Categoria</button>

      </div>
      <div className='p-4 px-8'>
        <div className='w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto ml-10 mr-2'>
         <main className={styles.container}>
      <div style={{width:'90%', margin:'2px auto'}}>
      <CustomDataGrid
        rows={categoryData}
        columns={columns}
        fetchDataFn={fetchData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      </div>
     </main>
          
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
              height: '20%', // Altura personalizada
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

{ modalUniVisible && (
        <ModalConfirm
          isOpen={modalUniVisible}
          onRequestClose={handleCloseModal}
          customStyles={{
            content: {
              width: '70%', // Largura personalizada
              maxWidth: '700px', // Largura máxima personalizada
              height: '50%', // Altura personalizada
              overflowY: 'hidden',
            },
          }}
        
          >
          
     <div>
     <h1 className={styles.title} > {isEdit ? ("Editar o Produto"):("Novo Produto")}</h1>
     <form className={styles.form} onSubmit={handleRegister}>
        <input 
        type="text"
        placeholder="Digite o nome da categoria"
        className={styles.input}
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />
       
        {isEdit ? (
          <button className={styles.buttonAdd} type="submit">Salvar Edição</button>
        ) : (
          <button className={styles.buttonAdd} type="submit">Adicionar Categoria</button>
        )}
        
        
      </form>
     </div>

        </ModalConfirm>
      )}
    </Sidebar>
     
     
    
  </>
)
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props:{}
  }
})