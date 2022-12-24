import React, {useState, useEffect} from "react";
import './style/css-img-upload.css'
import { MDBIcon} from 'mdb-react-ui-kit';
import Message from "./alert";

function ImgUpload(props) 
{
    const width = props.width;
    const height = props.height;
    const shape = props.shape;
    const fileId= props.fileId;

    const [selectedFile, setSelectedFile] =  useState();
    const [preview, setPreview] = useState();
    const [errState, setErrState] = useState();
    useEffect(() => {
        if(errState)
        {
            const timeId = setTimeout(() => {
                setErrState(undefined)
                setSelectedFile(undefined)
                setPreview(undefined)
            }, 3000)

            return () => {
                clearTimeout(timeId)
            } 
        }
        if (!selectedFile) {
            setPreview(undefined)
            return
        }
        
        const objectUrl = URL.createObjectURL(selectedFile);
        
        setPreview(objectUrl);
        
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile, errState ,props.shape])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0 ) {
            setSelectedFile(undefined);
            return
        }
        if(e.target.files[0].size > 2097152)
        {

            setSelectedFile(undefined);
            setErrState(true);
        }
        if(!e.target.files[0].type.includes("image"))
        {

            setSelectedFile(undefined);
            setErrState(true);
        }
        else{
            setSelectedFile(e.target.files[0]);
        }
        
    }

  return (
      <div style={{marginBottom: 20}}>
          {errState  && <Message alertText="Couldn't upload the file" variant="danger"></Message>}
          {
              props.shape == "circle" && 
              <div className="img-upload__gen circle-upload">
                  <div className="img-upload--icon-wrapper__circle">
                    <MDBIcon far icon="image" className='img-upload--icon__circle' size='5x'/>
                  </div>
                  <label htmlFor={fileId} className="image-upload--label__circle">
                    </label>
                  <input type="file" id ={fileId} className="image-upload__input" onChange={onSelectFile}/>
                  {
                    selectedFile && shape == "circle" &&
                    <img className="img-upload--input-img__circle" src={preview} alt="" />
                  }
              </div>   
          }
          
          {
                props.shape == "rectangle" &&
                <div className='img-upload__gen rectangular-upload' style={{width:width, height:height}}>
                    <div className="img-upload--icon-wrapper__rectangle" style={{width: width, height:height}}>
                        <MDBIcon far icon="image" className='img-upload--icon__rectangle' size='5x' style={{
                        top: parseInt(height)/2-40,
                        left: parseInt(width)/2-40}}/>
                    </div>
                    <label htmlFor={fileId} className="image-upload--label__rectangle" style={{width:width, height:height}}>
                    </label>
                  <input type="file" id={fileId} className="image-upload__input" onChange={onSelectFile}/>
                  {
                        selectedFile && shape == "rectangle" &&
                        <img className="img-upload--input-img__rectangular" src={preview} alt="" style={{width:parseInt(width)-3, height:parseInt(height)-3}}/>
                    }
                  
                </div>
          }
          
          

      </div>
  );
}

export default ImgUpload;