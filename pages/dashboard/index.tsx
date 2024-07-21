import { useEffect, useState, useContext } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head';
import styles from './styles.module.scss';

import  Header  from '../../components/Header'
import { FiRefreshCcw } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'

import { ModalOrder } from '../../components/ModalOrder'
import { AuthContext } from '../../contexts/AuthContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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

  const areaChartData = [
    { name: 'Janeiro', uv: 4000 },
    { name: 'Fevereiro', uv: 3000 },
    { name: 'Março', uv: 2000 },
    { name: 'Abril', uv: 2780 },
    { name: 'Maio', uv: 1890 },
    { name: 'Junho', uv: 2390 },
    { name: 'Julho', uv: 3490 },
  ];

  const barChartData = [
    { name: 'Janeiro', pv: 2400 },
    { name: 'Fevereiro', pv: 1398 },
    { name: 'Março', pv: 9800 },
    { name: 'Abril', pv: 3908 },
    { name: 'Maio', pv: 4800 },
    { name: 'Junho', pv: 3800 },
    { name: 'Julho', pv: 4300 },
  ];

  const composedChartData = [
    { name: 'Janeiro', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Fevereiro', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Março', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Abril', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Maio', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Junho', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Julho', uv: 3490, pv: 4300, amt: 2100 },
  ];

  const pieChartData = [
    { name: 'Grupo A', value: 400 },
    { name: 'Grupo B', value: 300 },
    { name: 'Grupo C', value: 300 },
    { name: 'Grupo D', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
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
      <title>Dashboard</title>
    </Head>
    
      
     <Sidebar>
    
     <Header/>
    <div className='' >
    <h1 className='text-black text-start pl-16'>Dasboard</h1>
      <main className="">

       

        <div className="grid grid-cols-2 gap-4 m-20 mr-16">
      {/* Primeira Linha */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Saidas </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={areaChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Pagamentos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Segunda Linha */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Entradas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={areaChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Vagas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart width={400} height={300}>
            <Pie
              data={barChartData}
              dataKey="pv"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={(entry) => entry.name}
            >
              {barChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

      </main>

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