import { test, assertEquals } from "./test_deps.ts"
import * as swissKnife  from "./mod.ts"

test(async function test_mod_mute_unmute() {
    let res1 = await swissKnife.mute() 
    let res2 = await swissKnife.unmute()
    assertEquals(res1, 0)
    assertEquals(res2, 0)
})