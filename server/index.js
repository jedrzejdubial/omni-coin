import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let blockchain = {
  wallets: [
    {
      pub: "",
      prv: "",
      balance: 24
    },
    {
      pub: "",
      prv: "",
      balance: 48
    }
  ],
  transactions: []
};

app.get("", (req, res) => {
  res.send(blockchain);  
});

app.listen("9090", () => console.log("Hosted at localhost:9090"));