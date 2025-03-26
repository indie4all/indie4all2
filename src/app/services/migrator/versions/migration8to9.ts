import { inject, injectable } from "inversify";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration8to9 extends Migration {

    @inject(UtilsService) private utils: UtilsService;

    async run(model: any) {

        const couples = this.utils.findObjectsOfType(model, "CouplesItem");
        couples.forEach(couple => {
            if (!Array.isArray(couple.data.couples))
                couple.data.couples = [];

            if (couple.data.couples.length === 0) {
                couple.data.couples[0] = {
                    type: "image",
                    image: couple.data.image,
                    alt: couple.data.alt,
                    text: ''
                }
            }

            if (couple.data.couples.length === 1) {
                couple.data.couples[1] = {
                    type: "text",
                    image: "",
                    alt: "",
                    text: couple.data.text
                }
            }

            delete couple.data.image;
            delete couple.data.alt;
            delete couple.data.text;
        });
    }
}