import { bin } from "../bin/nircmd.ts"

export async function createBin(nirPath: string) {
    const binContent = atob(bin)
    let binArray = new Uint8Array(binContent.length);
    
    let ctn = 0;
    binContent.split('').forEach(char => {
        binArray[ctn++] =  char.charCodeAt(0);
    });
    
    await Deno.writeFile(nirPath, binArray)
}

