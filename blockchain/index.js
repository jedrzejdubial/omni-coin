import express from "express";
import cors from "cors";
import blockchain from "./blockchain.json" with { type: "json" };

const app = express();
app.use(cors());
app.use(express.json());

app.get("", (req, res) => {
  res.send(blockchain);  
});

app.listen("0771", () => console.log("Hosted at localhost:0771"));