import { createContext, ReactNode, useState, useEffect } from "react";
import {destroyCookie,setCookie,parseCookies} from 'nookies'
import {toast} from 'react-toastify'
import Router from 'next/router'

import { api } from '../services/apiClients';



type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
  id: string;
  nome: string;
  telefone: string;
  role:string;
  
  
}

type SignInProps = {
  telefone: string;
  password: string;
}

type SignUpProps = {
  nome: string;
  telefone: string;
  password: string;
  role:string,
  
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)


export function signOut(){
  try{
    destroyCookie(undefined, '@sujeitopizza.token')
    Router.push('/')
  }catch{
    console.log('erro ao deslogar')
  }
}

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<UserProps>()
  const isAuthenticated = !!user;
  const inactivityTimeout = 15 * 60 * 1000; 
  let inactivityTimer: NodeJS.Timeout;

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      signOut(); // Chama a função de logout após o tempo de inatividade
    }, inactivityTimeout);
  };

  const handleUserInteraction = () => {
    resetInactivityTimer();
  };

  useEffect(() =>  {
    const checkToken = async () => {
      try {
        const { '@sujeitopizza.token': token } = parseCookies();

        if (token) {
          const response = await api.get('/auth/me');
          const { id, nome, telefone, role} = response.data;
         

          setUser({
            id,
            nome,
            telefone,
            role,
            
          });

          //console.log("Logado");
           //console.log("organization->",organization);
        }
      } catch (error) {
        console.log("Erro ao verificar o token", error);
        signOut();
      }
    };

    checkToken(); // Verifica o token ao carregar o componente

    // Adiciona event listeners para redefinir o temporizador em interações do usuário
    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('mousedown', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    // Inicia o temporizador quando o componente é montado
    resetInactivityTimer();

    return () => {
      // Remove os event listeners e limpa o temporizador quando o componente é desmontado
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      clearTimeout(inactivityTimer);
    };

    // Restante do seu código...

  }, []);

  async function signIn({ telefone, password }: SignInProps){
    try{
      const response = await api.post('/auth/login', {
        telefone,
        password
      })
      toast.success("Logado com sucesso!");
      //console.log("Response-> ",response.data)
      const { id, nome, token,role} = response.data;

      setCookie(undefined, '@sujeitopizza.token', token, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mes
        path: "/" // Quais caminhos terao acesso ao cookie
      })

      setUser({
        id,
        nome,
          telefone,
          role,
          
      })
      console.log(user)
      //Passar para proximas requisiçoes o nosso token
      api.defaults.headers['Authorization'] = `Bearer ${token}`
      
      if(user.role==='admin'){
        Router.push('/dashboard');
      }
      else{
        Router.push('/pedidos');
      }
      


    }catch(err){
      toast.error("Erro ao Logar")
    }
  }


  async function signUp({ nome, telefone, password}: SignUpProps){
    try{
      
      const response = await api.post('/auth/register', {
        nome,
        telefone,
        password,  
      })

      toast.success("Cadastrado com sucesso!")

      Router.push('/')

    }catch(err){
      toast.error("Erro ao se Cadastrar")
    }
  }

  return(
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}