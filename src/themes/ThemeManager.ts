import theme1 from "./GeneralTheme1.avif";
import theme2 from "./GeneralTheme2.avif";
import theme3 from "./GeneralTheme3.avif";
import theme4 from "./GeneralTheme4.avif";
import theme5 from "./GeneralTheme5.avif";
import theme6 from "./GeneralTheme6.avif";
import theme7 from "./GeneralTheme7.avif";
import theme8 from "./GeneralTheme8.avif";
import theme9 from "./GeneralTheme9.avif";
import theme10 from "./GeneralTheme10.avif";
import theme11 from "./GeneralTheme11.avif";
import theme12 from "./GeneralTheme12.avif";
import theme13 from "./GeneralTheme13.avif";
import theme14 from "./GeneralTheme14.avif";
import theme15 from "./GeneralTheme15.avif";
import theme16 from "./GeneralTheme16.avif";
import theme17 from "./GeneralTheme17.avif";
import theme18 from "./GeneralTheme18.avif";
import Utils from "../Utils"

export default class ThemeManager {

    private static config = {
        "GeneralTheme1": { "color": "#963E17", "cover": theme1 },
        "GeneralTheme2": { "color": "#532e1c", "cover": theme2 },
        "GeneralTheme3": { "color": "#a9294f", "cover": theme3 },
        "GeneralTheme4": { "color": "#532e1c", "cover": theme4 },
        "GeneralTheme5": { "color": "#295939", "cover": theme5 },
        "GeneralTheme6": { "color": "#aa3a3a", "cover": theme6 },
        "GeneralTheme7": { "color": "#28527a", "cover": theme7 },
        "GeneralTheme8": { "color": "#28527a", "cover": theme8 },
        "GeneralTheme9": { "color": "#931a25", "cover": theme9 },
        "GeneralTheme10": { "color": "#5c6e91", "cover": theme10 },
        "GeneralTheme11": { "color": "#016644", "cover": theme11 },
        "GeneralTheme12": { "color": "#8D4500", "cover": theme12 },
        "GeneralTheme13": { "color": "#194350", "cover": theme13 },
        "GeneralTheme14": { "color": "#973D17", "cover": theme14 },
        "GeneralTheme15": { "color": "#295939", "cover": theme15 },
        "GeneralTheme16": { "color": "#8C4600", "cover": theme16 },
        "GeneralTheme17": { "color": "#5c6e91", "cover": theme17 },
        "GeneralTheme18": { "color": "#206265", "cover": theme18 }
    }

    static getThemes(): string[] {
        return Object.keys(this.config);
    }

    static async load(name: string): Promise<{ "color": string, "cover": string | ArrayBuffer }> {
        const theme = this.config[name];
        return Utils.encodeURLAsBase64DataURL(theme.cover).then(base64 => {
            return {
                "color": theme.color,
                "cover": base64
            }
        });
    }
}