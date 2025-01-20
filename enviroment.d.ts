declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DEV_STORE_NAME: string,
        DEV_STORE_URL: string,
        DEV_STORE_PASSWORD: string
      }
    }
  }
  
  export {};