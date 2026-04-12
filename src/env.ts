import {z} from "zod"

const envSchema = z.object({
    VITE_API_KEY:z.string(),
    VITE_BASE_URL:z.string(),
    VITE_IMG_URL:z.string(),
    VITE_BEARER_TOKEN:z.string()
})

export const env = envSchema.parse(import.meta.env)