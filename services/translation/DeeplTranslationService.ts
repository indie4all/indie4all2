import axios from 'axios';
import { TranslationService } from "./TranslationService";

// Class to translate texts
export class DeeplTranslationService extends TranslationService {

    public translate(content: string, from: string, to: string): Promise<string> {
        return new Promise((resolve, reject) => {
            // Return the original text if the source and target languages are the same
            if (from === to) {
                resolve(content);
                return;
            }

            const headers = { 'Authorization': `DeepL-Auth-Key ${this.key}` }

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${this.endpoint}?text=${content}&source_lang=${from}&target_lang=${to}&tag_handling=html&formality=prefer_more`,
                headers
            };

            return axios.request(config)
                .then((response) => resolve(response.data.translations[0].text))
                .catch((error) => reject(error));

        });
    }
}