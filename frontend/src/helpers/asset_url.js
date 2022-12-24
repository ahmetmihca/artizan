// Helper functions for asset url recognition

function convert_img(url)
{
    if(url.startsWith("ipfs")){
       return `https://ipfs.io/ipfs/${url.split("//")[1]}`
    }
    else{
        return url;
    }
}

const methods = { convert_img }

export default methods;