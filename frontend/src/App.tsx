import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import AnalysisPage from './pages/AnalysisPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<AnalysisPage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
          </Routes>
        </motion.div>
      </main>
    </div>
  )
}

export default App
