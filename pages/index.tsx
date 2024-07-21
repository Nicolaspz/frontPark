import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from '../styles/Home.module.scss';

import logoImg from '../public/Logo.png';
import { Input, TextArea } from "../components/ui/input";
import { Button } from "../components/ui/Button";
import Link from "next/link";
import { AuthContext } from "../contexts/AuthContext";
import {toast} from 'react-toastify'

import { canSSRGuest } from '../utils/canSSRGuest';

export default function Home() {
  const {signIn}= useContext(AuthContext)
  const [telefone, setTelefone]= useState('');
  const [password, setPassword]= useState('');
  const [loading, setLoading]= useState(false);
  async function handleLogin(event:FormEvent){
    event.preventDefault();
    if(telefone === '' || password === ''){
      toast.warning("Preencha Todos os Campos");
      return;
    }
    setLoading(true);
    
    let data={
      telefone,
      password
    }
   await signIn(data)

   setLoading(false);
  }
  return (
  <>
  <Head>
    <title>
      Parking - Faça Login
    </title>
  </Head>
   <div className={styles.containerCenter}>
  <Image src={logoImg} className={styles.logo} alt="Logo Sujeito Pizzaria" />
  
  <div className={styles.login}>
    <h1>Login</h1>
   <form  onSubmit={handleLogin}>
    
    <Input
    placeholder="Digite o seu Telefone"
    type="text"
    value={telefone}
    onChange={(e)=>setTelefone(e.target.value)}
    />
    <Input
    placeholder="Digite a Senha"
    type="password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    />
   
    <Button 
    type="submit"
    loading={loading}>
      enviar
    </Button>
   </form>

  </div>
 <Link href="/signup">
  <p className={styles.text}> não possui uma conta ? Cadastra-se</p>
</Link>

  </div>
  </> 
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
return {
  props:{}
}

})
