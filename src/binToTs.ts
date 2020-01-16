import * as utils from "./utils.ts"
import { join }  from "https://deno.land/std/path/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { writeFileStr } from "https://deno.land/std/fs/mod.ts";
const { args } = Deno;

//cli: deno -A src\binToTs.ts -- --bin=nircmd

const argv = parse(args);
let binFile = argv.bin

let binFolderPath = join(Deno.cwd(), `bin`)
let binPath = join(binFolderPath, `${binFile}.exe`)
const uint = await Deno.readFile(binPath)

let binary = ''
let len = uint.length

for (let index = 0; index < len; index++) {
    binary += String.fromCharCode(uint[index])
}

let binBase64 = btoa(binary)
let base64 = utils.trunString(binBase64,100)

let tsFileContent = `export const bin=\`${base64}\``
let tsFilePath = join(binFolderPath, `${binFile}.ts`)
await writeFileStr(tsFilePath, tsFileContent);

console.log(`TS File saved to: ${tsFilePath}`)