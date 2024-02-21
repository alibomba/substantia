import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Bookmarks, Feed, Homepage, Login, NotFound, Profile, Register, Search, Settings, PasswordReset } from './pages';
import { AuthProvider } from "./contexts/AuthProvider";
import DefaultLayout from "./layouts/DefaultLayout";
import UserOnlyLayout from "./layouts/UserOnlyLayout";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path='/rejestracja' element={<Register />} />
          <Route path='/logowanie' element={<Login />} />
          <Route path='/password-reset' element={<PasswordReset />} />
          <Route path='/' element={<DefaultLayout />}>
            <Route index element={<Homepage />} />
            <Route path='/profil/:id' element={<Profile />} />
          </Route>
          <Route path='/' element={<UserOnlyLayout />}>
            <Route path='/feed' element={<Feed />} />
            <Route path='/wyszukiwarka' element={<Search />} />
            <Route path='/ustawienia' element={<Settings />} />
            <Route path='/zapisane' element={<Bookmarks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
