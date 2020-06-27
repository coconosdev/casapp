import React from 'react';
import './App.scss';
import Header from './components/Header';
import Main from './components/Main';

function App() {
  return (
    <div className="container">
      <Header></Header>
      <Main></Main>
      {/* <Footer></Footer> */}
    </div>
  );
}

export default App;
