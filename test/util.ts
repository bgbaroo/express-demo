import readline from "readline";
import { DbDriver } from "../src/data/sources/postgres";

export async function clearDbPrompt(pg: DbDriver): Promise<void> {
  return userPrompt(
    "Clear table 'clipboards', 'groups', and 'users' before tests? [y/Y]",
  )
    .then((answer) => {
      if (answer.toUpperCase().includes("y")) {
        Promise.resolve();
      }

      Promise.reject();
    })
    .then(async () => {
      console.log("Clearing db pre-tests");

      await clearDb(pg);
    })
    .catch((err) => {
      if (err) {
        console.error(`Got error: ${err}`);
      }

      console.log("Not clearing db before tests");
    })
    .finally(() => {
      console.log("Starting tests");

      return Promise.resolve();
    });
}

export async function userPrompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const readLine = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readLine.question(question, (userInput: string) => {
      readLine.close();
      resolve(userInput);
    });
  });
}

export async function clearDb(pg: DbDriver): Promise<void> {
  console.log("clearing all entries in database");
  await pg.clipboard.deleteMany();
  await pg.group.deleteMany();
  await pg.user.deleteMany();
}
