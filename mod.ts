import * as utils from './src/utils.ts'
import { Screen, Monitor } from './src/models/screen.ts'
import { SpeakOptions } from './src/models/speakOptions.ts'
import { FindMode } from './src/models/findMode.ts'
import { WinActions } from './src/models/winActions.ts'

/**
 * Speak a text using default configuration.
 * @param text input string to speak
 * @param options set the rate and volume
 * Return the process exit code
 */
export const speak = async function (text: string, options: SpeakOptions = { rate: 0, volume: 50 }): Promise<number> {
    let args = [
        "speak",
        "text",
        text
    ];

    if (!options.rate) { options.rate = 0 }
    if (!options.volume) { options.volume = 50 }

    args.push(options.rate.toString())
    args.push(options.volume.toString())
    return (await runNirCmd(args))
}

/**
 * Set the computer sound volume
 * @param volume from 0 (mute) to 100 (highest)
 * Return the process exit code
 */
export const setVolume = async function (volume: number): Promise<number> {
    const v = Math.floor(655.35 * volume)
    let args = [
        "setsysvolume",
        v.toString()
    ];
    return (await runNirCmd(args))
}

/**
 * Mute the system sound
 * Return the process exit code
 */
export const mute = async function (): Promise<number> {
    return await toggleMute(1)
}

/**
 * Unmute the system sound
 * Return the process exit code
 */
export const unmute = async function (): Promise<number> {
    return await toggleMute(0)
}

/**
 * Capture screenshot
 * @param imageName local path to save the PNG image
 * @param monitor Monitor options, Single, Dual, or Current Window
 * @param screen Screen option, x, y, width and height
 * Return the saved image path
 */
export const screenshot = async function (imageName: string, monitor: Monitor = "Single", screen?: Screen): Promise<string> {

    let cmd = "savescreenshot"
    switch (monitor) {
        case "Dual":
            cmd = "savescreenshotfull"
            break;

        case "Window":
            cmd = "savescreenshotwin"
            break;
    }

    let args = [
        cmd,
        imageName
    ]

    if (screen) {
        args.push(screen.x.toString())
        args.push(screen.y.toString())
        args.push(screen.width.toString())
        args.push(screen.height.toString())
    }

    let exitCode = await runNirCmd(args);
    if (exitCode === 0) {
        return imageName;
    } else {
        return `Error: exit code ${exitCode}`
    }
}

/**
 * Question Box dialog
 * @param title Question Box Title
 * @param text Question Box question text
 * Return true if the user clicks YES
 */
export const questionBox = async function (title: string, text: string): Promise<boolean> {
    let args = [
        "qboxcom",
        text,
        title,
        "returnval",
        "0x30"
    ]
    let exitCode = await runNirCmd(args);
    return exitCode === 48
}

/**
 * InfoBox dialog
 * @param title InfoBox title
 * @param text InfoBox message
 * Return the process exit code
 */
export const infoBox = async function (title: string, text: string): Promise<number> {
    let args = [
        "infobox",
        text,
        title
    ]
    let exitCode = await runNirCmd(args);
    return exitCode
}

/**
 * Play system beep
 * @param frequency Beep frequency
 * @param duration Beep duration in milliseconds
 * Return the process exit code
 */
export const beep = async function (frequency: number, duration: number): Promise<number> {
    let args = [
        "beep",
        frequency.toString(),
        duration.toString(),
    ]
    let exitCode = await runNirCmd(args);
    return exitCode
}

/**
 * Play Windows system notification sound
 * Return the process exit code
 */
export const winBeep = async function (): Promise<number> {
    let args = [
        "stdbeep"
    ]
    let exitCode = await runNirCmd(args);
    return exitCode
}

/**
 * Show window notification (Ballon)
 * @param title Notification Title
 * @param text Notification Text
 * @param icon Icon number (from shell32.dll)
 * @param timeout Timeout in milliseconds to hide the notification
 * Return the process exit code
 */
export const notification = async function (title: string, text: string, icon: number, timeout: number): Promise<number> {
    let args = [
        "trayballoon",
        title,
        text,
        `shell32.dll,${icon}`,
        timeout.toString()
    ]
    let exitCode = await runNirCmd(args);
    return exitCode
}

/**
 * 
 * @param winTitle Window title to control (example: notepad, calc ...)
 * @param find Find method for window title (Equals, Contains, StartsWith, EndsWith)
 * @param action Close, Hide, Flash, Max, Min ...
 * Return the process exit code
 */
export const winAction = async function (winTitle: string, find: FindMode, action: WinActions): Promise<number> {
    let findStr = ''
    switch (find) {
        case FindMode.Contains:
            findStr = 'ititle'
            break;

        case FindMode.EndsWith:
            findStr = 'etitle'
            break;
        case FindMode.StartsWith:
            findStr = 'stitle'
            break;
        default:
            findStr = 'title'
            break;
    }
    let args = [
        "win",
        action.toLocaleLowerCase(),
        findStr,
        winTitle
    ]
    let exitCode = await runNirCmd(args);
    return exitCode
}


async function runNirCmd(args: Array<string>): Promise<number> {
    args.unshift(utils.getNir());
    const p = Deno.run({
        args: args,
        stdout: "piped",
        stderr: "piped"
    });
    const { code } = await p.status()
    return code;
}

async function toggleMute(mute: number): Promise<number> {
    let args = [
        "mutesysvolume",
        mute.toString()
    ]
    return (await runNirCmd(args))
}



