import { ErrorTestComponent } from './providers/ErrorBoundary/ui/ErrorTestComponent'
import './styles/global.css'

export const App = () => {
  return (
    <div className="app">
      <h1>ClickFood</h1>
      <p>Приложение готово к разработке с архитектурой Feature-Sliced Design! 🚀</p>
      <ErrorTestComponent />
    </div>
  )
}
