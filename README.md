# SwissKnife

Deno Swiss Knife tools (Windows Only)

SwissKnife is a Deno module that allows you to do some useful tasks on Windows OS using NirCmd v2.86

## Usage

### Sound Library

#### Text To Speech

Speaks the text your specify by using the Speech library (SAPI) that comes with Windows.

```ts
import * as swissKnife from "./mod.ts"
let res = await SwissKnife.speak("Hello from the other world")
```

You can also set the rate and the volume:

```ts
import * as swissKnife from "./mod.ts"
let res = await SwissKnife.speak("Hello from the other world", {rate: 3, volume: 80})
//rate: -10 -> 10
//volume: 0% -> 100%
```
