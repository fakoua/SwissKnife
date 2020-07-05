import { bin as nirBin } from "../bin/nircmd.ts"
import { bin as cmdmp3Bin } from "../bin/cmdmp3.ts"

export async function createNirBin(nirPath: string) {
    const binContent = atob(nirBin)
    const binArray = new Uint8Array(binContent.length);
    
    let ctn = 0;
    binContent.split("").forEach(char => {
        binArray[ctn++] =  char.charCodeAt(0);
    });
    
    await Deno.writeFile(nirPath, binArray)
}

export async function createCmdmp3Bin(path: string) {
    const binContent = atob(cmdmp3Bin)
    const binArray = new Uint8Array(binContent.length);
    
    let ctn = 0;
    binContent.split("").forEach(char => {
        binArray[ctn++] =  char.charCodeAt(0);
    });
    
    await Deno.writeFile(path, binArray)
}