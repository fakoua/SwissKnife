import { join } from "https://deno.land/std@0.210.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.210.0/fs/ensure_dir.ts";
import { exists } from "https://deno.land/std@0.210.0/fs/exists.ts";
import * as create from "./tsToCmd.ts"

/**
 * split input string into multiple lines
 * @param input string input
 * @param width the width of the line
 */
export function trunString(input: string, width: number): string {
    const it = Math.ceil(input.length / width);
    let rtnVal = ""
    for (let index = 0; index < it; index++) {
        rtnVal += input.substring(index * width, index * width + width) + "\r\n"
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
    const os = getOS();
    const homeKey: string = os === OS.windows ? "USERPROFILE" : "HOME"
    const homeDir = Deno.env.get(homeKey)
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
    } else {
        return join(homeDir, relativeDir)
    }
    
}

export async function getNir(): Promise<string> {
    const swissKnifeFolder = join(getDenoDir(), "bin/swissknife/")
    const nirPath = join(swissKnifeFolder, "nircmd.exe")
    const ex = await exists(nirPath)
    if (ex) {
        return nirPath;
    }
    // Ensure directory
    await ensureDir(swissKnifeFolder)
    await create.createNirBin(nirPath)
    return nirPath;
}

export async function getCmdmp3(): Promise<string> {
    const swissKnifeFolder = join(getDenoDir(), "bin/swissknife/")
    const path = join(swissKnifeFolder, "cmdmp3.exe")
    const ex = await exists(path)
    if (ex) {
        return path;
    }
    // Ensure directory
    await ensureDir(swissKnifeFolder)
    await create.createCmdmp3Bin(path)
    return path;
}

export function getOS(): OS {
     return OS[Deno.build.os];
}

export enum OS {
    windows = "windows",
    linux = "linux",
    darwin = "darwin",
    freebsd = "freebsd",
    netbsd = "netbsd",
    aix = "aix",
    solaris = "solaris",
    illumos = "illumos",
}
