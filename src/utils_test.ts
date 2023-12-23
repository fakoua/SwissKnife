import {assert, assertEquals} from "https://deno.land/std@0.182.0/testing/asserts.ts";
import * as utils from "./utils.ts"

Deno.test({
    name: "Test-TrunString",
    fn(): void {
        const res = utils.trunString("Hello Deno", 3);
        const expectedRes = "Hel\r\nlo \r\nDen\r\no\r\n";
        assertEquals(res, expectedRes);
    }
})

Deno.test({
    name: "Util getOS",
    fn(): void {
        const os = utils.getOS();
        console.log("OS:", os)
        assert(os === utils.OS.linux || os === utils.OS.darwin || os === utils.OS.windows)
    }
})
