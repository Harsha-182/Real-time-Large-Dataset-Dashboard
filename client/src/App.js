import './App.css';
import NavRoutes from './routes'

const App = () => {
  const pathName = window.location.pathname;

  let authToken = localStorage.getItem('authToken')

  if(!authToken && pathName !== '/login') {
        window.location.href = '/login';
  }
  return (
    <div>
      <NavRoutes/>
    </div>
  );
}

export default App;
