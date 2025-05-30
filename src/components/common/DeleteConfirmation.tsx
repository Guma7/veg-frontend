'use client'
import styled from 'styled-components'

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
`

const Button = styled.button<{ $variant?: 'danger' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  background: ${props => props.$variant === 'danger' ? props.theme.colors.error : props.theme.colors.secondary};
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

interface Props {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  message: string
}

export default function DeleteConfirmation({ isOpen, onConfirm, onCancel, message }: Props) {
  if (!isOpen) return null

  return (
    <>
      <Overlay onClick={onCancel} />
      <Modal>
        <h3>Confirmar Exclusão</h3>
        <p>{message}</p>
        <ButtonGroup>
          <Button $variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button $variant="danger" onClick={onConfirm}>
            Excluir
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  )
}