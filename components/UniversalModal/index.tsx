import Modal from 'react-modal';


import { FiX } from 'react-icons/fi'

import { OrderItemProps } from '../../pages/dashboard'

interface ModalOrderProps{
  isOpen: boolean;
  
  onRequestClose: () => void;
  children?: React.ReactNode;

}

export function ModalUniversal({ isOpen, onRequestClose,children}: ModalOrderProps){

  const customStyles = {
    content:{
      top: '50%',
      bottom: 'auto',
      left: '50%',
      right: 'auto',
      padding: '30px',
      width: '60%',       // Definir a largura desejada aqui
      height: '90%',      // Definir a altura desejada aqui
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1d1d2e'
    },
    container:{
      with:'620px',
      backgroundColor: '#1d1d2e',
      color:'#fff',
      overflowx:'hidden'
    },
    buttonOrder:{
      backgroundColor: '#2b2bae',
      color:'#fff',
      padding: '3px',
     marginTop:'3px',
    },
  };

  return(
   <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={customStyles}
   >

    <button
    type="button"
    onClick={onRequestClose}
    className="react-modal-close"
    style={{ background: 'transparent', border:0 }}
    >
      <FiX size={45} color="#f34748" />
    </button>

    <div  >
         {children}
      </div>

   </Modal>
  )
}