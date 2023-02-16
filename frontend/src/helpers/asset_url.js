// Helper functions for asset url recognition

function convert_img(url) {
  console.log("url:", url);
  if (url.startsWith("ipfs")) {
    const hash = url.split("//")[1];

    return `https://cf-ipfs.com/ipfs/${hash}`;
  } else {
    return url;
  }
}

const methods = { convert_img };

export default methods;
