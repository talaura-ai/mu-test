declare module 'react-use'
declare module 'react-internet-meter'
declare module 'react-draft-wysiwyg'
declare module 'draftjs-to-html'
declare module 'draft-js'
interface Window {
  stream?: MediaStream; // Adjust the type `MediaStream` to the appropriate type for your use case
}
interface Document {
  msHidden?: any;
  webkitHidden?: any;
  webkitFullscreenElement?: any
  msFullscreenElement?: any
  mozFullScreenElement?: any
}