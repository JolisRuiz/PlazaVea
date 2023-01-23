import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Gestor from './Gestor';
import NotFoundPage from './NotFoundPage';
import ResponsiveAppBar from './ResponsiveAppBar';
const usuarioSeleccionado = {
  usuario: '',
  password: '',
  company_id: 3,
  person_id: 3,
  search: 'test',
  created_by: 2,
  updated_by: 2
}

const menuSeleccionado = {
  name: "",
  details: "Es un Dashboard de los usuarios",
  component: "",
  url: "",
  icon: "No definido",
  fatherMenu: 2,
  isVisible: true,
  createdBy: 1,
  createdDate: "2022-05-16T03:00:44",
  updatedBy: 1,
  updatedDate: "2022-05-16T03:00:44"
}
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Gestor controller="Product" map={usuarioSeleccionado} keyTable={"product_id"} rowStatus={"1"} columnName1={"description"} columnName2={"price"} columnName3={"Actions"} />} />
        <Route path='/User' element={<Gestor controller="User" map={usuarioSeleccionado} keyTable={"user_id"} rowStatus={"user_status"} columnName1={"usuario"} columnName2={"password"} columnName3={"Actions"} />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>

  )
}

