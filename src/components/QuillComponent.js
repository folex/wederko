import React from 'react';
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
        this.state = { text: '' }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value) {
        this.setState({ text: value })
    }

    render() {
        let quill = <ReactQuill
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
        />

        return quill
    }

    componentDidMount() {
        let quill = this.quillRef.current

        var editor = quill.getEditor()

        const ydoc = new Y.Doc()
        const provider = new WebrtcProvider('folex-quill', ydoc)
        const type = ydoc.getText('quill')

        this.binding = new QuillBinding(type, editor, provider.awareness)

        quill.focus()
    }
}

export default QuillComponent;