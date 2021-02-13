import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDAQWSqjpzkqbkxsr8pu4O38UGaqzWVgWw",
  authDomain: "react-firebase-chat-943b9.firebaseapp.com",
  projectId: "react-firebase-chat-943b9",
  storageBucket: "react-firebase-chat-943b9.appspot.com",
  messagingSenderId: "908523077214",
  appId: "1:908523077214:web:4dac56db4f6e3e50a07ecf"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState();

  return (
    <div className="App">
     <header>

      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() 
{
  const signinWithGoogle = () => {
    auth.signInWithPopup(provider)}

  return(
    <button onClick={signinWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() 
{
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() 
{
  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    
    setFormValue('' );

    dummy.current.scrollIntoView({ behavior: 'smooth'});
  }
  
  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message = {msg} />)}
        <div ref={dummy}></div>
      </main>
      <div>
        <form onSubmit={sendMessage}>
          <input value = {formValue} onChange={(e) => setFormValue(e.target.value)}/>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  )
}

function ChatMessage(props)
{
  const { text, uid } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return(
    <div className = {`message ${messageClass}`}> 
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  ) 
}

export default App;
