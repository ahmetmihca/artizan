// Helper functions for asset url recognition

function convert_img(url)
{
    if(url && url.startsWith("ipfs")){
       return `https://ipfs.io/ipfs/${url.split("//")[1]}`
    }
    else{
        return url;
    }
}
function decToHex(dec) {
  return dec.toString(16)
}
function hexToInt(hex)
{
  return parseInt(hex,16);
}

function eliminateRepeats(list)
{
  let newList = [];
  for(let idx = 0 ; idx < list.length ; idx++)
  {
    if(!newList.includes(list[idx]))
    {
      console.log("dfsasdfa")
      newList.push(list[idx])

    }
  }
  return newList;
}
const methods = { convert_img, decToHex, hexToInt, eliminateRepeats }


export default methods;