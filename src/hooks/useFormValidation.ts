import { useState, useCallback } from 'react'

interface ValidationRules {
  [key: string]: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => boolean | string
  }
}

interface ValidationErrors {
  [key: string]: string
}

export function useFormValidation<T extends object>(initialState: T, rules: ValidationRules) {
  const [values, setValues] = useState<T>(initialState)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isValid, setIsValid] = useState(false)

  const validate = useCallback((name: string, value: any) => {
    const rule = rules[name]
    if (!rule) return ''

    if (rule.required && !value) {
      return 'Campo obrigatório'
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `Mínimo de ${rule.minLength} caracteres`
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `Máximo de ${rule.maxLength} caracteres`
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return 'Formato inválido'
    }

    if (rule.custom) {
      const result = rule.custom(value)
      if (typeof result === 'string') return result
      if (!result) return 'Valor inválido'
    }

    return ''
  }, [rules])

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    const error = validate(name as string, value)
    setErrors(prev => ({ ...prev, [name]: error }))
    
    // Verifica se todos os campos obrigatórios estão preenchidos e válidos
    const newErrors = { ...errors, [name]: error }
    const hasErrors = Object.values(newErrors).some(error => error !== '')
    const requiredFilled = Object.keys(rules)
      .filter(key => rules[key].required)
      .every(key => values[key as keyof T])
    
    setIsValid(!hasErrors && requiredFilled)
  }, [rules, validate, errors, values])

  return {
    values,
    errors,
    isValid,
    handleChange,
    setValues
  }
}