
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
import { ModalUniversal} from '../../components/UniversalModal'


export default function User(){
  const [name, setName]=useState('')
  const [password, setPassword]=useState('')
  const [passconfirm, setPassconfirm]=useState('')
  const [email, setEmail]=useState('')
  const [roleSelect, setRoleSelect] = useState('');
  const { user } = useContext(AuthContext);
  const [UserData, setUserData] = useState([]);
  const [UserId, setUser] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUniVisible, setModalUniVisible] = useState(false);
  const [isEdit,setIsEdit]=useState(false);

  const options = [
    { key: 'default', value: '', label: 'selecione o perfil' },
    { key: 'ADMIN', value: 'ADMIN', label: 'Admin' },
    { key: 'OPERADOR', value: 'OPERADOR', label: 'Operador' },
    { key: 'GERENTE', value: 'GERENTE', label: 'Gerente' },
  ];


  function handleCloseModal(){
    setModalVisible(false);
    setModalUniVisible(false);
    setIsEdit(false);
    setName('');
    setEmail('');
    setRoleSelect('');
    setPassword('');
    setPassconfirm('');
  }
  function abrirNova(){
    setModalUniVisible(true);
  }
  const fetchData = async () => {
    const apiClient = setupAPIClient();
    if (user && user.organization) {
      
      try {
        const response = await apiClient.get('/users', {
          params: {
            organizationId: user.organization,
          },
        });
        setUserData(response.data);
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

  const handleEdit = (selectedRows,selectname,selectemail,selectrole,selectpassword) => {
    
    setUser(selectedRows)
    setIsEdit(true);
    setName(selectname);
    setEmail(selectemail);
    setRoleSelect(selectrole);
    setPassword(selectpassword);
    setModalUniVisible(true)
    
  };

  const handleDelete = (selectedIds) => {
    setUser(selectedIds)
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
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'role', headerName: 'Role', width: 150 },
   
   
    {
      field: 'actions',
      headerName: 'Ações',
      width: 200,
      renderCell: (params) => (
        <>
        <button
            style={{ ...buttonStyle, backgroundColor: '#FF5733' }}
            onClick={() => handleEdit(params.row.id,params.row.name,params.row.email,params.row.role,params.row.password)}
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
      const response = await apiClient.delete('/user', {
        params: {
          id: UserId,
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

  const handleChangeUser = (event) => {
    setRoleSelect(event.target.value);
  };

  async function handleRegister(event:FormEvent) {
    event.preventDefault()
    const apiClient = setupAPIClient();
    if (isEdit) {
      if(name === '' && email=== '' && password==='' &&  roleSelect ==='' && passconfirm===''){
        toast.warning("deve preencher todos campos");
        return;
      }
      if(password!==passconfirm){
        toast.warning("as senhas não coincidem");
        return;
      }
      await apiClient.put('/user', {name,email,role:roleSelect,password}, { params: { userId: UserId } })
      toast.success('Usuário atualizado com sucesso!');
      setModalUniVisible(false);
      fetchData();
    } else {
      if(name === '' || email=== '' || password==='' ||  roleSelect ==='' || passconfirm===''){
        toast.warning("deve preencher todos campos");
        return;
      }
      await apiClient.post('/users',{name,email,password,role:roleSelect,organizationId:user.organization});
      toast.success('Usuário cadastrado com sucesso!');
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
    <title>Usuário - Parking</title>
    </Head>
    
    <Sidebar>
      <Header/>
      <div className='bg-gray-100 min-h-screen px-8'>
      <div className='flex justify-between px-12 pt-4'>
        <h2>Usuários</h2>
        <button className={styles.buttonAdd} onClick={abrirNova}>Novo Usuário</button>

      </div>
      <div className='p-4 px-14'>
        <div className='w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto px-10'>

        <main className={styles.container}>
    
      <div style={{width:'90%', margin:'2px auto'}}>
      <CustomDataGrid
        rows={UserData}
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
          //handleFinishOrder={handleFinishOrder}
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

{ modalUniVisible && (
        <ModalConfirm
          isOpen={modalUniVisible}
          onRequestClose={handleCloseModal}
          customStyles={{
            content: {
              width: '50%', // Largura personalizada
              maxWidth: '500px', // Largura máxima personalizada
              height: '85%', // Altura personalizada
            },
          }}
        >
          
     <div>
     <h1 className={styles.title}> {isEdit ? ("Editar o Usuário"):("Novo Usuário")}</h1>
     
     <form className={styles.form} onSubmit={handleRegister}>
        <input 
        type="text"
        placeholder="Digite o nome"
        className={styles.input}
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />


        <input 
        type="email"
        placeholder="Digite o email"
        className={styles.input}
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
        <input 
        type="password"
        placeholder="Digite a senha"
        className={styles.input}
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <input 
        type="password"
        placeholder="Confirmar a senhã"
        className={styles.input}
        value={passconfirm}
        onChange={(e)=>setPassconfirm(e.target.value)}
        />

        <select className={styles.selected} value={roleSelect} onChange={handleChangeUser}>
        {options.map((option) => (
          <option key={option.key} value={option.value}>
            {option.label}
          </option>
        ))}
    </select>
      {isEdit ? (
          <button className={styles.buttonAdd} type="submit">Salvar Edição</button>
        ) : (
          <button className={styles.buttonAdd} type="submit">Adicionar Usuário</button>
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