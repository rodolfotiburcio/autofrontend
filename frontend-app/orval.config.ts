import { defineConfig } from 'orval'

export default defineConfig({
    api: {
        output: {
            mode: 'split',
            target: './src/api',
            client: 'react-query',      // genera hooks useGetX, usePostY…
            prettier: true,
        },
        input: './openapi.json',
    },
});