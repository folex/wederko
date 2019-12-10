import React from 'react';
import ReactDOM from 'react-dom';
import '../css/monokai-sublime.min.css'
import 'react-quill/dist/quill.snow.css'

import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { QuillBinding } from 'y-quill'
import QuillCursors from 'quill-cursors'
import ReactQuill, { Quill, Mixin } from 'react-quill'

Quill.register('modules/cursors', QuillCursors)

class QuillComponent extends React.Component {
    constructor(props) {
        super()
        this.quillRef = React.createRef()
        this.state = { text: '', room: 'folex-quill', ydoc: null, binding: null, provider: null }
        this.handleChange = this.handleChange.bind(this)
    }

    render() {
        return (<ReactQuill
            ref={this.quillRef}
            value={this.state.text}
            onChange={this.handleChange}
            theme='snow'
            modules={
                {
                    cursors: true,
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        ['image', 'code-block']
                    ],
                    history: {
                        userOnly: true
                    }
                }
            }
        />)
    }

    componentDidMount() {
        this.addRoomInput() // TODO: should this happen in render?
        this.connect(this.state.room)

        this.quillRef.current.focus()
    }

    disconnect() {
        if (this.state.ydoc != null) {
            this.state.ydoc.destroy()
        }
    }

    connect(room) {
        this.disconnect()

        let quill = this.quillRef.current
        let editor = quill.getEditor()

        let ydoc = new Y.Doc()
        let provider = new WebrtcProvider(room, ydoc)
        let type = ydoc.getText('quill')
        let binding = new QuillBinding(type, editor, provider.awareness)

        this.setState({ room: room, ydoc: ydoc, binding: binding, provider: provider })
    }

    changeRoom() {
        let input = document.getElementById("room-input")
        let room = input.value

        this.connect(room)
    }

    handleChange(value) {
        this.setState({ text: value })
    }

    handleRoomInput() {
        let input = document.getElementById("room-input")
        let room = input.value
        let roomButton = document.getElementById("room-button")
        // Enable button if room value isn't empty and differs from the current one
        roomButton.disabled = room === "" || room === this.state.room
    }

    addRoomInput() {
        let toolbar = document.querySelector(".ql-toolbar")
        
        let inputSpan = document.createElement("span")
        inputSpan.className = "ql-formats"
        let input = document.createElement("input")
        input.type = "text"
        input.className = "ql-image"
        input.id = "room-input"
        input.value = this.state.room
        input.oninput = (e) => this.handleRoomInput()
        inputSpan.appendChild(input)

        let buttonSpan = document.createElement("span")
        buttonSpan.className = "ql-formats"
        let button = document.createElement("button")
        button.type = "button"
        button.disabled = true
        button.innerHTML = "Change room"
        button.id = "room-button"
        button.onclick = (e) => this.changeRoom()
        buttonSpan.appendChild(button)

        toolbar.appendChild(inputSpan)
        toolbar.appendChild(buttonSpan)
    }
}

export default QuillComponent;