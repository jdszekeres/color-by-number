import * as reactPlugin from 'vite-plugin-react'
import type { UserConfig } from 'vite'

const config: UserConfig = {
    plugins: [reactPlugin],
    base: './',
}

export default config