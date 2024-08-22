import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Google Maps React Markers',
	description:
		'Google Maps library that accepts markers as react components, works with React 18+ and it is fully typed.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" dir="ltr">
			<body className={inter.className}>{children}</body>
		</html>
	)
}
