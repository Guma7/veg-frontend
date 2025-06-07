'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { FaCamera, FaYoutube } from 'react-icons/fa'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import ImageUploader from '../common/ImageUploader'
import { RichTextEditor } from '../ui/RichTextEditor'
import { TagInput } from '../ui/TagInput'

const FormContainer = styled.form`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`

const ErrorMessage = styled.div`
  background-color: ${props => `${props.theme.colors.error}10` || '#ffebee'};
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  border-left: 4px solid ${props => props.theme.colors.error};
  font-size: 0.9rem;
  white-space: pre-line;
`

const FormSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  background: ${props => props.theme.colors.background.paper};
  margin-bottom: ${props => props.theme.spacing.lg};
`

interface RecipeFormData {
  name: string;
  title?: string;
  recipeClass: string;
  recipe_class?: string;
  style: string;
  genre: string;
  nutritionalLevel?: string;
  nutritional_level?: string;
  doesNotContain?: string;
  does_not_contain?: string;
  traditional?: string;
  ingredients: string;
  instructions: string;
  image?: File;
  youtubeUrl?: string;
  youtube_link?: string;
}

// Campos obrigatórios conforme especificação (1,2,3,4,8,9 são obrigatórios + imagem)
const requiredFields = ['name', 'recipeClass', 'genre', 'style', 'ingredients', 'instructions', 'image'];
// Campos opcionais
const optionalFields = ['nutritionalLevel', 'doesNotContain', 'traditional', 'youtubeUrl'];

const FieldLabel = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
`;

const RequiredMark = styled.span`
  color: ${props => props.theme.colors.error};
  margin-left: 4px;
`;

const RequiredFieldsNote = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.md};
  font-style: italic;
`;

const GenreHint = styled.small`
  display: block;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 4px;
  font-size: 0.8rem;
`

interface RecipeFormProps {
  onSubmit: (data: FormData | RecipeFormData) => void;
  initialData?: Partial<RecipeFormData>;
  isEditing?: boolean;
}

export function RecipeForm({ onSubmit, initialData, isEditing = false }: RecipeFormProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    name: initialData?.title || initialData?.name || '',
    recipeClass: initialData?.recipe_class || initialData?.recipeClass || '',
    style: initialData?.style || '',
    genre: initialData?.genre || '',
    nutritionalLevel: initialData?.nutritional_level || initialData?.nutritionalLevel || '',
    doesNotContain: initialData?.does_not_contain || initialData?.doesNotContain || '',
    traditional: initialData?.traditional || '',
    ingredients: initialData?.ingredients || '',
    instructions: initialData?.instructions || '',
    youtubeUrl: initialData?.youtube_link || initialData?.youtubeUrl || '',
  })
  const [showValidationMessage, setShowValidationMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleChange = (field: keyof RecipeFormData, value: string | string[]) => {
    // Verificar se o valor realmente mudou antes de atualizar o estado
    setFormData(prev => {
      // Para arrays (como tags), verificar se são iguais
      if (Array.isArray(value) && Array.isArray(prev[field])) {
        const prevArray = prev[field] as string[];
        const valueArray = value as string[];
        
        if (prevArray.length === valueArray.length && 
            prevArray.every((item, index) => item === valueArray[index])) {
          return prev; // Não atualizar se os arrays forem iguais
        }
      } else if (prev[field] === value) {
        return prev; // Não atualizar se os valores primitivos forem iguais
      }
      
      return { ...prev, [field]: value };
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar se todos os campos obrigatórios estão preenchidos
    const isValid = requiredFields.filter(field => field !== 'image').every(field => {
      const value = formData[field as keyof RecipeFormData]
      return value !== undefined && value !== ''
    })
    
    // Verificar especificamente se a imagem foi selecionada (apenas para novas receitas)
    if (!isEditing && !formData.image) {
      setShowValidationMessage(true)
      setErrorMessage("É necessário selecionar uma imagem para a receita. O backend exige pelo menos uma imagem.")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    if (!isValid) {
      setShowValidationMessage(true)
      setErrorMessage("Por favor, preencha todos os campos obrigatórios marcados com *")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    // Verificar tamanho da imagem se ela existir
    if (formData.image && formData.image.size > 5 * 1024 * 1024) { // 5MB em bytes
      setErrorMessage("A imagem selecionada excede o tamanho máximo permitido de 5MB. Por favor, selecione uma imagem menor.")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    // Adicionar log para depuração
    console.log('Preparando dados para envio ao servidor...')
    
    const formDataToSend = new FormData()
    
    // Mapeamento dos campos para garantir compatibilidade com o backend
    const fieldMapping: Record<string, string> = {
      // Campos livres - podem aceitar qualquer entrada do usuário
      'name': 'title',  // 'name' deve ser enviado como 'title' para o backend
      'genre': 'genre', 
      'doesNotContain': 'does_not_contain',
      'traditional': 'traditional',
      'ingredients': 'ingredients',
      'instructions': 'instructions',
      'youtubeUrl': 'youtube_link',  // Corrigido para youtube_link conforme modelo no backend
      
      // Campos de seleção - valores pré-definidos
      'recipeClass': 'recipe_class',
      'style': 'style',
      'nutritionalLevel': 'nutritional_level',
      
      // Outros campos
      'image': 'image'
    }
    
    // Lista para verificar se todos os campos obrigatórios foram adicionados ao FormData
    const camposAdicionados: string[] = []
    
    Object.entries(formData).forEach(([key, value]) => {
      const backendKey = fieldMapping[key] || key
      
      // Campos de seleção - enviar exatamente o valor selecionado
      // O backend espera valores específicos para estes campos (em maiúsculas)
      // Os valores já estão em maiúsculas nas opções dos selects (ENTRADA, PRATO_PRINCIPAL, etc.)
      if (["recipeClass", "style", "nutritionalLevel"].includes(key) && typeof value === "string" && value !== '') {
        formDataToSend.append(backendKey, value)
        camposAdicionados.push(key)
      } 
      // Campos de texto livre - aceitar qualquer entrada do usuário
      // O usuário pode escrever como preferir: maiúsculas, minúsculas, espaços, números, etc.
      else if (["name", "genre", "doesNotContain", "traditional", "ingredients", "instructions"].includes(key) && typeof value === "string") {
        // Enviar exatamente como o usuário digitou, sem nenhuma modificação
        formDataToSend.append(backendKey, value)
        camposAdicionados.push(key)
      }
      // Arquivo de imagem
      else if (value instanceof File && value !== null) {
        formDataToSend.append(backendKey, value)
        camposAdicionados.push(key)
      } 
      // Arrays (como tags)
      else if (Array.isArray(value)) {
        formDataToSend.append(backendKey, JSON.stringify(value))
        camposAdicionados.push(key)
      } 
      // Outros valores
      else if (value !== null && value !== undefined) {
        formDataToSend.append(backendKey, String(value))
        camposAdicionados.push(key)
      }
    })
    
    // Verificar se todos os campos obrigatórios foram adicionados ao FormData
    const camposObrigatoriosFaltando = requiredFields.filter(field => !camposAdicionados.includes(field))
    if (camposObrigatoriosFaltando.length > 0) {
      const mensagem = `Erro: Os seguintes campos obrigatórios não foram adicionados ao FormData: ${camposObrigatoriosFaltando.join(', ')}. Verifique se estes campos estão preenchidos corretamente.`
      console.error(mensagem)
      setErrorMessage(mensagem)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    // Log do FormData para depuração
    console.log('FormData criado com sucesso. Campos adicionados:', camposAdicionados)
    console.log('Enviando para o servidor...')
    for (const pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? `Arquivo: ${pair[1].name} (${pair[1].size} bytes)` : pair[1]))
    }
    
    try {
      // Limpa mensagens de erro anteriores
      setErrorMessage('')
      await onSubmit(formDataToSend)
    } catch (error: any) {
      // Exibe detalhes completos do erro do backend
      let errorMsg = "Erro ao criar receita."
      
      // Registra o erro no console para depuração
      console.error('Erro completo ao criar receita:', error)
      
      if (error?.response) {
        try {
          // Tenta obter os dados da resposta como JSON
          const data = await error.response.json?.() || error.response.data || error.response
          errorMsg += "\nStatus: " + error.response.status
          
          // Tratamento específico para erro 400 (Bad Request)
          if (error.response.status === 400) {
            // Se o erro for um objeto vazio ou não tiver detalhes específicos
            if (!data || Object.keys(data).length === 0) {
              errorMsg += "\nMensagem: Verifique se todos os campos obrigatórios estão preenchidos corretamente."
              errorMsg += "\nDica: Certifique-se de que a imagem não excede o tamanho máximo permitido (5MB)."
            } else {
              // Se tiver detalhes específicos do erro
              errorMsg += "\nMensagem: " + (data?.detail || JSON.stringify(data))
              
              // Adiciona mensagens específicas para campos com erro, se disponíveis
              if (typeof data === 'object') {
                Object.entries(data).forEach(([campo, mensagem]) => {
                  if (campo !== 'detail') {
                    const campoTraduzido = fieldMapping[campo] || campo
                    errorMsg += `\n- ${campoTraduzido}: ${mensagem}`
                  }
                })
              }
            }
          } else {
            // Para outros códigos de status
            errorMsg += "\nMensagem: " + (data?.detail || JSON.stringify(data))
          }
        } catch (jsonError) {
          // Se não conseguir obter como JSON, usa a mensagem de erro direta
          errorMsg += "\nStatus: " + (error.response.status || 'Desconhecido')
          errorMsg += "\nMensagem: Erro ao processar resposta do servidor"
        }
      } else if (error?.message && error.message !== 'Erro ao criar receita') {
        // Adiciona a mensagem de erro se não for a mensagem genérica
        errorMsg += "\n" + error.message
      } else if (!error || Object.keys(error || {}).length === 0) {
        // Caso específico para o erro vazio {}
        errorMsg = "Erro ao criar receita: Bad Request (400)\n\nO servidor rejeitou a solicitação, mas não forneceu detalhes específicos.\n\nVerifique os seguintes pontos:\n\n1. Todos os campos obrigatórios estão preenchidos corretamente?\n2. A imagem não excede o tamanho máximo permitido (5MB)?\n3. O formato da imagem é suportado (JPG, PNG, WEBP)?\n4. O conteúdo dos campos está no formato esperado pelo servidor?\n\nSe o problema persistir, tente criar a receita sem a imagem primeiro, e depois edite-a para adicionar a imagem."
      } else {
        // Outros tipos de erro
        errorMsg += "\n" + (typeof error === 'object' ? JSON.stringify(error) : String(error))
      }
      
      console.error('Mensagem de erro formatada:', errorMsg)
      // Exibe o erro no componente em vez de usar alert
      setErrorMessage(errorMsg)
      // Rola a página para o topo para mostrar a mensagem de erro
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      {errorMessage && (
        <ErrorMessage>
          {errorMessage}
        </ErrorMessage>
      )}
      
      {showValidationMessage && (
        <RequiredFieldsNote style={{ color: '#d32f2f' }}>
          Os campos marcados com <RequiredMark>*</RequiredMark> são obrigatórios.
        </RequiredFieldsNote>
      )}
      
      <FormSection>
        <FormGrid>
          <div>
            <FieldLabel htmlFor="name">
              Nome da Receita <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <FieldLabel htmlFor="recipeClass">
              Classe <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <Select
              id="recipeClass"
              options={[
                { value: '', label: 'Selecione uma classe' },
                { value: 'ENTRADA', label: 'Entrada' },
                { value: 'PRATO_PRINCIPAL', label: 'Prato Principal' },
                { value: 'SOBREMESA', label: 'Sobremesa' },
                { value: 'LANCHE', label: 'Lanche' },
                { value: 'ANIVERSARIO_VEGANO', label: 'Aniversário Vegano' },
                { value: 'SUCO', label: 'Suco' },
                { value: 'DRINK', label: 'Drink' },
                { value: 'VEG_FRIOS', label: 'Veg Frios' },
                { value: 'VEG_CARNES', label: 'Veg Carnes' }
              ]}
              value={formData.recipeClass}
              onChange={e => handleChange('recipeClass', e.target.value)}
              required
            />
          </div>

          <div>
            <FieldLabel htmlFor="style">
              Estilo <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <Select
              id="style"
              options={[
                { value: '', label: 'Selecione um estilo' },
                { value: 'GOURMET', label: 'Gourmet' },
                { value: 'CASEIRA', label: 'Caseira' }
              ]}
              value={formData.style}
              onChange={e => handleChange('style', e.target.value)}
              required
            />
          </div>

          <div>
            <FieldLabel htmlFor="genre">
              Gênero <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <Input
              id="genre"
              value={formData.genre}
              onChange={e => handleChange('genre', e.target.value)}
              placeholder="Ex: Pizza, Salada etc"
              required
            />
          </div>

          <div>
            <FieldLabel htmlFor="nutritionalLevel">
              Nível Nutricional
            </FieldLabel>
            <Select
              id="nutritionalLevel"
              options={[
                { value: '', label: 'Selecione um nível' },
                { value: 'BAIXO', label: 'Baixo' },
                { value: 'MEDIO', label: 'Médio' },
                { value: 'ALTO', label: 'Alto' }
              ]}
              value={formData.nutritionalLevel || ''}
              onChange={e => handleChange('nutritionalLevel', e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="doesNotContain">
              Não Contém
            </FieldLabel>
            <Input
              id="doesNotContain"
              value={formData.doesNotContain || ''}
              onChange={e => handleChange('doesNotContain', e.target.value)}
              placeholder="Ex: Açúcar, Glúten etc"
            />
          </div>

          <div>
            <FieldLabel htmlFor="traditional">
              Tradicional
            </FieldLabel>
            <Input
              id="traditional"
              value={formData.traditional || ''}
              onChange={e => handleChange('traditional', e.target.value)}
              placeholder="Ex: Rio Grande do Sul, Japão etc"
            />
          </div>
        </FormGrid>
      </FormSection>



      <FormSection>
        <h2>Imagem</h2>
        <FieldLabel>
          Imagem da Receita <RequiredMark>*</RequiredMark>
        </FieldLabel>
        <RequiredFieldsNote>
          Tamanho máximo permitido: 5MB. Formatos aceitos: JPG, PNG, WEBP.
        </RequiredFieldsNote>
        <ImageUploader
          onChange={(files, primaryIndex) => {
            if (files.length > 0) {
              const file = files[primaryIndex]
              setFormData(prev => ({ ...prev, image: file }))
            } else {
              setFormData(prev => ({ ...prev, image: undefined }))
            }
          }}
        />
        
        <FieldLabel htmlFor="youtubeUrl">
          Vídeo (opcional)
        </FieldLabel>
        <Input
          id="youtubeUrl"
          icon={<FaYoutube />}
          value={formData.youtubeUrl}
          onChange={e => handleChange('youtubeUrl', e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </FormSection>

      <FormSection>
        <h2>Ingredientes <RequiredMark>*</RequiredMark></h2>
        <RequiredFieldsNote>
          Campo livre: você pode escrever os ingredientes da forma que preferir.
        </RequiredFieldsNote>
        <RichTextEditor
          value={formData.ingredients}
          onChange={value => handleChange('ingredients', value)}
          placeholder="Liste os ingredientes..."
          simple={true}
        />
      </FormSection>

      <FormSection>
        <h2>Modo de Preparo <RequiredMark>*</RequiredMark></h2>
        <RequiredFieldsNote>
          Campo livre: você pode descrever o modo de preparo da forma que preferir.
        </RequiredFieldsNote>
        <RichTextEditor
          value={formData.instructions}
          onChange={value => handleChange('instructions', value)}
          placeholder="Descreva o passo a passo..."
        />
      </FormSection>

      <FormSection>
        <Button type="submit" fullwidth>
          Salvar Receita
        </Button>
      </FormSection>
    </FormContainer>
  )
}