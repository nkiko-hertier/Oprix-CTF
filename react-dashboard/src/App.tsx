import AppRouter from './components/AppRouter'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <div>
        <Toaster />
        <AppRouter />
      </div>
    </ErrorBoundary>
  )
}

export default App