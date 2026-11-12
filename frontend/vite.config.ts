import fs from 'fs'
import path from 'path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Runs the Vercel functions in /api during `npm run dev`, so the bingo works locally without the Vercel CLI.
// Each api/<name>.ts exports GET/POST handlers that take a Request and return a Response, same as on Vercel.
function apiDevServer(): Plugin {
    return {
        name: 'api-dev-server',
        apply: 'serve',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = new URL(req.url ?? '/', 'http://localhost')
                const name = url.pathname.match(/^\/api\/([\w-]+)$/)?.[1]
                if (!name || !fs.existsSync(path.resolve(__dirname, 'api', `${name}.ts`))) return next()

                try {
                    const handlers = await server.ssrLoadModule(`/api/${name}.ts`)
                    const handler = handlers[req.method ?? 'GET']
                    if (typeof handler !== 'function') {
                        res.statusCode = 405
                        return res.end()
                    }

                    const chunks: Buffer[] = []
                    for await (const chunk of req) chunks.push(chunk as Buffer)
                    const headers = new Headers()
                    for (const [key, value] of Object.entries(req.headers)) {
                        if (typeof value === 'string') headers.set(key, value)
                    }
                    const request = new Request(url, {
                        method: req.method,
                        headers,
                        body: chunks.length ? Buffer.concat(chunks) : undefined,
                    })

                    const response: Response = await handler(request)
                    res.statusCode = response.status
                    response.headers.forEach((value, key) => res.setHeader(key, value))
                    res.end(Buffer.from(await response.arrayBuffer()))
                } catch (error) {
                    server.ssrFixStacktrace(error as Error)
                    next(error)
                }
            })
        },
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), apiDevServer()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
