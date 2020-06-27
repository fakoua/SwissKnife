import * as utils from "./utils.ts"
import { join } from "https://deno.land/std/path/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { writeFileStr } from "https://deno.land/std/fs/mod.ts";
const { args } = Deno;

// cli: deno -A src\binToTs.ts -- --bin=nircmd

const argv = parse(args);
const binFile = argv.bin

const binFolderPath = join(Deno.cwd(), `bin`)
const binPath = join(binFolderPath, `${binFile}.exe`)
const uint = await Deno.readFile(binPath)

let binary = ""
const len = uint.length

for (let index = 0; index < len; index++) {
    binary += String.fromCharCode(uint[index])
}

const binBase64 = btoa(binary)
const base64 = utils.trunString(binBase64, 100)

const tsFileContent = `export const bin=\`${base64}\``
const tsFilePath = join(binFolderPath, `${binFile}.ts`)
await writeFileStr(tsFilePath, tsFileContent);

console.log(`TS File saved to: ${tsFilePath}`)
