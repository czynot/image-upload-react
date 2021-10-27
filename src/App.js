import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';
import Axios from 'axios';

import './App.css';

const UploadComponent = props => (
  <form>
    <label>
      URL string of uploaded image:
      <input id='urlInput' type='text' onChange={props.onUrlChange} value={props.url}></input>
    </label>
    <ImageUploader 
      key='image-uploader'
      withIcon={true}
      singleImage={true}
      withPreview={true}
      label="Max size 5MB"
      buttonText='Choose an image'
      onChange={props.onImage}
      imgExtension={['.jpg', '.png', '.jpeg']}
      maxFileSize={5242880}></ImageUploader>
  </form>
)

const App = () => {

  const [ status, setStatus ] = useState('notUploaded')
  const [ url, setUrl] = useState(undefined)
  const [ errorMessage, setErrorMesage ] = useState('')

  const onUrlChange = e => {
    setUrl(e.target.value);
  };

  const onImage = async (failedImages, successImages) => {
    if (!url){
      console.log('missing url')
      setErrorMesage('missing a url to upload to')
      setStatus('uploadError');
      return
    }

    setStatus('uploading')

    try {
      console.log('successImages', successImages)

      const image = successImages[0].split(';');
      const mime = image[0].split(':')[1];
      const name = image[1].split('=')[1];
      const data = image[2]

      const res = await Axios.post(url, {mime, name, image: data});

      setUrl(res.data.imageURL);
      setStatus('uploaded');

    } catch (error) {
      console.log('error in upload', error);
      setErrorMesage(error.message);
      setStatus('uploadError')
    }
  }

  const content = () => {
    switch(status){
      case 'notUploaded':
        return <UploadComponent onUrlChange={onUrlChange} onImage={onImage} url={url} />
      case 'uploading':
        return <h2>Uploading the image...</h2>
      case 'uploaded':
        return (
          <>
            <a href={url}>link to image</a>
            <img src={url} alt='uploaded'></img>
          </>
        )
      case'uploadError':
        return (
          <>
            <div>Error = {errorMessage}</div>
            <div>Upload an image again</div>
          </>
        )
    }
  }

  return (
    <div>
      <h1>Image to URL Converter</h1>
      {content()}
    </div>
  )
}

export default App;
