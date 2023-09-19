import { createNextRouteHandler } from 'uploadthing/next'

import { type FileRouter, fileRouter as router } from './core'

export const { GET, POST } = createNextRouteHandler<FileRouter>({ router })
