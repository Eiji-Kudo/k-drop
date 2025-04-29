/* istanbul ignore file */
/**
 * @jest-environment jsdom
 * @jest-ignore
 */

// Mock useRef to control the prevUnansweredRef value
export const mockRef = { current: [99] } // Initialize with a value that will be different from test data
