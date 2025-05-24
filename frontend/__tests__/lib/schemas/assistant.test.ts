import { validateCreateAssistant, createAssistantSchema, modelSchema, voiceSchema } from '@/lib/schemas/assistant'

describe('Assistant Schemas', () => {
  describe('modelSchema', () => {
    it('should accept string model', () => {
      const result = modelSchema.safeParse('gpt-4')
      expect(result.success).toBe(true)
    })

    it('should accept object model', () => {
      const model = {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000
      }
      const result = modelSchema.safeParse(model)
      expect(result.success).toBe(true)
    })

    it('should reject invalid model', () => {
      const result = modelSchema.safeParse('')
      expect(result.success).toBe(false)
    })
  })

  describe('voiceSchema', () => {
    it('should accept string voice', () => {
      const result = voiceSchema.safeParse('test-voice-id')
      expect(result.success).toBe(true)
    })

    it('should accept object voice', () => {
      const voice = {
        provider: 'elevenlabs',
        voiceId: 'test-voice-id',
        speed: 1.2,
        pitch: 5
      }
      const result = voiceSchema.safeParse(voice)
      expect(result.success).toBe(true)
    })

    it('should reject invalid voice', () => {
      const result = voiceSchema.safeParse('')
      expect(result.success).toBe(false)
    })
  })

  describe('createAssistantSchema', () => {
    const validAssistant = {
      name: 'Test Assistant',
      model: 'gpt-4',
      language: 'fr',
      voice: 'test-voice-id',
      firstMessage: 'Bonjour! Comment puis-je vous aider?',
      instructions: 'Vous êtes un assistant vocal professionnel qui aide les utilisateurs.',
      silenceTimeoutSeconds: 30,
      maxDurationSeconds: 1800,
      endCallAfterSilence: false,
      voiceReflection: true
    }

    it('should validate a complete valid assistant', () => {
      const result = createAssistantSchema.safeParse(validAssistant)
      expect(result.success).toBe(true)
    })

    it('should reject assistant with invalid name', () => {
      const invalidAssistant = { ...validAssistant, name: 'Ab' } // Too short
      const result = createAssistantSchema.safeParse(invalidAssistant)
      expect(result.success).toBe(false)
    })

    it('should reject assistant with invalid firstMessage', () => {
      const invalidAssistant = { ...validAssistant, firstMessage: 'Hi' } // Too short
      const result = createAssistantSchema.safeParse(invalidAssistant)
      expect(result.success).toBe(false)
    })

    it('should reject assistant with invalid instructions', () => {
      const invalidAssistant = { ...validAssistant, instructions: 'Short' } // Too short
      const result = createAssistantSchema.safeParse(invalidAssistant)
      expect(result.success).toBe(false)
    })

    it('should apply default values', () => {
      const minimalAssistant = {
        name: 'Test Assistant',
        model: 'gpt-4',
        voice: 'test-voice-id',
        firstMessage: 'Bonjour! Comment puis-je vous aider?',
        instructions: 'Vous êtes un assistant vocal professionnel qui aide les utilisateurs.'
      }
      const result = createAssistantSchema.safeParse(minimalAssistant)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.language).toBe('fr') // Default value
      }
    })
  })

  describe('validateCreateAssistant', () => {
    const validAssistant = {
      name: 'Test Assistant',
      model: 'gpt-4',
      language: 'fr',
      voice: 'test-voice-id',
      firstMessage: 'Bonjour! Comment puis-je vous aider?',
      instructions: 'Vous êtes un assistant vocal professionnel qui aide les utilisateurs.'
    }

    it('should return success for valid data', () => {
      const result = validateCreateAssistant(validAssistant)
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.error).toBeNull()
    })

    it('should return detailed errors for invalid data', () => {
      const invalidAssistant = { name: 'Ab' } // Missing required fields
      const result = validateCreateAssistant(invalidAssistant)
      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.details).toBeDefined()
      expect(Array.isArray(result.error?.details)).toBe(true)
    })

    it('should handle regex validation errors', () => {
      const invalidAssistant = {
        ...validAssistant,
        name: 'Test@Assistant!' // Invalid characters
      }
      const result = validateCreateAssistant(invalidAssistant)
      expect(result.success).toBe(false)
      expect(result.error?.details?.some(d => d.field === 'name')).toBe(true)
    })

    it('should handle length validation errors', () => {
      const invalidAssistant = {
        ...validAssistant,
        silenceTimeoutSeconds: 500 // Too high
      }
      const result = validateCreateAssistant(invalidAssistant)
      expect(result.success).toBe(false)
      expect(result.error?.details?.some(d => d.field === 'silenceTimeoutSeconds')).toBe(true)
    })
  })
}) 