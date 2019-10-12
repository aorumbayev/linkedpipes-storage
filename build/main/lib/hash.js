"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const sha_js_1 = __importDefault(require("sha.js"));
/**
 * Calculate the sha256 digest of a string.
 *
 * ### Example (es imports)
 * ```js
 * import { sha256 } from 'typescript-starter'
 * sha256('test')
 * // => '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
 * ```
 *
 * @returns sha256 message digest
 */
function sha256(message) {
    return sha_js_1.default('sha256')
        .update(message)
        .digest('hex');
}
exports.sha256 = sha256;
/**
 * A faster implementation of [[sha256]] which requires the native Node.js module. Browser consumers should use [[sha256]], instead.
 *
 * ### Example (es imports)
 * ```js
 * import { sha256Native as sha256 } from 'typescript-starter'
 * sha256('test')
 * // => '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
 * ```
 *
 * @returns sha256 message digest
 */
function sha256Native(message) {
    return crypto_1.createHash('sha256')
        .update(message)
        .digest('hex');
}
exports.sha256Native = sha256Native;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGFzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1DQUFvQztBQUNwQyxvREFBMkI7QUFFM0I7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxTQUFnQixNQUFNLENBQUMsT0FBZTtJQUNwQyxPQUFPLGdCQUFLLENBQUMsUUFBUSxDQUFDO1NBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUM7U0FDZixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUpELHdCQUlDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxTQUFnQixZQUFZLENBQUMsT0FBZTtJQUMxQyxPQUFPLG1CQUFVLENBQUMsUUFBUSxDQUFDO1NBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUM7U0FDZixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUpELG9DQUlDIn0=