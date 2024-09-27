import {createRoot} from 'react-dom/client'
import React from 'react'
import App from "./components/App";
import {AuthClient} from "@dfinity/auth-client";

const root = createRoot(document.getElementById("root"));

const init = async () => { 
  

  const auth_client = await AuthClient.create();

  if (await auth_client.isAuthenticated()){
    const identity = auth_client.getIdentity();
    console.log(identity,"has logged in!");
    handle_authenticated(auth_client);
  } else { 
    await auth_client.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        handle_authenticated(auth_client);
      }
    });
  };

  async function handle_authenticated(auth_client){
    root.render(<App />);
  }
}

init();


