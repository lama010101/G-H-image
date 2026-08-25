import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from './components/Navigation'
import Login from './pages/Login'
import Prompts from './pages/Prompts'
import Gallery from './pages/Gallery'
import Tasks from './pages/Tasks'
import NotFound from './pages/NotFound'
import { ReveGeneratorPage } from '@/pages/ReveGenerator'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<Prompts />} />
                    <Route path="/prompts" element={<Prompts />} />
                    <Route path="/reve" element={<ReveGeneratorPage />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
)

export default App
