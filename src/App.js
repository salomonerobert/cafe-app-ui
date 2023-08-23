import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import CafeTable from './components/CafeTable';
import EmployeeTable from './components/EmployeeTable';
import CafeAddEdit from './components/CafeAddEdit';
import EmployeeAddEdit from './components/EmployeeAddEdit';

function App() {
  return (
    <Router>
        <Header/>
        <Routes>
          <Route path='/' exact Component={CafeTable} />
          <Route path="/employees" Component={EmployeeTable} />
          <Route path="/edit-add-cafes" Component={CafeAddEdit} />
          <Route path="/edit-add-employees" Component={EmployeeAddEdit} />
        </Routes>
    </Router>
  );
}

export default App;
