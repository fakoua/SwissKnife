import { bin } from "../bin/nircmd.ts"
import { join }  from "https://deno.land/std/path/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

//cli: deno -A src\tsToBin.ts -- --bin=nircmd

const { args } = Deno;
const argv = parse(args);
let binFile = argv.bin

let binFolderPath = join(Deno.cwd(), `bin`)
let binFilePath = join(binFolderPath, `temp_${binFile}.exe`)

//let tsPath = `../bin/${binFile}.ts`
//const tsContent = await import(tsPath)

const binContent = atob(bin)

let binArray = new Uint8Array(binContent.length);

let ctn = 0;
binContent.split('').forEach(char => {
    binArray[ctn++] =  char.charCodeAt(0);
});

await Deno.writeFile(binFilePath, binArray)

console.log(`Bin File saved to: ${binFilePath}`)