import 'tinymce/tinymce'; // Import TinyMCE core
import 'tinymce/icons/default'; // Import default icons

// A minimal setup example
export const editorConfig = {
  height: 500,
  directionality: 'ltr',
  content_style: 'body { direction: ltr; }',
  plugins: [
    'advlist autolink lists link image',
    'charmap print preview anchor help',
    'searchreplace visualblocks code',
    'insertdatetime media table paste wordcount',
  ],
  toolbar:
    'undo redo | formatselect | bold italic | \
    alignleft aligncenter alignright | \
    bullist numlist outdent indent | help',
};
