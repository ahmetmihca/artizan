import React, {useState, useEffect} from "react";
import './style/css-upload-file.css';
import { MDBIcon} from 'mdb-react-ui-kit';
import Message from "./alert";

function UploadFile() 
{
    
    const [selectedFile, setSelectedFile] =  useState()
    const [preview, setPreview] = useState()
    const [errState, setErrState] = useState()
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
        
        const objectUrl = URL.createObjectURL(selectedFile)
        
        setPreview(objectUrl)
        
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile, errState])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0 ) {
            setSelectedFile(undefined)
            return
        }
        if(e.target.files[0].size > 2097152)
        {
            setSelectedFile(undefined)
            setErrState(true);
        }
        if(!e.target.files[0].type.includes("image") && !e.target.files[0].type.includes("video") && !e.target.files[0].type.includes("audio"))
        {
            setSelectedFile(undefined)
            setErrState(true);
        }
        else{
            setSelectedFile(e.target.files[0])
        }
        
    }
    const getDefaultFontSize = () => {
    const html = document.querySelector('html');

    const fontSizeMatch = window
        .getComputedStyle(html)
        .getPropertyValue('font-size')
        .match(/\d+/);

    if (!fontSizeMatch || fontSizeMatch.length < 1) {
        return null;
    }

    const result = Number(fontSizeMatch[0]);
    return !isNaN(result) ? result : null;
};
    function removeElementsByClass(className){
        const elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }
    function reUpload(e)
    {
        if(selectedFile.type.includes("image") || selectedFile.type.includes("video"))
        {
            var img_div = document.getElementById("file-uploaded__div")
            removeElementsByClass("custom-file-upload__again")
            var label = document.createElement("label")
            var width =document.getElementById('uploaded-img').clientWidth
            var height =document.getElementById('uploaded-img').clientHeight
            var styles = '.custom-file-upload__again{width:' +  width.toString() +'px;height: '+ height.toString()+'px;}'
            var oneEm = getDefaultFontSize()

            label.setAttribute("for", "nft-file-input")
            label.classList.add("custom-file-upload__again")
            label.style.display = "block"
            var styleLabel = document.createElement("style")
            styleLabel.innerText = styles
            label.appendChild(styleLabel)
            
            label.innerHTML += "<i class=\"far fa-edit fa-lg fa-5x\" style=left:"+ (width/2 - 2*oneEm) +"px;top:"+ (height/2 - 2*oneEm).toString()+"px;>"
            
            img_div.appendChild(label)
        }
    
        
    }
  return (
      <div id="file-upload" style={ selectedFile && selectedFile.type.includes("audio") ?{minHeight:"0px"} :{}}>
        {errState  && <Message alertText="Couldn't upload the file" variant="danger"></Message>}
        {!selectedFile && <label htmlFor="nft-file-input" className="custom-file-upload">
            <div id="em"></div>
            <div id="file-upload__div">
                <MDBIcon icon="images" size="5x"/>
                <p>Click to upload an NFT...</p>
            </div>
        </label> }

        
        <input type='file' id="nft-file-input" onChange={onSelectFile}/>
        {selectedFile && selectedFile.type.includes("image") &&
            <div id="file-uploaded__div">
            
                <img id="uploaded-img" src={preview} onLoad={reUpload}/>   
            
            </div>
        }
        {
            selectedFile && selectedFile.type.includes("audio") &&
            <div className="file-uploaded__div">
                <MDBIcon icon="volume-up" />
                <span>{selectedFile.name}</span>
                <input type='file' id="nft-file-input" style={{display:"inline", width:"auto", minHeight:"20px", border:"none"}} onChange={onSelectFile}/>
            </div>
        }
        {
            selectedFile && selectedFile.type.includes("video") &&
            <div className="file-uploaded__div">
                <video width="340" height="200" controls>
                    <source src={preview+"#t=0,10"} type="video/mp4"/>
                    <source src={preview}  type="video/ogg"></source>
                    Your browser does not support HTML5 video.
                </video>
                <input type='file' id="nft-file-input" style={{display:"inline", width:"auto", minHeight:"20px", border:"none", position:"relative", val:""}}  onChange={onSelectFile}/>
            </div>
        }
            
      </div>
  );
}

export default UploadFile;