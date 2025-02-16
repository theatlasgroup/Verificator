declare global {
    namespace NodeJS {
        interface ProcessENV {
            ENVIRONMENT: "DEVELOPMENT" | "TESTING" | "PRODUCTION",
            PORT: number
        }
    }
}

export {};