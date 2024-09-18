import fs from "fs";
import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";


describe("BAYCAirdrop", function () {
    async function deployBAYCToken() {
        const [owner, signer] = await ethers.getSigners();
        const totalSupply = ethers.parseUnits("10000000", 18);

        const erc20Token = await ethers.getContractFactory("Token");
        const token = await erc20Token.deploy(
            "Bored Apes Yacht Club", "BAYC", totalSupply, owner);

        return { token, owner, signer };
    }

    async function deployBAYCAirdropFixture() {
        const { token, owner, signer } = await loadFixture(deployBAYCToken);

        const merkleTree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json", "utf8")))
        const root = merkleTree.root;
        const proof1 = [
            "0x007974031a4276c92f79cee56745857577ffc9b407127d7532ab95a84cbb2f26",
            "0x8d409fdc94751c5de51d885e693a2b50b456e2db62ad56e857b41fdfcfd1e97f",
            "0x87b6348c765532faa93fbb457ac7701455795a66785699723aedcb7fb33e527a",
            "0x3ffb0e5f530e9ddd3718b9d710ef3da2f12b5ad4ca9a353d02047cba335053dd"
        ]
        const proof2 = [
            "0x0aa0268b3b0a39d535ece56ece7dbdb28acaba55dde2047ac462d1566ebef10c",
            "0x8d409fdc94751c5de51d885e693a2b50b456e2db62ad56e857b41fdfcfd1e97f",
            "0x87b6348c765532faa93fbb457ac7701455795a66785699723aedcb7fb33e527a",
            "0x3ffb0e5f530e9ddd3718b9d710ef3da2f12b5ad4ca9a353d02047cba335053dd"
        ]

        const nft_and_whitelist = "0x4AF79fFCaBb09083aF6CcC3b2C20Fe989519f6d7";
        const nft_no_whitelist = "0x7Ad53bbA1004e46dd456316912D55dBc5D311a03";
        const whitlelist_no_nft = owner.address;
        const no_whitelist_no_nft = signer.address;

        const BAYC_ADDRESS = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
        const BAYC_Airdrop = await ethers.getContractFactory("BAYCAirdrop");
        const baycAirdrop = await BAYC_Airdrop.deploy(token.target, BAYC_ADDRESS, root);

        await token.transfer(baycAirdrop, ethers.parseUnits("100000", 18));

        return {
            token, baycAirdrop, owner, signer, root, proof1, proof2, BAYC_ADDRESS,
            nft_and_whitelist, nft_no_whitelist, whitlelist_no_nft, no_whitelist_no_nft
        };
    }

    // describe("", {});

    describe("Claim Airdrop", function () {
        // it("Should revert on zero amount", async function () {
        //     const { proof1, baycAirdrop } = await deployBAYCAirdropFixture();

        //     await expect(baycAirdrop.claimAirdrop(0, proof1)
        //     ).to.be.revertedWith("Cannot claim zero tokens!");
        // });

        // it("Should revert with zero airdrop balance", async function () {
        //     const { token } = await loadFixture(deployBAYCToken);
        //     const { BAYC_ADDRESS, root, proof1 } = await deployBAYCAirdropFixture();

        //     const BAYC_Airdrop = await ethers.getContractFactory("BAYCAirdrop");
        //     const baycAirdrop = await BAYC_Airdrop.deploy(token.target, BAYC_ADDRESS, root);

        //     await expect(baycAirdrop.claimAirdrop(1000, proof1)
        //     ).to.be.revertedWith("All airdrop tokens claimed!");
        // });

        // it("Should reject claimant without NFT and not on whitelist", async function () {
        //     const { baycAirdrop, proof1, no_whitelist_no_nft } = await deployBAYCAirdropFixture();
        //     const invalidClaimant = await ethers.getImpersonatedSigner(no_whitelist_no_nft);

        //     const airdropAmount = 100n;

        //     await expect(baycAirdrop.connect(invalidClaimant).claimAirdrop(airdropAmount, proof1)).to.be.revertedWith("No NFT detected!");
        //     expect(await baycAirdrop.claimants(invalidClaimant)).to.be.false;
        // });

        // it("Should reject claimant on whitelist without NFT", async function () {
        //     const { baycAirdrop, proof1, whitlelist_no_nft } = await deployBAYCAirdropFixture();
        //     const invalidClaimant = await ethers.getImpersonatedSigner(whitlelist_no_nft);

        //     const airdropAmount = 200n;

        //     await expect(baycAirdrop.connect(invalidClaimant).claimAirdrop(airdropAmount, proof1)).to.be.revertedWith("No NFT detected!");
        //     expect(await baycAirdrop.claimants(invalidClaimant)).to.be.false;
        // });

        // it("Should reject claimant with NFT but not on whitelist", async function () {
        //     const { baycAirdrop, proof1, nft_no_whitelist } = await deployBAYCAirdropFixture();
        //     const invalidClaimant = await ethers.getImpersonatedSigner(nft_no_whitelist);

        //     const airdropAmount = 200n;

        //     await expect(baycAirdrop.connect(invalidClaimant).claimAirdrop(airdropAmount, proof1)).to.be.revertedWith("Invalid proof submitted!");
        //     expect(await baycAirdrop.claimants(invalidClaimant)).to.be.false;
        // });

        // it("Should revert with wrong airdrop amount", async function () {
        //     const { baycAirdrop, proof1, nft_and_whitelist } = await deployBAYCAirdropFixture();
        //     const validClaimant = await ethers.getImpersonatedSigner(nft_and_whitelist);

        //     const airdropAmount = 5000n;

        //     await expect(
        //         baycAirdrop.connect(validClaimant).claimAirdrop(airdropAmount, proof1)
        //     ).to.be.revertedWith("Invalid proof submitted!");
        //     expect(await baycAirdrop.claimants(nft_and_whitelist)).to.be.false;
        // });

        // it("Should update state correctly after claimant collects airdrop", async function () {
        //     const { baycAirdrop, proof1, nft_and_whitelist } = await deployBAYCAirdropFixture();
        //     const validClaimant = await ethers.getImpersonatedSigner(nft_and_whitelist);

        //     const airdropAmount = 500n;

        //     await baycAirdrop.connect(validClaimant).claimAirdrop(airdropAmount, proof1);
        //     expect(await baycAirdrop.claimants(nft_and_whitelist)).to.be.true;
        // });

        // it("Should send airdrop tokens to valid claimant on whitelist with NFT", async function () {
        //     const { baycAirdrop, token, proof1, nft_and_whitelist } = await deployBAYCAirdropFixture();
        //     const validClaimant = await ethers.getImpersonatedSigner(nft_and_whitelist);

        //     const airdropAmount = 500n;
        //     const balBefore = await token.balanceOf(validClaimant);

        //     await baycAirdrop.connect(validClaimant).claimAirdrop(airdropAmount, proof1);

        //     const balAfter = await token.balanceOf(validClaimant);

        //     expect(balAfter).to.equal(balBefore + airdropAmount);
        // });

        // it("Should reject claimant who has claimed already airdrop", async function () {
        //     const { baycAirdrop, proof1, nft_and_whitelist } = await deployBAYCAirdropFixture();
        //     const validClaimant = await ethers.getImpersonatedSigner(nft_and_whitelist);

        //     const airdropAmount = 500n;

        //     await baycAirdrop.connect(validClaimant).claimAirdrop(airdropAmount, proof1);
        //     await expect(
        //         baycAirdrop.connect(validClaimant).claimAirdrop(airdropAmount, proof1)
        //     ).to.be.revertedWith("Airdrop already claimed!");
        // });

        // it("Should emit an event after successful airdrop claim", async function () {
        //     const { baycAirdrop, proof1, nft_and_whitelist } = await deployBAYCAirdropFixture();
        //     const validClaimant = await ethers.getImpersonatedSigner(nft_and_whitelist);

        //     const airdropAmount = 500n;

        //     await expect(
        //         baycAirdrop.connect(validClaimant).claimAirdrop(airdropAmount, proof1)
        //     ).to.emit(baycAirdrop, "AirdropClaimed")
        //         .withArgs(validClaimant, airdropAmount);
        // });
    });
});
