import { RescaleThemeProvider } from './theme'
import Home from './pages/Home'
import '@styles/global.css'
import './App.css'

function App() {
  return (
    <RescaleThemeProvider>
      <Home />
    </RescaleThemeProvider>
  )
}

export default App
