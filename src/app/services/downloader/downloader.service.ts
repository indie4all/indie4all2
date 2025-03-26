import { injectable } from "inversify";

@injectable()
export default class DownloaderService {

    constructor() { }

    public async download(file: File): Promise<void> {
        const link = document.createElement('a');
        const url = URL.createObjectURL(file)
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }


}