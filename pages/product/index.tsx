

import Head from "next/head"
import styles from './styles.module.scss'
import {FormEvent, useState, ChangeEvent,useContext,useEffect} from 'react'
import { setupAPIClient } from "../../services/api"
import { toast } from "react-toastify"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { Input } from '../../components/ui/input/index';
import { FiUpload } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar";
import { useRouter } from 'next/router';
import FormProd from "../../components/Fromprod"
import { parse } from 'cookie';
import Category from "../category"

export default function ProdutCreate(){
  const {user} = useContext(AuthContext);
  const [categoryList, setCategoryList] = useState([]);
  const apiClient = setupAPIClient();

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

return(
  <>
   <Head>
    <title>Novo Produto- estudo</title>
    </Head>
    
     
      <Sidebar>
         <Header/>
        <FormProd
        categoryList={categoryList}
        />
      </Sidebar>
  
    
     
     
    
  </>
)
}

