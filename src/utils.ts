import { join }  from "https://deno.land/std/path/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";
import { exists } from "https://deno.land/std/fs/exists.ts";
import { createBin } from "./tsToNirCmd.ts"

/**
 * split input string into multiple lines
 * @param input string input
 * @param width the width of the line
 */
export function trunString(input: string, width: number): string {
    let it = Math.ceil(input.length / width);
    let rtnVal = ''
    for (let index = 0; index < it; index++) {
        rtnVal += input.substring(index*width, index*width + width) + '\r\n'
    }
    return rtnVal
}

/**
 * Returs deno root directory
 * Example:
 * - (C:\Users\USERNAME\AppData\Local\deno) on windows
 * - (/home/USERNAME/.cache/deno) on linux
 */
export function getDenoDir(): string {
    let os = getOS();
    let homeKey: string = os == OS.windows ? 'USERPROFILE' : 'HOME'
    let homeDir = Deno.env.get(homeKey)
    let relativeDir = "";

    switch (os) {
        case OS.windows:
            relativeDir = "AppData/Local/deno"
            break;
        case OS.linux:
            relativeDir = ".cache/deno"
            break;
        case OS.darwin:
            relativeDir = "Library/Caches/deno"
            break;
    }

    if (homeDir === undefined) {
        return "";
    }
    else 
    {
        return join(homeDir, relativeDir)
    }
    
}

export async function getNir(): Promise<string> {

    let swissKnifeFolder = join(getDenoDir(), "bin/swissknife/")
    let nirPath = join(swissKnifeFolder, "nircmd.exe")
    let ex = await exists(nirPath)
    if (ex) {
        return nirPath;
    }
    //Ensure directory
    await ensureDir(swissKnifeFolder)
    await createBin(nirPath)
    return nirPath;
}


export function getOS(): OS {
     return OS[Deno.build.os];
}

export enum OS {
    windows = "windows",
    linux = "linux",
    darwin = "darwin",
}
