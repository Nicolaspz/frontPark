

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
import Category from '../../pages/category/index';
import {API_BASE_URL} from '../../config'



type ItemProps={
  id:string,
  name:string,
  organizationId:string
}
interface CategoryProps{
  categoryList:ItemProps[]
  isEditMode?: boolean;
  initialData?: {
    id: string;
    name: string;
    price: string;
    description: string;
    categoryId: string;
    banner: string;
    Category:{
      name:string
    }
    // Adicione outras propriedades conforme necessário
  };
}

export default function FormProd({categoryList, isEditMode = false, initialData }: CategoryProps){
  const router = useRouter();
  const {user}= useContext(AuthContext);
  const [name, setName]=useState('') //description
  const [preco, setPreco]=useState('')
  const [description, setDescription]=useState('')
  const [avatarUrl, setvatarUrl]=useState('')
  const [imageVatar, setIamgeVatar]=useState(null)
  const [categoriaSelect, setCategoriaSelect]=useState(0)
  const [category, setCategory]=useState('')
 
  
  //console.log(JSON.stringify(categoryList, null, 2));
  console.log(initialData);
  console.log(category);
  useEffect(() => {
    if (isEditMode && initialData) {
      // Preencha os campos do formulário com os dados iniciais
      setName(initialData.name);
      setPreco(initialData.price);
      setDescription(initialData.description);
      setCategory(initialData.Category.name);
      const foundIndex = categoryList.findIndex(
        (item) => item.name === initialData.Category.name
      );
      if (foundIndex !== -1) {
        setCategoriaSelect(foundIndex);
      }
      const imageUrl = `${API_BASE_URL}/tmp/${initialData.banner}`;
    setvatarUrl(imageUrl); // Suponha que 'imageUrl' seja o campo que contém a URL da imagem.
    setIamgeVatar(imageUrl);
    }
    
  }, [isEditMode, initialData, categoryList]);

  
  
  async function handleRegister(event:FormEvent) {
    event.preventDefault()
   try {
    const data =new FormData();
    if(name === '' || preco === '' || description === '' || imageVatar === null ){
      toast.error("Preencha todos os campos!");
      return;
    }
    data.append('name', name);
    data.append('price', preco);
    data.append('description', description);
    data.append('categoryId', categoryList[categoriaSelect].id);
    data.append('file', imageVatar);
    data.append('organizationId',"user.organization");

    const apiClient = setupAPIClient();
    if (isEditMode) {
      // Lógica para editar o produto
      await apiClient.put('/produt', data, { params: { id: initialData.id } });
      toast.success('Produto atualizado com sucesso!');
      router.push('/product/list');
    } else {
      // Lógica para adicionar um novo produto
      await apiClient.post('/produts', data);
      toast.success('Produto cadastrado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao cadastrar/editar produto:', error);
    toast.error('Ops, ocorreu um erro!');
    return;
  }
   setName('');
   setDescription('');
   setPreco('');
   setIamgeVatar(null);
   setvatarUrl('');
    
  }
  function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(!e.target.files){
      return;
    }
    const image=e.target.files[0];
    if(!image){
      return;
    }
    if(image.type === 'image/jpeg' || image.type === 'image/png'){
      setIamgeVatar(image);
      setvatarUrl(URL.createObjectURL(e.target.files[0]));

    }
  }
  function handleChangeCategory(event){
    setCategoriaSelect(event.target.value)
  }


return(
  <>
  
      <main className={styles.container}>
      <h1>{isEditMode ? 'Editar produto' : 'Novo produto'}</h1>
      <form className={styles.form} onSubmit={handleRegister}>
        <label className={styles.labelAvatar}>
          <span>
            <FiUpload size={30} color="#fff" />
          </span>
          <input type="file"  accept="image/png, image/jpeg" onChange={handleFile} />
          {avatarUrl &&
            <img 
            src={avatarUrl}
            className={styles.preview}
            alt="Foto do produto" 
            width={250}
            height={250}
           
           />
          }
          
        </label>
        <select value={categoriaSelect} onChange={handleChangeCategory}>
          {categoryList.map((item, index)=>{
            return(
              <option
               key={item.id} 
               value={index}
               
            >
              {item.name}
              </option>
            )
          })}
        </select>
        <input 
        type="text"
        placeholder="Digite o nome do Produto"
        className={styles.input}
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />
        <input 
        type="text"
        placeholder="Preço do Produto"
        className={styles.input}
        value={preco}
        onChange={(e)=>setPreco(e.target.value)}
        
        />
        <textarea
        placeholder="descrição do Produto"
        className={styles.input} 
        value={description}
        onChange={(e)=>setDescription(e.target.value)}/>
        
        <button className={styles.buttonAdd} type="submit">
          <h1>{isEditMode ? 'Salvar a alteração' : 'Cadastrar'}</h1>
        </button>
        
      </form>
     </main>
  </>
)
}
