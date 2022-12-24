class Comperator{

    doesExistInDict(array, key, value)
    {
        let found = false;
        array.forEach(element => {
            if(element[key] == value){
                found = true;
            }
        });
        return found;
    }
    
}

export default Comperator;