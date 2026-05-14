import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'GoonQL',
  description: 'A GraphQL interface to a curated subset of the EVE SDE.',
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
)

export default RootLayout
