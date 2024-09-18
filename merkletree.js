import csv from "csv-parser";
import fs from "fs";
import keccak256 from "keccak256";
import { Merkletree } from "merkletreejs";
import SHA256 from "crypto-js/sha256";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

const filePath = "./addresses.csv";
const leaves = [];

fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
        // Store user wallet address and airdrop amount in array
        const userData = [row.address, row.amount];
        leaves.push(userData);
    })
    .on("end", () => {
        try {
            // Build Merkle tree whose leaves are hashed userData
            // leaves.map(leaf = );
            const tree = StandardMerkleTree.of(leaves, ["address", "uint256"]);
            // JSONify Merkle tree and write to file
            fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
            console.log("Merkle Root:", tree.root);

            // Read stored Merkle tree from file
            const merkleTree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json", "utf8")))
            console.log("Merkle Root:", merkleTree.root);
            const proofs = {};

            // Loop through tree entries (index, userData[])
            for (const [i, v] of merkleTree.entries()) {
                // Generate proof for each tree leaf
                const proof = merkleTree.getProof(i);
                // Add generated proof to proofs object
                proofs[v[0]] = proof;
            }

            // Write proofs object to file
            fs.writeFileSync("proofs.json", JSON.stringify(proofs, null, 2), "utf8");
            console.log("Proofs saved successfully");
        } catch (err) {
            console.log("Proofs could not be generated: " + err);
        }
    })
    .on("error", (err) => {
        console.log("Error reading addresses.csv: " + err);
    })


  // Merkle Root: 0x2901c586b45328dd13a5607de2890825bd4510e10653eaac223f8507ec6766c4
