import './App.css'
import { Layout } from './components/layout/Layout'
import { Routes, Route } from 'react-router-dom'
import WizardContainer from './components/wizard/WizardContainer'
import TuberculosisInfo from './pages/TuberculosisInfo'

function App() {

  return (
    <>
    <Layout>
      <Routes>
        <Route path="/" element={<WizardContainer  />} />
        <Route path="/tuberculosis" element={<TuberculosisInfo />} />
      </Routes>
    </Layout>
    </>
  )
}

export default App
