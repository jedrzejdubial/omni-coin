import { ask, clearConsole, createReadline } from "./utils";

interface Wallet {
  pub: string;
  prv: string;
  balance: number;
}

class BlockchainManager {
  private static instance: BlockchainManager;
  private wallets: Wallet[] = [];
  private rl = createReadline();

  private constructor() {};

  // Singleton pattern to ensure only one blockchain instance
  public static getInstance(): BlockchainManager {
    if(!BlockchainManager.instance) {
      BlockchainManager.instance = new BlockchainManager();
    }
    return BlockchainManager.instance;
  }

  // Fetch blockchain only once
  public async initializeBlockchain() {
    try {
      const response = await fetch("http://localhost:0771");
      const blockchain = await response.json();
      this.wallets = blockchain.wallets;
    } catch(error) {
      console.error("Failed to fetch blockchain data: ", error);
      process.exit(1);
    }
  }

  public findWallet(privateKey: string): Wallet | undefined {
    return this.wallets.find(wallet => wallet.prv === privateKey);
  }

  private async menu(wallet: Wallet) {
    while(true) {
      clearConsole();
      console.log("Wallet Menu");
      console.log(`Balance: ${wallet.balance} OMNI`);
      console.log("\nOptions:");
      console.log("1. Send");
      console.log("2. Receive");
      console.log("3. Exit");

      const choice = await ask(this.rl, "Choose an option: ");

      switch(choice) {
        case "1":
          await this.send(wallet);
          break;
        case "2":
          await this.receive(wallet);
          break;
        case "3":
          await this.rl.close();
          return;
        default:
          console.log("Invalid option.");
          await ask(this.rl, "Press enter to continue...");    
      }
    }
  }

  public async signIn() {
    clearConsole();
    console.log("Welcome to the official Omni CLI");

    while(true) {
      const privateKey = await ask(this.rl, "Enter your private key: ");
      const wallet = this.findWallet(privateKey);

      if(wallet) {
        console.log("\nSigned in.");
        await this.menu(wallet);
        return;
      }

      console.error("Wallet not found.");
    }
  }

  private async send(wallet: Wallet) {
    while(true) {
      clearConsole();
      console.log("Type 'exit' to return.");
      const recipientAddress = await ask(this.rl, "\nRecipient address: ");
      if(recipientAddress.toLowerCase() === "exit") return;

      const recipient = this.wallets.find(
        wallet => wallet.pub === recipientAddress
      );

      if(!recipient) {
        console.error("Recipient wallet not found.");
        await ask(this.rl, "Press enter to continue...");
        return;
      }

      const amountStr = await ask(this.rl, "Amount: ");
      const amount = parseFloat(amountStr);

      if(isNaN(amount) || amount <= 0 || amount > wallet.balance) {
        console.error("Invalid amount.");
        await ask(this.rl, "Press enter to continue...");
        return;
      }

      const confirm = await ask(this.rl, `Do you want to send ${amount} OMNI to ${recipientAddress}? (y/n)`);

      if(confirm.toLowerCase() === "y") {
        wallet.balance -= amount;
        recipient.balance += amount;
        console.log(`Sent ${amount} OMNI to ${recipientAddress}`);
        await ask(this.rl, "Press enter to continue...");
        return;
      }

      console.log("Transaction cancelled.");
      await ask(this.rl, "Press enter to continue...");
      return;
    }
  }

  private async receive(wallet: Wallet) {
    clearConsole();
    console.log("Your wallet address: " + wallet.pub);
    console.log("\nWallet address (QR Code)"); // TODO
  
    await ask(this.rl, "\n<- BACK (enter)");
  }
}

async function main() {
  const blockchainManager = BlockchainManager.getInstance();
  await blockchainManager.initializeBlockchain();
  await blockchainManager.signIn();
}

main().catch(console.error);