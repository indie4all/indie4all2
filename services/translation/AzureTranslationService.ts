import axios from 'axios';
import { TranslationService } from "./TranslationService";

// Class to translate texts
export class AzureTranslationService extends TranslationService {

    public translate(content: string, from: string, to: string): Promise<string> {
        return new Promise((resolve, reject) => {

            // Return the original text if the source and target languages are the same
            if (from === to) {
                resolve(content);
                return;
            }

            const headers = {
                'Ocp-Apim-Subscription-Key': this.key,
                'Content-Type': 'application/json'
            }
            if (this.location)
                headers['Ocp-Apim-Subscription-Region'] = this.location;

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${this.endpoint}?api-version=3.0&from=${from}&to=${to}&textType=html`,
                headers,
                data: [{ "Text": content }]
            };

            return axios.request(config)
                .then((response) => resolve(response.data[0].translations[0].text))
                .catch((error) => reject(error));

        });
    }
}