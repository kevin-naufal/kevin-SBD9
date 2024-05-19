import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreateUser from './pages/CreateUser.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/Login.jsx'; // Import the Login component
import Signup from './pages/Signup.jsx'; // Import the Signup component
import ListEmails from './pages/ListEmails.jsx'; // Ensure this import is correct
import SendEmail from './pages/SendEmail.jsx'; // Import the SendEmail component
import UpdateEmail from './pages/UpdateEmail';
import EmailDetails from './pages/EmailDetails';


const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} /> {/* Route to the Login component */}
      <Route path="/signup" element={<Signup />} /> {/* Route to the Signup component */}
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateUser />} />
      <Route path="/send" element={<SendEmail />} /> {/* Route to the SendEmail component */}
      <Route path="/emails" element={<ListEmails />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/update/:id" element={<UpdateEmail />} />
      <Route path="/emails/:id" element={<EmailDetails />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
