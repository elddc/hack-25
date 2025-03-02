import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idl from "./idls.json";  // Your program's IDL (exported when you build it)

// Program and network config
const PROGRAM_ID = new PublicKey("4iU8wACkvHYa1CgC6kJrvyZPDwYzncvzsHyzy2PJgm8E");
const NETWORK = "https://44c2-173-230-107-49.ngrok-free.app";  // Change to mainnet when ready

async function getJournalEntry(provider, ownerPubkey, title) {
    const program = new Program(idl, PROGRAM_ID, provider);

    // Derive PDA (same logic used in your Rust code)
    const [journalEntryPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(title), ownerPubkey.toBuffer()],
        PROGRAM_ID
    );

    try {
        const account = await program.account.journalEntryState.fetch(journalEntryPDA);

        console.log("Journal Entry:", account);
        return {
            owner: account.owner.toBase58(),
            title: account.title,
            message: account.message,
        };
    } catch (error) {
        console.error("Failed to fetch journal entry:", error);
        return null;
    }
}

export default getJournalEntry;
