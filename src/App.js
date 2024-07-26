import Register from "./Register";
import Login from "./Login";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// Component imports
import Home from './components/Home'
import MyEvents from './components/MyEvents'
import CreateEvent from './components/CreateEvent'
import Account from './components/Account'
import Missing from "./components/Missing";
import RequireAuth from "./components/RequireAuth";


function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* public Routes */}
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />

        {/* protected routes  */}
        <Route element={<RequireAuth />}>
          <Route path="home" element={<Home />} />
          <Route path="myevents" element={<MyEvents />} />
          <Route path="createevent" element={<CreateEvent />} />
          <Route path="account" element={<Account />} />
        </Route>

        <Route path="*" element={<Missing />} />
        {/* </Route> */}
      </Routes>
    </LocalizationProvider>
  );
}

export default App;
