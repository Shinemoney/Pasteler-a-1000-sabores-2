import { createContext, useState } from 'react';

// Declaramos y exportamos una sola vez
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const loginUser = (email, password) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userFound = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (userFound) {
      const nombreCompleto = (userFound.name || '').trim();
      const [nombre = '', ...resto] = nombreCompleto.split(' ');
      const apellidos = resto.join(' ').trim();

      const normalizedUser = {
        nombre,
        apellidos,
        correo: userFound.email,
        email: userFound.email,
        name: userFound.name || `${nombre} ${apellidos}`.trim(),
      };

      setIsAdmin(false);
      setCurrentUser(normalizedUser);
      localStorage.setItem('isAdmin', 'false');
      localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
      return true;
    }

    return false;
  };

  const loginAdmin = (email, password) => {
    if (email === 'admin.pasteleria@gmail.cl' && password === '123456') {
      setIsAdmin(true);
      setCurrentUser(null);
      localStorage.setItem('isAdmin', 'true');
      localStorage.removeItem('currentUser');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setCurrentUser(null);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, currentUser, loginUser, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
