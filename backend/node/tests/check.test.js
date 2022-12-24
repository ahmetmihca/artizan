const check = require("../middlewares/check")

test('Authentication Checks', async () => {
    let isMine1 = await check.checkNFTOwnership("0x43c363a049e6df99d711a9850157426f747e0876", "0xcb82814c42d7b5ab540bfc16705bd30a0491d563", 28)
    let isMine2 = await check.checkNFTOwnership("0x43c363a049e6df99d711a9850157426f747e087", "0xcb82814c42d7b5ab540bfc16705bd30a0491d563", 28)


    expect(isMine1).toBe(true)
    expect(isMine2).toBe(false)
})

test('Transaction Type', () => {
    
})