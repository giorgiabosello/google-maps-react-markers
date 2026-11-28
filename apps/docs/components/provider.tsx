'use client'

import { RootProvider } from 'fumadocs-ui/provider/next'
import type { ReactNode } from 'react'
import SearchDialog from './search'

export const Provider = ({ children }: { children: ReactNode }) => (
	<RootProvider search={{ SearchDialog }} theme={{ defaultTheme: 'dark' }}>
		{children}
	</RootProvider>
)
