import Layout from '@/components/layout'
import Home from './pages/Home'
import { Toaster } from "@/components/ui/toaster"

function App() {

  return (
      <Layout>
        <Home />
        <Toaster />
      </Layout>
  )
}

export default App
