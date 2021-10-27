import { readLines } from "https://deno.land/std@0.113.0/io/mod.ts";
import { parse } from "../deps.ts";

const args = parse(Deno.args, { boolean: ["p"] });

export async function pauseIfP() {
  if (args.p) {
    await pause();
  }
}

export default async function pause() {
  console.log("Press Enter to continue...");
  for await (const _ of readLines(Deno.stdin)) {
    return;
  }
}
