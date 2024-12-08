import * as readline from "readline";

export function ask(rl: readline.Interface, query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, (answer) => {
      resolve(answer);
    })
  });
}

export function clearConsole() {
  console.clear();  
}

export function createReadline() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}