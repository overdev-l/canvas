import Header from '../header'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <Header />
      <main className="flex-1 w-full h-full flex-col">{children}</main>
    </div>
  )
}

