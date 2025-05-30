import { Recipe } from './recipe'

export interface ImageUploaderProps {
  onChange: (files: File[], primaryIndex: number) => void
  maxFiles?: number
}

export interface RecipeFormProps {
  initialData?: Partial<Recipe>
  onSubmit?: (data: FormData) => Promise<void>
}

export interface RecipePreviewProps {
  data: Partial<Recipe>
  images: string[]
  tags: string[]
}

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
  placeholder?: string
}