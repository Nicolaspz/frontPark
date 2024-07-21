import { useEffect, useState, useContext } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head';
import styles from './styles.module.scss';

import  Header  from '../../components/Header'
import { FiRefreshCcw } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'

import { ModalOrder } from '../../components/ModalOrder'
import { AuthContext } from '../../contexts/AuthContext';

import Modal from 'react-modal';
import Sidebar from '../../components/Sidebar';

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
  organization:string;
}

interface HomeProps{
  orders: OrderProps[];
}

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product:{
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  }
  order:{
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
  }
}

export default function Dashboard({ orders }: HomeProps){

  const [orderList, setOrderList] = useState([])
  const {user}=useContext(AuthContext)
  const [modalItem, setModalItem] = useState<OrderItemProps[]>()
  const [modalVisible, setModalVisible] = useState(false);
  
 // console.log("Aqui-",user)
  function handleCloseModal(){
    setModalVisible(false);
  }

  async function handleOpenModalView(id: string){
   
     const apiClient = setupAPIClient(); 

     const response = await apiClient.get('/order/details', {
       params:{
        id_order: id,
       } 
     })
     //console.log(response.data);
    setModalItem(response.data);
     setModalVisible(true);

  }


  async function handleFinishItem(id: string){
    const apiClient = setupAPIClient();
    try {
      
    await apiClient.put('/order/finish', {
     order_id:id,
    })

    const response = await apiClient.get('/orders',{
      params:{
        organizationId:user.organization,
      }
    })
    console.log(response.data)
    setOrderList(response.data);
    setModalVisible(false);
    } catch (error) {
      console.log("erro ao finalizar " + error)
    }
  }

  async function handleRefreshOrders() {
  // Verifica se 'user' e 'organization' estão definidos
  if (!user || !user.organization) {
    console.error("Usuário ou organização não definidos.");
    return;
  }

  const apiClient = setupAPIClient();
  console.log(user.organization);

  try {
    const response = await apiClient.get('/orders', {
      params: {
        organizationId: user.organization,
      },
    });
    console.log(response.data)
    // Atualiza a lista de pedidos apenas se 'user' e 'organization' estiverem definidos
    setOrderList(response.data);
  } catch (error) {
    console.error("Erro ao obter ordens:", error);
  }
}


  useEffect(() => {
    // Chame handleRefreshOrders inicialmente apenas se o usuário estiver definido
    if (user) {
      handleRefreshOrders();
    }
  
    // Configure um intervalo para chamar handleRefreshOrders a cada segundo
    /*const intervalId = setInterval(() => {
      // Verifique se o usuário ainda está definido antes de chamar handleRefreshOrders
      if (user) {
        handleRefreshOrders();
      }
    }, 1000);
  
    // Limpe o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);*/
  }, [user]); // Adicione 'user' como uma dependência do useEffect
  

  Modal.setAppElement('#__next');

  return(
    <>
    <Head>
      <title>Estudo</title>
    </Head>
    
      
     <Sidebar>
    
     <Header/>
    <div className='' >
      <main className={styles.container}>

        <div className={styles.containerHeader}>
          
          <h1>Últimos pedidos</h1>
          <h1>  </h1>
          <button onClick={handleRefreshOrders}>
            <FiRefreshCcw size={25} color="#3fffa3"/>
          </button>
        </div>

        <article className={styles.listOrders}>
          {orderList.length === 0 ? (
            <span className={styles.emptyList}>
              {user && user.organization
                ? "Nenhum pedido aberto foi encontrado..."
                : "Carregando informações do usuário..."}
            </span>
          ) : (
            orderList.map(item => (
              <section key={item.id} className={styles.orderItem}> 
                <button onClick={() => handleOpenModalView(item.id)}>
                  <div className={styles.tag}></div>
                  <span>Mesa {item.table}</span>
                </button>
              </section>
            ))
          )}
        </article>

      </main>

      { modalVisible && (
        <ModalOrder
          isOpen={modalVisible}
          onRequestClose={handleCloseModal}
          order={modalItem}
          handleFinishOrder={ handleFinishItem }
        />
      )}

</div>
     </Sidebar>
    

    </>
  )
}
//revisar este código
export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  //const response = await apiClient.get('/orders');
  //console.log(response.data);


  return {
    props: {
      orders: []
    }
  }
})