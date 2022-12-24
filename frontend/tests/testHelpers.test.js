const AssetURL = require('./src/helpers/asset_url')
 
test('Check img URL patterns', () => {
    expect(AssetURL.convert_img('ipfs://trial')).toBe("https://ipfs.io/ipfs/trial");
});