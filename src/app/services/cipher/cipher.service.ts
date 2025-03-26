import Config from '../../../config';
import UtilsService from '../utils/utils.service';
import { inject, injectable } from 'inversify';

/**
 * Services that provides funcionality for ciphering and deciphering strings
 */
@injectable()
export default class CipherService {
    protected encoder = new TextEncoder();

    constructor(@inject(UtilsService) protected utils: UtilsService) { }

    private get keyStr(): Uint8Array | null {
        const encOption = Config.getEncryptionKey();
        if (encOption === null) return null;
        return this.encoder.encode(typeof encOption === 'function' ? encOption() : encOption);
    }

    /**
     * Encrypts a string and encodes it in base64
     *
     * @param plainString String to be encrypted
     */
    public async encrypt(plainString: string): Promise<string> {
        if (!this.keyStr) return new Promise(resolve => resolve(plainString));
        const hash = await window.crypto.subtle.digest('SHA-256', this.keyStr);
        const iv = hash.slice(0, 16);
        const key = await window.crypto.subtle.importKey('raw', hash, 'AES-CBC', false, ['encrypt']);
        const buff = this.utils.str2ab(plainString);
        const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, buff);
        return btoa(this.utils.ab2str(encrypted));
    }

    /**
     * Deciphers a base64 string
     *
     * @param encryptedString Base64 string to be decrypted
     */
    public async decrypt(encryptedString: string): Promise<string> {
        if (!this.keyStr) return new Promise(resolve => resolve(encryptedString));
        const hash = await window.crypto.subtle.digest('SHA-256', this.keyStr);
        const iv = hash.slice(0, 16);
        const key = await window.crypto.subtle.importKey('raw', hash, 'AES-CBC', false, ['decrypt']);
        const buff = this.utils.str2ab(atob(encryptedString));
        const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, buff);
        return this.utils.ab2str(decrypted);
    }
}
