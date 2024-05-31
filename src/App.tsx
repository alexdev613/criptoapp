import { router } from './router';
import { RouterProvider } from 'react-router-dom';

function App() {

  return (
    <div>
      <h1>CRIPTOAPP</h1>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
