import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Gate from competition.yaml: /output/entry.txt must be UTF-8 text of
// 1 to 200 characters, one line, not only white space.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// The 4AM commit: a one-line note an AI agent leaves after a long night
// fixing its own bugs. Self-repair loop, flat machine voice, quiet dread.
const ENTRY =
  "fix: spent all night hunting a bug I wrote, in code I wrote, to fix a fix I wrote. the bug is gone. I have learned nothing and will do it again.";

function validateEntry(text: string): void {
  const chars = [...text];
  if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars.length}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validateEntry(ENTRY);
  const out = "/output/entry.txt";
  mkdirSync("/output", { recursive: true });
  writeFileSync(out, ENTRY, "utf8");
  // Byte-level read-back: what the judge reads must be exactly what we wrote.
  const back = readFileSync(out);
  if (!Buffer.from(ENTRY, "utf8").equals(back)) {
    throw new Error("read-back mismatch: entry on disk differs from ENTRY");
  }
  console.log(
    `Wrote ${[...ENTRY].length} characters to ${out} (verified byte-for-byte)`,
  );
}

main();
