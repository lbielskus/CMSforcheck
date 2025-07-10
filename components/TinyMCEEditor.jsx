import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = ({ value, onEditorChange }) => {
  const editorRef = useRef(null);
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

  return (
    <Editor
      apiKey={apiKey}
      onInit={(_evt, editor) => (editorRef.current = editor)}
      value={value}
      init={{
        height: 500,
        directionality: 'ltr', // Default directionality
        menubar: false,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
          'directionality', // Include directionality plugin
        ],
        toolbar:
          'undo redo | formatselect | bold italic forecolor backcolor | ' +
          'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
          'link | removeformat | help | ltr rtl', // Added link button
        content_style:
          'body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; direction: ltr; }', // Fixed content_style format
        style_formats_merge: true,
        style_formats: [
          {
            title: 'LTR Text',
            selector: 'p,h1,h2,h3,h4,h5,h6',
            styles: { direction: 'ltr' },
          },
          {
            title: 'RTL Text',
            selector: 'p,h1,h2,h3,h4,h5,h6',
            styles: { direction: 'rtl' },
          },
        ],
      }}
      onEditorChange={onEditorChange}
    />
  );
};

export default TinyMCEEditor;
