import * as utils from "./src/utils.ts"
import type { Screen, Monitor } from "./src/models/screen.ts"
import type { SpeakOptions } from "./src/models/speakOptions.ts"
import type { Find } from "./src/models/findMode.ts"
import type { WinActions } from "./src/models/winActions.ts"
import { PowerMode } from "./src/models/powerMode.ts";


/**
 * Speak a text using default configuration.
 * @date 12/23/2023 - 3:39:39 PM
  * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * let res = await swissKnife.speak("Hello from the other world")
 * ```
 * @export
 * @async
 * @param {string} text input string to speak
 * @param {SpeakOptions} [options={ rate: 0, volume: 50 }] set the rate and volume
 * @returns {Promise<number>} the process exit code
 */
export async function speak (text: string, options: SpeakOptions = { rate: 0, volume: 50 }): Promise<number> {
    const args = [
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
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * //Set the volume
 * await swissKnife.setVolume(90) //value between 0 to 100
 * ```
 * @returns the process exit code
 */
export async function setVolume (volume: number): Promise<number> {
    const v = Math.floor(655.35 * volume)
    const args = [
        "setsysvolume",
        v.toString()
    ];
    return (await runNirCmd(args))
}

/**
 * Mute the system sound
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * await swissKnife.mute()
 * ```
 * @returns the process exit code
 */
export async function mute(): Promise<number> {
    return await toggleMute(1)
}

/**
 * Unmute the system sound
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * await swissKnife.unmute()
 * ```
 * @returns the process exit code
 */
export async function unmute(): Promise<number> {
    return await toggleMute(0)
}


/**
 * Capture screenshot
 * @date 12/23/2023 - 3:35:02 PM
 * 
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * await swissKnife.screenshot("c:\\myfolder\\myfile.png")
 * ```
 *
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * let res = await swissKnife.screenshot("c:\\myfolder\\myfile.png", "Dual") //take a screenshot of both screens
 * ```
 *
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * let res = await swissKnife.screenshot("c:\\myfolder\\myfile.png", "Window") //Also you can specify the current active window
 * ```
 *
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * let res = await swissKnife.screenshot("c:\\myfolder\\myfile.png", "Single", {
 *   x: 10,
 *   y: 30,
 *   width: 200,
 *   height: 150
 * }) //The third parameter allows you to specify the coordinates, width and height of the area
 * ```
 * @export
 * @async
 * @param {string} imagePath local path to save the PNG image
 * @param {Monitor} [monitor="Single"] Monitor options, "Single", "Dual", or "Window"
 * @param {?Screen} [screen] {x, y, width, height} Screen option
 * @returns {Promise<string>} the saved image path
 */
export async function screenshot(imagePath: string, monitor: Monitor = "Single", screen?: Screen): Promise<string> {

    let cmd = "savescreenshot"
    switch (monitor) {
        case "Dual":
            cmd = "savescreenshotfull"
            break;

        case "Window":
            cmd = "savescreenshotwin"
            break;
    }

    const args = [
        cmd,
        imagePath
    ]

    if (screen) {
        args.push(screen.x.toString())
        args.push(screen.y.toString())
        args.push(screen.width.toString())
        args.push(screen.height.toString())
    }

    const exitCode = await runNirCmd(args);
    if (exitCode === 0) {
        return imagePath;
    } else {
        return `Error: exit code ${exitCode}`
    }
}

/**
 * Question Box dialog
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * let res = await swissKnife.questionBox("A Question", "Do you want to quite smoking?")
 * if (res) {
 *     console.log("Great, keep trying!")
 * } else {
 *     console.log("Not Great, but keep trying!")
 * }
 * ```
 * @param title Question Box Title
 * @param text Question Box question text
 * @returns true if the user clicks YES
 */
export async function questionBox(title: string, text: string): Promise<boolean> {
    const args = [
        "qboxcom",
        text,
        title,
        "returnval",
        "0x30"
    ]
    const exitCode = await runNirCmd(args);
    return exitCode === 48
}

/**
 * InfoBox dialog
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * await swissKnife.infoBox("Deno", "Deno is great!")
 * ```
 * @param title InfoBox title
 * @param text InfoBox message
 * @returns the process exit code
 */
export async function infoBox(title: string, text: string): Promise<number> {
    const args = [
        "infobox",
        text,
        title
    ]
    const exitCode = await runNirCmd(args);
    return exitCode
}

/**
 * Play system beep
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * await swissKnife.beep(500, 1000) //play 500 hz for 1 sec.
 * ```
 * @param frequency Beep frequency
 * @param duration Beep duration in milliseconds
 * @returns the process exit code
 */
export async function beep(frequency: number, duration: number): Promise<number> {
    const args = [
        "beep",
        frequency.toString(),
        duration.toString(),
    ]
    const exitCode = await runNirCmd(args);
    return exitCode
}

/**
 * Play Windows system notification sound
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * await swissKnife.winBeep()
 * ```
 * @returns the process exit code
 */
export async function winBeep(): Promise<number> {
    const args = [
        "stdbeep"
    ]
    const exitCode = await runNirCmd(args);
    return exitCode
}


/**
 * Show window notification (Ballon)
 * @date 12/23/2023 - 3:41:08 PM
 *
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * await swissKnife.notification("My Title", "Hello Notification", 77, 2000)
 * ```
 * @export
 * @async
 * @param {string} title Notification Title
 * @param {string} text Notification Text
 * @param {number} [icon=77] Icon number (from shell32.dll)
 * @param {number} [timeout=5000] Timeout in milliseconds to hide the notification
 * @returns {Promise<number>} the process exit code
 */
export async function notification(title: string, text: string, icon = 77, timeout = 5000): Promise<number> {
    const args = [
        "trayballoon",
        title,
        text,
        `shell32.dll,${icon}`,
        timeout.toString()
    ]
    const exitCode = await runNirCmd(args);
    return exitCode
}


/**
 * Window Actions
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * //flash any window with title containing 'untit'
 * await swissKnife.winAction("Untit", "Contains", "Flash")
 * ```
 * @async
 * @param {string} winTitle Window title to control (example: notepad, calc ...)
 * @param {Find} find Find mode for window title (Equals, Contains, StartsWith, EndsWith)
 * @param {WinActions} action Close, Hide, Flash, Max, Min ...
 * @returns {Promise<number>}
 */
export async function winAction(winTitle: string, find: Find, action: WinActions): Promise<number> {
    let findStr = ""
    switch (find) {
        case "Contains":
            findStr = "ititle"
            break;

        case "EndsWith":
            findStr = "etitle"
            break;
        case "StartsWith":
            findStr = "stitle"
            break;
        default:
            findStr = "title"
            break;
    }
    const args = [
        "win",
        action.toLocaleLowerCase(),
        findStr,
        winTitle
    ]
    const exitCode = await runNirCmd(args);
    return exitCode
}

/**
 * Play mp3 file from local computer.
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * await swissKnife.playMp3("c:\\myFolder\\sound.mp3")
 * ```
 * @param mp3Path mp3 local path.
 * @returns true if exitCode is 0
 */
export async function playMp3(mp3Path: string): Promise<boolean> {
    const exitCode = await runCmdmp3(mp3Path)
    return exitCode === 0
}


/**
 * Turn off the monitor
 * @date 12/23/2023 - 4:28:24 PM
 *
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * await swissKnife.monitorOff() //turn off the monitor
 * ```
 * @export
 * @async
 * @returns {Promise<number>} process exit code.
 */
export async function monitorOff(): Promise<number> {
    const args = [
        "monitor",
        "off",
    ]
    const exitCode = await runNirCmd(args);
    return exitCode
}


/**
 * Windows Power
 * @date 12/23/2023 - 4:35:59 PM
 *
 * @example
 * ```ts
 * import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
 * await swissKnife.power("StandBy") //Windows standby
 * //Supported: StandBy, Logoff and Poweroff
 * ```
 * @export
 * @async
 * @param {PowerMode} mode standby, logoff, poweroff
 * @returns {Promise<number>} process exit code
 */
export async function power(mode:PowerMode): Promise<number> {
    const args = [];
    switch (mode) {
        case "Logoff":
            args.push("exitwin")
            args.push("logoff")
            break;
        case "StandBy":
            args.push("standby")
            break;
        case "PowerOff":
            args.push("exitwin")
            args.push("poweroff")
            break;
    }
    const exitCode = await runNirCmd(args);
    return exitCode
}

async function runNirCmd(args: Array<string>): Promise<number> {
    const OS = utils.getOS();

    if (OS !== utils.OS.windows) {
        console.error("\r\n  --> Sorry, Currently SwissKnife supports Windows OS Only :(\r\n")
        return -1;
    }
    const nirCmd = await utils.getNir();
    const p = new Deno.Command(nirCmd, {
        args: args,
        stderr: "piped",
        stdout: "piped"
    });
    const child = p.spawn();
    const { code } = await child.status;
    return code;
}

async function runCmdmp3(mp3: string): Promise<number> {
    const OS = utils.getOS();

    if (OS !== utils.OS.windows) {
        console.error("\r\n  --> Sorry, Currently SwissKnife supports Windows OS Only :(\r\n")
        return -1;
    }
    const cmd = await utils.getCmdmp3()
    const args = [mp3]
    const p = new Deno.Command(cmd, {
        args: args,
        stdout: "piped",
        stderr: "piped"
    });
    const child = p.spawn();
    const { code } = await child.status
    return code;
}

async function toggleMute(v: number): Promise<number> {
    const args = [
        "mutesysvolume",
        v.toString()
    ]
    return (await runNirCmd(args))
}
