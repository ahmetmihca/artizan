import React, {useState, useEffect} from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import './style/css-form-dropdown.css';
import useComponentVisible from "./use-component-visible";
function FormDropdown(props) 
{
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [selected, setSelected] = useState(props.selected);

  function changeSelection(val){
    const selectHTML = document.querySelector("#"+props.dropdownId);
    selectHTML.value = val;
    setSelected(val);
    setIsComponentVisible(false);
  }

  function showMenu(){
    setIsComponentVisible(true);
  }
  function closeMenu(){
    setIsComponentVisible(false);
  }
  function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  return (
    <div id="form-dropdown">
        <div id="form-dropdown--selected__div">
            {
            !isComponentVisible && <div className="form-dropdown--selected__span" onClick={showMenu}>{capitalizeFirstLetter(selected)}</div>
            }
            {
                isComponentVisible && <div className="form-dropdown--selected__span" onClick={closeMenu}>{capitalizeFirstLetter(selected)}</div>
            }
            <MDBIcon icon="angle-down" />
        </div>
        
        {
            isComponentVisible && <div className="form-dropdown--div">
            <div ref={ref}>
                {
                props.values.map(
                (val, index) =>
                {
                    // console.log(ddlink);    
                    return (<div key={index} className="form-dropdown--div__options" id={"form-dropdown__"+val} onClick={() => changeSelection(val)}  aria-current="page" >{capitalizeFirstLetter(val)}</div>);
                }
                )
                }
            </div>
            
        </div>
        }
        
        <br></br>
        <select name={props.dropdownName} id={props.dropdownId}>
            {
                props.values.map(
                (val, index) =>
                {
                    return (<option key={index} value = {val}>{val}</option>);
                }
            )
               
            }
        </select>
    </div>
  );
}

export default FormDropdown;