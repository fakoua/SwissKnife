import { bin } from "../bin/nircmd.ts"
import { join } from "https://deno.land/std@0.210.0/path/mod.ts";
import { parseArgs } from "https://deno.land/std@0.210.0/cli/parse_args.ts";

// cli: deno -A src\tsToBin.ts -- --bin=nircmd

const { args } = Deno;
const argv = parseArgs(args);
const binFile = argv.bin

const binFolderPath = join(Deno.cwd(), `bin`)
const binFilePath = join(binFolderPath, `temp_${binFile}.exe`)

// let tsPath = `../bin/${binFile}.ts`
// const tsContent = await import(tsPath)

const binContent = atob(bin)

const binArray = new Uint8Array(binContent.length);

let ctn = 0;
binContent.split("").forEach(char => {
    binArray[ctn++] =  char.charCodeAt(0);
});

await Deno.writeFile(binFilePath, binArray)

console.log(`Bin File saved to: ${binFilePath}`)
