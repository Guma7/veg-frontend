'use client'

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import styled from 'styled-components';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const ModalBody = styled.div`
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
  
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
  }
  
  h4 {
    margin-top: 16px;
    margin-bottom: 8px;
  }
  
  p {
    margin-bottom: 12px;
    line-height: 1.5;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #eee;
`;

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Termos e Condições</h2>
      <ModalBody>
        <h3>Termos de Uso da Plataforma Vegan World</h3>
        
        <p>Bem-vindo à Vegan World! Ao se registrar e usar nossa plataforma, você concorda com os seguintes termos:</p>
        
        <h4>1. Aceitação dos Termos</h4>
        <p>Ao acessar ou usar nosso serviço, você concorda em cumprir estes Termos de Serviço e todas as leis e regulamentos aplicáveis.</p>
        
        <h4>2. Conteúdo do Usuário</h4>
        <p>Ao compartilhar receitas e outros conteúdos, você mantém seus direitos autorais, mas concede à Vegan World uma licença para usar, modificar, executar, exibir e distribuir seu conteúdo.</p>
        
        <h4>3. Conduta do Usuário</h4>
        <p>Você concorda em não usar a plataforma para fins ilegais ou não autorizados. Não deve publicar conteúdo ofensivo, difamatório ou que viole direitos de terceiros.</p>
        
        <h4>4. Privacidade</h4>
        <p>Nossa Política de Privacidade descreve como coletamos, usamos e compartilhamos suas informações pessoais.</p>
        
        <h4>5. Modificações dos Termos</h4>
        <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas aos usuários.</p>
      </ModalBody>
      <ModalFooter>
        <Button $variant="outline" onClick={onClose}>Recusar</Button>
        <Button onClick={onAccept}>Aceitar</Button>
      </ModalFooter>
    </Modal>
  );
}