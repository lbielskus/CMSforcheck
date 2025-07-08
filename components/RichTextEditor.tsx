// import React, { useEffect, useRef } from 'react';
// import 'quill/dist/quill.snow.css';
// import Quill from 'quill';

// interface RichTextEditorProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
//   const editorRef = useRef<HTMLDivElement>(null);
//   const quillRef = useRef<any>(null); // Using 'any' type for quillRef

//   useEffect(() => {
//     // Ensure Quill is only initialized on the client-side
//     if (typeof window !== 'undefined') {
//       import('quill').then((Quill) => {
//         if (editorRef.current) {
//           quillRef.current = new Quill.default(editorRef.current, {
//             theme: 'snow',
//             modules: {
//               toolbar: [
//                 [{ header: [1, 2, false] }],
//                 ['bold', 'italic', 'underline'],
//                 ['link'],
//                 [{ list: 'ordered' }, { list: 'bullet' }],
//               ],
//             },
//           });

//           quillRef.current.on('text-change', () => {
//             onChange(quillRef.current.root.innerHTML);
//           });

//           if (value) {
//             quillRef.current.clipboard.dangerouslyPasteHTML(value);
//           }
//         }
//       });
//     }
//   }, [onChange, value]);

//   useEffect(() => {
//     // Update Quill's content when 'value' changes
//     if (quillRef.current && value !== quillRef.current.root.innerHTML) {
//       quillRef.current.root.innerHTML = value;
//     }
//   }, [value]);

//   const handleListFormat = (format: 'ordered' | 'bullet') => {
//     const quill = quillRef.current;
//     if (quill) {
//       const range = quill.getSelection();
//       if (range) {
//         quill.format('list', format);
//       }
//     }
//   };

//   const handleBulletList = () => {
//     handleListFormat('bullet');
//   };

//   const handleNumberedList = () => {
//     handleListFormat('ordered');
//   };

//   const handleHeaderFormat = (header: 1 | 2) => {
//     const quill = quillRef.current;
//     if (quill) {
//       const range = quill.getSelection();
//       if (range) {
//         quill.format('header', header);
//       }
//     }
//   };

//   const handleHeader1 = () => {
//     handleHeaderFormat(1);
//   };

//   const handleHeader2 = () => {
//     handleHeaderFormat(2);
//   };

//   return (
//     <div>
//       <div ref={editorRef} style={{ minHeight: '200px' }} />
//       <div>
//         <button onClick={handleBulletList}>Bullet List</button>
//         <button onClick={handleNumberedList}>Numbered List</button>
//         <button onClick={handleHeader1}>Header 1</button>
//         <button onClick={handleHeader2}>Header 2</button>
//       </div>
//     </div>
//   );
// };

// export default RichTextEditor;

// components / RichTextEditor.tsx;

// import React, { useState } from 'react';
// import { EditorState, ContentState } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// interface RichTextEditorProps {
//   onChange: (value: string) => void;
//   initialValue?: string;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({
//   onChange,
//   initialValue = '',
// }) => {
//   const [editorState, setEditorState] = useState(() => {
//     const contentState = ContentState.createFromText(initialValue);
//     return EditorState.createWithContent(contentState);
//   });

//   const handleEditorStateChange = (state: EditorState) => {
//     setEditorState(state);
//     onChange(state.getCurrentContent().getPlainText());
//   };

//   return (
//     <Editor
//       editorState={editorState}
//       onEditorStateChange={handleEditorStateChange}
//       wrapperClassName='demo-wrapper'
//       editorClassName='demo-editor'
//     />
//   );
// };

// export default RichTextEditor;

// components/RichTextEditor.tsx

////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import { EditorState, ContentState } from 'draft-js';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// // Dynamic import of the Editor component with no SSR
// const Editor = dynamic(
//   () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
//   {
//     ssr: false,
//   }
// );

// interface RichTextEditorProps {
//   onChange: (value: string) => void;
//   initialValue?: string;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({
//   onChange,
//   initialValue = '',
// }) => {
//   const [editorState, setEditorState] = useState(() => {
//     const contentState = ContentState.createFromText(initialValue);
//     return EditorState.createWithContent(contentState);
//   });
//   const [isClient, setIsClient] = useState(false);

//   // Check if we are on the client side
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleEditorStateChange = (state: EditorState) => {
//     setEditorState(state);
//     onChange(state.getCurrentContent().getPlainText());
//   };

//   if (!isClient) return null;

//   return (
//     <Editor
//       editorState={editorState}
//       onEditorStateChange={handleEditorStateChange}
//       wrapperClassName='demo-wrapper'
//       editorClassName='demo-editor'
//     />
//   );
// };

// export default RichTextEditor;

//////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////

// RichTextEditor.js

// import React, { useEffect, useRef, useState } from 'react';
// import {
//   EditorState,
//   convertToRaw,
//   convertFromRaw,
//   RawDraftContentState,
// } from 'draft-js';
// import 'draft-js/dist/Draft.css';
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// interface RichTextEditorProps {
//   value: string; // Define the type for value prop
//   onChange: (value: string) => void; // Define the type for onChange prop
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
//   const editorRef = useRef<Editor>(null); // Ref should have type Editor

//   const [editorState, setEditorState] = useState(() => {
//     if (value) {
//       return EditorState.createWithContent(convertFromRaw(JSON.parse(value)));
//     }
//     return EditorState.createEmpty();
//   });

//   useEffect(() => {
//     if (value) {
//       setEditorState(
//         EditorState.createWithContent(convertFromRaw(JSON.parse(value)))
//       );
//     }
//   }, [value]);

//   const handleEditorChange = (state: EditorState) => {
//     setEditorState(state);
//     const contentState = state.getCurrentContent();
//     onChange(JSON.stringify(convertToRaw(contentState)));
//   };

//   return (
//     <Editor
//       editorState={editorState}
//       onEditorStateChange={handleEditorChange}
//       editorRef={(ref) => {
//         if (ref) {
//           editorRef.current = ref; // Assigning to current property correctly
//         }
//       }}
//       toolbar={{
//         options: ['inline', 'blockType', 'list', 'textAlign', 'link'],
//         inline: {
//           options: ['bold', 'italic', 'underline'],
//         },
//         blockType: {
//           options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
//         },
//         list: {
//           options: ['unordered', 'ordered'],
//         },
//       }}
//     />
//   );
// };

// export default RichTextEditor;

//////

// import React, { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import { EditorState, ContentState } from 'draft-js';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// // Dynamic import of the Editor component with no SSR
// const Editor = dynamic(
//   () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
//   {
//     ssr: false,
//   }
// );

// interface RichTextEditorProps {
//   onChange: (value: string) => void;
//   initialValue?: string;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({
//   onChange,
//   initialValue = '',
// }) => {
//   const [editorState, setEditorState] = useState(() => {
//     const contentState = ContentState.createFromText(initialValue);
//     return EditorState.createWithContent(contentState);
//   });
//   const [isClient, setIsClient] = useState(false);

//   // Check if we are on the client side
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleEditorStateChange = (state: EditorState) => {
//     setEditorState(state);
//     onChange(state.getCurrentContent().getPlainText());
//   };

//   if (!isClient) return null;

//   return (
//     <Editor
//       editorState={editorState}
//       onEditorStateChange={handleEditorStateChange}
//       wrapperClassName='demo-wrapper'
//       editorClassName='demo-editor'
//     />
//   );
// };

// export default RichTextEditor;

/////////////
/////////////

////////////

// import React, { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// const Editor = dynamic(
//   () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
//   { ssr: false }
// );

// interface RichTextEditorProps {
//   onChange: (value: string) => void;
//   initialValue?: string;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({
//   onChange,
//   initialValue = '',
// }) => {
//   const [editorState, setEditorState] = useState(() => {
//     if (initialValue) {
//       try {
//         const contentState = convertFromRaw(JSON.parse(initialValue));
//         return EditorState.createWithContent(contentState);
//       } catch (e) {
//         console.error('Failed to parse initialValue:', e);
//         return EditorState.createEmpty();
//       }
//     } else {
//       return EditorState.createEmpty();
//     }
//   });

//   const handleEditorStateChange = (state: EditorState) => {
//     setEditorState(state);
//     const contentState = state.getCurrentContent();
//     const contentStateJson = JSON.stringify(convertToRaw(contentState));
//     onChange(contentStateJson);
//   };

//   return (
//     <Editor
//       editorState={editorState}
//       onEditorStateChange={handleEditorStateChange}
//       wrapperClassName='demo-wrapper'
//       editorClassName='demo-editor'
//       toolbar={{
//         options: [
//           'inline',
//           'blockType',
//           'fontSize',
//           'fontFamily',
//           'link',
//           'history',
//         ],
//         inline: { options: ['bold', 'italic', 'underline'] },
//       }}
//     />
//   );
// };

// export default RichTextEditor;

// import React, { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import {
//   EditorState,
//   convertToRaw,
//   convertFromRaw,
//   ContentState,
// } from 'draft-js';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// const Editor = dynamic(
//   () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
//   { ssr: false }
// );

// interface RichTextEditorProps {
//   onChange: (value: string) => void;
//   initialValue?: string;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({
//   onChange,
//   initialValue = '',
// }) => {
//   const [editorState, setEditorState] = useState(() => {
//     if (initialValue) {
//       try {
//         const contentState = convertFromRaw(JSON.parse(initialValue));
//         return EditorState.createWithContent(contentState);
//       } catch (e) {
//         console.error('Failed to parse initialValue:', e);
//       }
//     }
//     return EditorState.createEmpty();
//   });

//   // Handle editor state changes
//   const handleEditorStateChange = (state: EditorState) => {
//     setEditorState(state);
//     const contentState = state.getCurrentContent();
//     const contentStateJson = JSON.stringify(convertToRaw(contentState));
//     onChange(contentStateJson);
//   };

//   // Initialize editorState from initialValue on component mount
//   useEffect(() => {
//     if (initialValue) {
//       try {
//         const contentState = convertFromRaw(JSON.parse(initialValue));
//         const newEditorState = EditorState.createWithContent(contentState);
//         setEditorState(newEditorState);
//       } catch (e) {
//         console.error('Failed to parse initialValue:', e);
//       }
//     } else {
//       setEditorState(EditorState.createEmpty());
//     }
//   }, [initialValue]);

//   return (
//     <Editor
//       editorState={editorState}
//       onEditorStateChange={handleEditorStateChange}
//       wrapperClassName='demo-wrapper'
//       editorClassName='demo-editor'
//       toolbar={{
//         options: [
//           'inline',
//           'blockType',
//           'fontSize',
//           'fontFamily',
//           'link',
//           'history',
//         ],
//         inline: { options: ['bold', 'italic', 'underline'] },
//       }}
//     />
//   );
// };

// export default RichTextEditor;
