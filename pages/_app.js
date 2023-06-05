import '../styles/globals.css';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import users from '../reducers/users';

import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "987361255463-6a4uln4njrjgenjbeg93sfcvt1e6vfst.apps.googleusercontent.com"
const reducers = combineReducers({ users });
const persistConfig = { key: 'Brief-creativ', storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
        <Head>
          <title>Brief Créativ'</title>
        </Head>
      <Header/>
        <Component {...pageProps} />
        <Footer/>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
