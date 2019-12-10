import React from 'react';
import './App.css';
import './css/monokai-sublime.min.css'
import 'react-quill/dist/quill.snow.css'
import QuillComponent from './components/QuillComponent.js';

function App() {
  return new QuillComponent()
}

function handleSubmit(event) {
  console.log('handleSubmit ')
  console.dir(event)
}

function handleChange(event) {
  console.log('handleChange ')
  console.dir(event)
  console.dir(event.currentTarget)
}

export default App;
