import { test, assert, assertEquals } from "../test_deps.ts"
import * as utils from "./utils.ts"

test(function test_utils_truncString1() {
    let res = utils.trunString("Hello Deno", 3)
    let expectedRes = "Hel\r\nlo \r\nDen\r\no\r\n"
    assertEquals(res, expectedRes)
})

test(function test_utils_truncString2() {
    let res = utils.trunString("Hello Deno", 30)
    let expectedRes = "Hello Deno\r\n"
    assertEquals(res, expectedRes)
})

test(function test_utils_getOS() {
    let os = utils.getOS();
    console.log("OS:", os)
    assert(os == utils.OS.linux || os == utils.OS.mac || os == utils.OS.win)
})