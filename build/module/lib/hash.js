import { createHash } from 'crypto';
import shaJs from 'sha.js';
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
export function sha256(message) {
    return shaJs('sha256')
        .update(message)
        .digest('hex');
}
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
export function sha256Native(message) {
    return createHash('sha256')
        .update(message)
        .digest('hex');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGFzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ3BDLE9BQU8sS0FBSyxNQUFNLFFBQVEsQ0FBQztBQUUzQjs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sVUFBVSxNQUFNLENBQUMsT0FBZTtJQUNwQyxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUM7U0FDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUFDLE9BQWU7SUFDMUMsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDO1NBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUM7U0FDZixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsQ0FBQyJ9