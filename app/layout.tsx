import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '鮨心 · 一期一会',
  description: '专为高端日式料理打造的私宴邀请函系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  )
}
