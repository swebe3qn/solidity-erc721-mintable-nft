let Color = artifacts.require('./Color.sol');
const chai = require('chai');

chai
.use(require('chai-as-promised'))
.should()

contract('Color', async(accounts) => {
    let instance

    before(async() => {
        instance = await Color.deployed();
    })

    describe('deployment', async() => {
        it('deploys successfully', async() => {
            let name = await instance.name()
            let symbol = await instance.symbol()
            assert.equal(name, 'Color', 'Wrong name')
            assert.equal(symbol, 'COLOR', 'Wrong symbol')
            assert.notEqual(instance.address, '')
            assert.notEqual(instance.address, 0x0)
            assert.notEqual(instance.address, null)
            assert.notEqual(instance.address, undefined)
        })
    })

    describe('minting', async() => {
        it('should mint tokens', async() => {
            let string = 'abc123'
            let colorExists = await instance.colorExists(string);
            assert.equal(false, colorExists, 'Color already exists');
            await instance.mint(string);
            let currentSupply = await instance.mintedCount();
            assert.equal(currentSupply, 1, "Current supply should be 1");
            colorExists = await instance.colorExists(string);
            assert.equal(true, colorExists, 'Color does not exists');

            await instance.mint(string).should.be.rejected;
        })
    })

    describe('indexing', async() => {
        it('should list colors', async() => {
            await instance.mint('one');
            await instance.mint('two');
            await instance.mint('three');
            let supply = await instance.mintedCount();
            assert.equal(4, supply.toNumber(), "Minted counter is not correct");

            for (let i = 0; i < supply; i++) {
                let string = await instance.colors(i);
                if (i == 0) assert.equal(string, 'abc123', 'Wrong string');
                if (i == 1) assert.equal(string, 'one', 'Wrong string');
                if (i == 2) assert.equal(string, 'two', 'Wrong string');
                if (i == 3) assert.equal(string, 'three', 'Wrong string');
            }
        })
    })
})