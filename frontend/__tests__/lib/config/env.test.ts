/**
 * @jest-environment node
 */

describe('Environment Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should validate required environment variables', () => {
    // Set valid environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    process.env.NODE_ENV = 'test'

    // This should not throw
    expect(() => {
      const { env } = require('@/lib/config/env')
      expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co')
      expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('test-anon-key')
    }).not.toThrow()
  })

  it('should throw on missing required variables', () => {
    // Remove required variables
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    expect(() => {
      require('@/lib/config/env')
    }).toThrow()
  })

  it('should apply default values', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    // NODE_ENV est déjà défini comme 'test' par Jest

    const { env } = require('@/lib/config/env')
    expect(env.NODE_ENV).toBe('test') // Jest définit NODE_ENV comme 'test'
    expect(env.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3000') // default
    expect(env.NEXT_PUBLIC_APP_NAME).toBe('AlloKoli') // default
  })

  it('should transform boolean strings', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    process.env.NEXT_PUBLIC_DEBUG = 'true'
    process.env.NEXT_PUBLIC_USE_DEMO_DATA = 'false'

    const { env } = require('@/lib/config/env')
    expect(env.NEXT_PUBLIC_DEBUG).toBe(true)
    expect(env.NEXT_PUBLIC_USE_DEMO_DATA).toBe(false)
  })

  it('should validate URL formats', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'not-a-url'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

    expect(() => {
      require('@/lib/config/env')
    }).toThrow(/URL valide/)
  })

  it('should provide correct utility functions', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    process.env.NODE_ENV = 'development'

    const { isDevelopment, isProduction, isStaging } = require('@/lib/config/env')
    expect(isDevelopment).toBe(true)
    expect(isProduction).toBe(false)
    expect(isStaging).toBe(false)
  })

  it('should provide correct dev config', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    process.env.NODE_ENV = 'development'
    process.env.NEXT_PUBLIC_DEBUG = 'true'
    process.env.NEXT_PUBLIC_USE_DEMO_DATA = 'true'

    const { devConfig } = require('@/lib/config/env')
    expect(devConfig.skipVapiValidation).toBe(true) // No VAPI_API_KEY set
    expect(devConfig.useDemoData).toBe(true)
    expect(devConfig.enableDebug).toBe(true)
  })

  it('should provide correct app config', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    process.env.VAPI_API_KEY = 'test-vapi-key'
    process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY = 'test-vapi-public-key'

    const { appConfig } = require('@/lib/config/env')
    expect(appConfig.supabase.url).toBe('https://test.supabase.co')
    expect(appConfig.supabase.anonKey).toBe('test-anon-key')
    expect(appConfig.vapi.privateKey).toBe('test-vapi-key')
    expect(appConfig.vapi.publicKey).toBe('test-vapi-public-key')
  })
}) 