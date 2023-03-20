import theme1 from "./GeneralTheme1.jpg";
import theme2 from "./GeneralTheme2.jpg";
import theme3 from "./GeneralTheme3.jpg";
import theme4 from "./GeneralTheme4.jpg";
import theme5 from "./GeneralTheme5.jpg";
import theme6 from "./GeneralTheme6.jpg";
import theme7 from "./GeneralTheme7.jpg";
import theme8 from "./GeneralTheme8.jpg";
import theme9 from "./GeneralTheme9.jpg";
import theme10 from "./GeneralTheme10.jpg";
import theme11 from "./GeneralTheme11.jpg";
import theme12 from "./GeneralTheme12.jpg";
import theme13 from "./GeneralTheme13.jpg";
import theme14 from "./GeneralTheme14.jpg";
import theme15 from "./GeneralTheme15.jpg";
import theme16 from "./GeneralTheme16.jpg";
import theme17 from "./GeneralTheme17.jpg";
import theme18 from "./GeneralTheme18.jpg";
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