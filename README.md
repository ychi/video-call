
## An imelementation of Agora Video Call

* Based on official example code.
* More streamlined user flow: fill in necessary info first, then join channel
* Check required piece of info before joining
  * if camera or microphone not present, refraine user from joining.
* Action buttons only appear/clickable when they are useable
* Unpublishing stream automatically resets audio to "not muted."
* State management with `useReducer`
  * Use `enum` to manage state when possible (possible improvement: use finite state machine to further simplify, avoiding bug down the road).
* Use `async`, `await` to improve readability.

