import * as utils from "./utils.ts"
import { join } from "https://deno.land/std@0.210.0/path/mod.ts";
import { parseArgs } from "https://deno.land/std@0.210.0/cli/parse_args.ts";
const { args } = Deno;

// cli: deno -A src\binToTs.ts -- --bin=nircmd

const argv = parseArgs(args);
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
await Deno.writeTextFile(tsFilePath, tsFileContent);

console.log(`TS File saved to: ${tsFilePath}`)
