import express from "express";
import cors from "cors";
import blockchain from "./blockchain.json" with { type: "json" };

const app = express();
app.use(cors());
app.use(express.json());

// Get blockchain
app.get("/", (req, res) => {
  res.json(blockchain);
});

// Process a transaction
app.post("/transaction", (req, res) => {
  const { senderPrv, receiverPub, amount, message } = req.body;

  // Validate ownership
  const sender = blockchain.wallets.find(w => w.prv === senderPrv);
  if(!sender) {
    return res.status(404).json({ error: "Invalid private key" });
  }

  // Validate amount
  if(isNaN(amount) || amount <= 0 || amount > sender.balance) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  // Process transaction
  sender.balance -= amount;

  const receiver = blockchain.wallets.find(w => w.pub === receiverPub);
  if(receiver) {
    receiver.balance += amount; 
  }

  // Record transaction
  const transaction = {
    sender: sender.pub,
    receiver: receiverPub,
    amount,
    message,
    status: "completed",
    timestamp: new Date().toISOString()
  };

  blockchain.transactions.push(transaction);

  res.json({
    message: "Transaction completed",
    transaction,
    senderBalance: sender.balance
  });
});

app.listen("0771", () => console.log("Blockchain running on port 0771"));