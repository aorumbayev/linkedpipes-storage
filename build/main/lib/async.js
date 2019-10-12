"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A sample async function (to demo Typescript's es7 async/await downleveling).
 *
 * ### Example (es imports)
 * ```js
 * import { asyncABC } from 'typescript-starter'
 * console.log(await asyncABC())
 * // => ['a','b','c']
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var double = require('typescript-starter').asyncABC;
 * asyncABC().then(console.log);
 * // => ['a','b','c']
 * ```
 *
 * @returns       a Promise which should contain `['a','b','c']`
 */
async function asyncABC() {
    function somethingSlow(index) {
        const storage = 'abc'.charAt(index);
        return new Promise(resolve => 
        // later...
        resolve(storage));
    }
    const a = await somethingSlow(0);
    const b = await somethingSlow(1);
    const c = await somethingSlow(2);
    return [a, b, c];
}
exports.asyncABC = asyncABC;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2FzeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNJLEtBQUssVUFBVSxRQUFRO0lBQzVCLFNBQVMsYUFBYSxDQUFDLEtBQWdCO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsT0FBTyxJQUFJLE9BQU8sQ0FBUyxPQUFPLENBQUMsRUFBRTtRQUNuQyxXQUFXO1FBQ1gsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUNqQixDQUFDO0lBQ0osQ0FBQztJQUNELE1BQU0sQ0FBQyxHQUFHLE1BQU0sYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFaRCw0QkFZQyJ9