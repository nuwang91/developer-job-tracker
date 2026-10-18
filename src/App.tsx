import { StatusBadge } from './components/StatusBadge'

function App() {
  return (
    <>
      <StatusBadge status="applied"></StatusBadge>
      <StatusBadge status="interview"></StatusBadge>
      <StatusBadge status="offer"></StatusBadge>
      <StatusBadge status="rejected"></StatusBadge>
    </>
  )
}

export default App
