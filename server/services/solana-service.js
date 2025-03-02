const express = require("express");
const { Connection, PublicKey } = require("@solana/web3.js");
const { Program, AnchorProvider } = require("@coral-xyz/anchor");
const idl = require("./idl/hack25.json");

const PROGRAM_ID = new PublicKey("4iU8wACkvHYa1CgC6kJrvyZPDwYzncvzsHyzy2PJgm8E");
const connection = new Connection("https://api.devnet.solana.com");

async function solanaService(owner, title) {
    const ownerPubkey = new PublicKey(owner);
    const provider = new AnchorProvider(connection, {}, AnchorProvider.defaultOptions());
    const program = new Program(idl, PROGRAM_ID, provider);

    const [journalEntryPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(title), ownerPubkey.toBuffer()],
        PROGRAM_ID
    );

    const account = await program.account.journalEntryState.fetch(journalEntryPDA);

    const data = ({
        owner: account.owner.toBase58(),
        title: account.title,
        message: account.message,
    });
    console.log(data);
    return data;
}

module.exports = solanaService;
