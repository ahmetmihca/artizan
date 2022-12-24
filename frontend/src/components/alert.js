import { useState, useEffect } from 'react'
import './style/css-alert.css';

const Message = (props) => {
  
  let cname = "alert alert-"+ props.variant;
  
  // If show is true this will be returned
  return (
    <div className={cname}>
      {props.alertText}
    </div>
  )
}

Message.defaultPros = {
  variant: 'danger',
}

export default Message;