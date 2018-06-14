/**
 * Generate the same mnemonics
 */

import { LANGUAGE } from './btc/wallet';
import { Mnemonic } from './thirdparty/bip39';

export const generate = (lang: LANGUAGE, strength: number): string => {
    if (strength < 128 && strength % 32 !== 0) {
        throw new Error('Strength should be greater or equal to 128 and divided by 32');
    }
    const mn = new Mnemonic(lang);

    return mn.generate(strength);
};