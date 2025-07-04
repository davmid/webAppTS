import { supabase } from '../supabaseClient';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('developer'); // domyślna rola
  const [error, setError] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async () => {
    setError('');

    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({
        email: login,
        password,
      });

      if (error) {
        setError('Nieprawidłowe dane logowania');
      } else {
        navigate('/dashboard');
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: login,
        password,
        options: {
          emailRedirectTo: 'http://localhost:5173/dashboard',
        },
      });

      if (error) {
        setError('Błąd rejestracji: ' + error.message);
      } else {
        const userId = data.user?.id;
        const email = data.user?.email;

        if (userId && email) {
          const { error: insertError } = await supabase.from('users').insert({
            user_id: userId,
            email: email,
            name: name,
            role: role,
            created_at: new Date().toISOString(),
          });

          if (insertError) {
            console.error('Błąd dodawania do tabeli users:', insertError.message);
          }
        }
      }
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0d1b2a] to-[#1b263b]">
      <div className="bg-[#1b263b] text-[#e0e1dd] p-10 rounded-xl w-full max-w-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {isLoginMode ? 'Zaloguj się' : 'Zarejestruj się'}
        </h2>

        {!isLoginMode && (
          <>
            <label className="block mb-2 text-sm">Imię</label>
            <input
              data-testid="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mb-5 rounded bg-[#0d1b2a] border border-[#415a77] focus:outline-none"
            />
          </>
        )}

        <label className="block mb-2 text-sm">Email</label>
        <input
          data-testid="email-input"
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full p-3 mb-5 rounded bg-[#0d1b2a] border border-[#415a77] focus:outline-none"
        />

        <label className="block mb-2 text-sm">Hasło</label>
        <input
          data-testid="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-5 rounded bg-[#0d1b2a] border border-[#415a77] focus:outline-none"
        />

        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

        <button
          onClick={handleAuth}
          className="w-full bg-[#415a77] hover:bg-[#324960] py-2 rounded font-semibold text-white transition mb-4"
        >
          {isLoginMode ? 'Zaloguj' : 'Zarejestruj'}
        </button>

        <p className="text-center text-sm text-[#e0e1dd]">
          {isLoginMode ? 'Nie masz konta?' : 'Masz już konto?'}{' '}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-[#91b4d4] underline"
          >
            {isLoginMode ? 'Zarejestruj się' : 'Zaloguj się'}
          </button>
        </p>
      </div>
    </div>
  );
}
