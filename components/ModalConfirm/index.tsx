import Modal, { Styles } from 'react-modal';
import { FiX } from 'react-icons/fi';
import { OrderItemProps } from '../../pages/dashboard';

interface ModalOrderProps {
  isOpen: boolean;
  onRequestClose: () => void;
  handleFinishOrder?: () => void;
  children?: React.ReactNode;
  customStyles?: Styles;
}

export function ModalConfirm({ isOpen, onRequestClose, handleFinishOrder, children, customStyles }: ModalOrderProps) {
  const defaultStyles = {
    content: {
      top: '50%',
      bottom: 'auto',
      left: '50%',
      right: 'auto',
      padding: '30px',
      width: '50%', // Largura padrão
      maxWidth: '',
      height: '50%', // Altura padrão
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1d1d2e',
      overflowX: 'hidden',
      
      
    },
    container: {
      width: '620px',
      backgroundColor: '#1d1d2e',
      color: '#fff',
      overflowX: 'hidden',
    },
    buttonOrder: {
      backgroundColor: '#2b2bae',
      color: '#fff',
      padding: '3px',
      marginTop: '3px',
    },
  };

  const mergedStyles = {
    content: {
      ...defaultStyles.content,
      ...customStyles?.content,
    },
    container: {
      ...defaultStyles.container,
      
    },
    buttonOrder: {
      ...defaultStyles.buttonOrder,
      
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={{ content: mergedStyles.content }}>
      <button
        type="button"
        onClick={onRequestClose}
        className="react-modal-close"
        style={{ background: 'transparent', border: 0 }}
      >
        <FiX size={45} color="#f34748" />
      </button>

      <div style={mergedStyles.container}>{children}</div>
    </Modal>
  );
}
