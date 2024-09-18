// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract BAYCAirdrop is Ownable {
    IERC20 token;
    IERC721 nft;
    bytes32 merkleRoot;

    mapping(address => bool) claimants;

    event AirdropClaimed(
        address indexed claimant,
        uint256 amount,
        uint32 timestamp
    );

    constructor(
        address _tokenAddress,
        address _nftAddress,
        bytes32 _merkleRoot
    ) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
        nft = IERC721(_nftAddress);
        merkleRoot = _merkleRoot;
    }

    function claimAirdrop(
        address msg.sender,
        uint256 _amount,
        bytes32[] memory _proof
    ) external {
        require(msg.sender != address(0), "Address Zero forbidden!");
        require(!claimants[msg.sender], "Airdrop already claimed!");

        require(_amount > 0, "Cannot claim zero tokens!");
        require(
            token.balanceOf(address(this)) >= _amount,
            "All airdrop tokens claimed!"
        );

        // Check that owner has BAYC NFT
        require(nft.balanceOf(msg.sender) > 0);

        // Compute leaf hash for the provided address and amount ABI encoded values
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, _amount)))
        );
        // Verify leaf hash using MerkleProof's verify function.
        require(
            MerkleProof.verify(_proof, merkleRoot, leaf),
            "Invalid proof submmitted"
        );

        // Mark claimant has received tokens
        claimants[msg.sender] = true;

        // Transfer airdrop tokens to claimant
        token.transfer(msg.sender, _amount);

        emit AirdropClaimed(msg.sender, _amount, block.timestamp);
    }

    function updateMerkleRoot(bytes32 _newMerkleRoot) external onlyOwner {
        require(token.balanceOf(address(this)), "Airdrop tokens exhausted!");
        merkleRoot = _newMerkleRoot;
    }

    function withdraw() external onlyOwner {
        // Withdraw all airdrop tokens to contract owner's address
        require(
            token.transfer(_owner, token.balanceOf(address(this))),
            "Transfer failed"
        );
    }
}
