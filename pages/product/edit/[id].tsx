
import { useRouter } from 'next/router';
import { useEffect, useContext,useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import Head from 'next/head';
import { setupAPIClient } from '../../../services/api';
import FormProd from '../../../components/Fromprod';

const ProductEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const {user} = useContext(AuthContext);
  const [categoryList, setCategoryList] = useState([]);
  const [initialData, setInitialData] = useState(null);

 
    const fetchData = async () => {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get('/produt',{
          params:{
            productId:id,
          }
        });
        setInitialData(response.data);
        console.log(initialData);
      } catch (error) {
        console.error('Erro ao buscar dados do produto:', error);
      }}
   

  const categories = async ()=>{
    const apiClient = setupAPIClient();
    if (user && user.organization) {
      
      try {
        const response = await apiClient.get('/category', {
          params: {
            organizationId: user.organization,
          },
        });
        setCategoryList(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        console.log(error.response);
      }
    }
  }
  useEffect(()=>{
    categories();
  },[user])


  useEffect(() => {
    // Use o ID conforme necessário, por exemplo, para carregar dados do produto
    if (id) {
      console.log('ID do produto:', id);
      fetchData();
    }
  }, [id]);

  return (
    <div>
      <Head>
    <title>editar produto</title>
    </Head>
      {/* O conteúdo da página de edição */}
      <Sidebar>
         <Header/>
        
         <FormProd
        categoryList={categoryList}
        isEditMode={true}
        initialData={initialData}
        /> 
      </Sidebar>
    
    </div>
  );
};

export default ProductEdit;
