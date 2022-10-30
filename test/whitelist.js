const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Whitelist Address", async function () {

    async function deploy() {
        const _maxWhitelistedAddresses = 5 ;

        // const _owner = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

        const Whitelist = await hre.ethers.getContractFactory("Whitelist");
        whitelist = await Whitelist.deploy(_maxWhitelistedAddresses);
      
        await whitelist.deployed();

      
        console.log(
          `  Whitelist contract 
          with  ${_maxWhitelistedAddresses} whitelist addresses deployed to ${whitelist.address}`
        );

        const MockErc20 = await hre.ethers.getContractFactory("MockErc20");
        mockErc20 = await MockErc20.deploy();
      
        await mockErc20.deployed();
      
        console.log("MockErc20 deployed to:", mockErc20.address);
    }


    before("Before", async () => {
        accounts = await ethers.getSigners();

        await deploy();
    })

  it("max number ", async () => {
        
        
           const maxAddress= await whitelist.maxNumberOfWhitelistedAddresses();
            console.log("conOwner ===>", maxAddress);
            expect(maxAddress).to.equal(5);
        
        
    })

    it("minting Token", async () => {
        await mockErc20.mint(accounts[1].address, ethers.utils.parseEther("100"))
        console.log("Balance of account", await mockErc20.balanceOf(accounts[1].address));
        await mockErc20.connect(accounts[1]).approve(whitelist.address, await mockErc20.balanceOf(accounts[1].address))
        
        console.log("allowance given", await mockErc20.allowance(accounts[1].address, whitelist.address))
    })

    it("checking whitelist function and Minting token ", async () => {
        console.log("Balance of contract Before", await mockErc20.balanceOf(whitelist.address));
        await whitelist.addUserAddressToWhitelist(mockErc20.address, ethers.utils.parseEther("100"), 5,  accounts[1].address)
        console.log("Balance of contract After", await mockErc20.balanceOf(whitelist.address));

        await whitelist.connect(accounts[1]).mint(1, 4,{value: ethers.utils.parseEther("1")})
        
        const isWhitelisted = await whitelist.whitelistedAddresses(accounts[1].address)
        console.log("Is user whitelisted:", isWhitelisted )
        expect(isWhitelisted).to.equal(true);
        
        await expect (whitelist.addUserAddressToWhitelist(mockErc20.address, ethers.utils.parseEther("100"), 5,  accounts[1].address)).to.be.revertedWith("Error: Sender already been whitelisted")
    })
     
    



    








})