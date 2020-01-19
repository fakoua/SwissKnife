# SwissKnife

Deno Swiss Knife tools (Windows Only)

SwissKnife is a Deno module that allows you to do some useful tasks on Windows OS using NirCmd v2.86

## Usage

### Sound Library

#### Text To Speech

Speaks the text your specify by using the Speech library (SAPI) that comes with Windows.

```ts
import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
let res = await swissKnife.speak("Hello from the other world")
```

Run your script file:

```bash
deno -A myfile.ts #Requires allow-run and allow-write permissions
```

You can also set the rate and the volume:

```ts
import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"
let res = await swissKnife.speak("Hello from the other world", {rate: 3, volume: 80})
//rate: -10 -> 10
//volume: 0% -> 100%
```

### Computer System volume

```ts
import * as swissKnife from "https://deno.land/x/swissKnife/mod.ts"

//Set the volume
await swissKnife.setVolume(90) //value between 0 to 100

//mute the system sound
await swissKnife.mute()

//unmute the system sound
await swissKnife.unmute()
```

### Play beeps

`await swissKnife.beep(freq, duration)`

The freq (Frequance) parameter specifies the freq in hertz, the duration parameter specifies the duration of the sound in milliseconds.

```ts
await swissKnife.beep(500, 1000) //play 500 hz for 1 sec.
```

Also you can play the Windows standard beep (notification sound)

```ts
await swissKnife.winBeep()
```

## Desktop Library

### Take screenshot

With swissKnife you can take a screenshot of the full screen, dual screen and active windows and save the png file to your hard disk.

```ts
//Save the primary screen image.
let res = await swissKnife.screenshot("c:\\myfolder\\myfile.png")
```

Also you can specify Dual monitor:

```ts
//take a screenshot of both screens
let res = await swissKnife.screenshot("c:\\myfolder\\myfile.png", "Dual")
```

Also you can specify the current active window:

```ts
//take a screenshot of both screens
let res = await swissKnife.screenshot("c:\\myfolder\\myfile.png", "Window")
```

The third parameter allows you to specify the coordinates, width and height of the area:

```ts
//take a screenshot of both screens
let res = await swissKnife.screenshot("c:\\myfolder\\myfile.png", "Single", {
    x: 10,
    y: 30,
    width: 200,
    height: 150
})
```

### Show Notification (Tray Balloon)

Display a notification with text, icon and duration:

`swissKnife.notification(title, text, iconNumber, duration)`

NB: Icon number is the icon id in shell32.dll

```ts
await swissKnife.notification("My Title", "Hello Notification", 77, 2000)
```

### Show info box

Display a dialog box with "OK" button:

`await swissKnife.infoBox(title, text)`

### Question Box

Question box is a dialog box with "yes/no" buttons that returns true if the user clicks on yes

```ts
let res = await swissKnife.questionBox("A Question", "Do you want to quite smoking?")
if (res) {
    console.log("Great, keep trying!")
} else {
    console.log("Not Great, but keep trying!")
}
```

## Window (forms) Actions Library

This method allows you to hide, show, minimize, maximize, flush ... windows forms.

`winAction(winTitle: string, find: Find, action: WinActions)`

- winTitle: Window Title to send the command
- find: Find method (Contains, StartsWith, EndsWith and Equals)
- action: Close, Hide, Show, Active, Flax, Max, Min, Normal and Center.

```ts
//flash any window with title containing 'untit'
await swissKnife.winAction("Untit", "Contains", "Flash")
```

## License

[MIT](LICENSE)
