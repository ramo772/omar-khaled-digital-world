/**
 * Keyboard ownership, shared by the world controller and the page shell.
 * Kept free of Three.js imports so the page shell stays light.
 */
export const MOVE_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'];

/** Controls whose own keyboard behaviour must win over walking (text entry, radios, tabs). */
export const OWNS_KEYS = 'input,textarea,select,[contenteditable],[role="tab"],[role="radio"],[role="slider"]';
