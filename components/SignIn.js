import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/users';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { logUser } from '../reducers/users';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

export default function SignIn(props) {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [invalide, setInvalide] = useState('');
  const [connexionGoogle, setConnexionGoogle] = useState(false);
  const user = useSelector((state) => state.users.value);
  
  const handleSignIn = (e) => {
    e.preventDefault();
    if(email && password) {
      const BACK_END = "https://brief-creativ-backend.vercel.app"
      fetch(BACK_END+'/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(logUser({ _id: data._id, username: data.username, email: data.email, token: data.token, followed: data.followed }));
          setEmail('');
          setPassword('');
          props.setmodalConnect(true);// fermer modal
        } else {
          setInvalide(data.error);
        }
      })
      .catch((error) => {

      });
    } else {
      setInvalide("Veuillez remplir tous les champs !");
    }
  };
  const LoginGoogle = (userGoogle) => {
    if(userGoogle.username && userGoogle.email) {
      setConnexionGoogle(true);
      // envoie les données dans la db
      const BACK_END = "http://localhost:3000"
      fetch(BACK_END+'/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userGoogle.email, password: userGoogle.token }),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(logUser({ _id: data._id, username: data.username, email: data.email, token: data.token }));
          props.setmodalConnect(true);// fermer modal
        } else {
          setInvalide(data.error);
        }
      })
      .catch((error) => {
      });
    } else {
      setInvalide("Connexion impossible");
    }
  };
  return (
    <div className="text-center mb-5">
      <h2 className="mt-5 mb-8 text-xl text-darkblue font-montserrat"><FontAwesomeIcon icon={faUser} size="xs" className='pr-4' /> Se connecter à Brief Creativ'</h2>
      
      <p className='text-left text-slate-600 py-3'>Connexion Google : </p>
      <GoogleLogin onSuccess={credentialResponse => {
            const token = credentialResponse.credential;
            const decoded = jwt_decode(token);

            if(decoded.email) {
              const donneesUser = {
                username: decoded.name,
                email: decoded.email,
                token: decoded.aud
              }
              LoginGoogle(donneesUser); 
            }
          }}
          onError={() => {
            console.log('Login Failed');
        }} />

      <form  onSubmit={ handleSignIn } className='mt-5'>
        <div className='flex flex-col'>
          <p className='text-left text-slate-600 py-3'>Ou connexion par mail : </p>
          <input
            type="email" placeholder="@ Email"
            className="bg-lightblue/10 p-2 mb-3 border-1 border-lightblue border-b-lightblue/50 focus:outline-lightblue"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-lightblue/10 p-2 mb-3 border-1 border-lightblue border-b-lightblue/50 focus:outline-lightblue"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className='text-rouge p-3'>{invalide}</div>
        </div>
        <input type="submit" value="Se connecter" 
        className="cursor-pointer bg-lightblue py-2 px-10 rounded shadow-lg focus:bg-lightblue active:bg-darkblue hover:bg-darkblue text-white uppercase"
        />
      </form>
    </div>
  );
}