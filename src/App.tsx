import { ConfigProvider } from 'antd'
import theme from '@styles/theme'
import Home from './pages/Home'
import '@styles/global.css'
import './App.css'

function App() {
  return (
    <ConfigProvider theme={theme}>
      <Home />
    </ConfigProvider>
  )
}

export default App
