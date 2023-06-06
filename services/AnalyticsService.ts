import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);

export class AnalyticsService {
  
    private endPoint : string;

    private data : { url : string, elapsed: number};


    private constructor() {
        this.data =  {
            url : '',
            elapsed : 0
        }
    }

    public static create(): AnalyticsService {
        return new AnalyticsService();
    }

    public entrance(url: string) : AnalyticsService {
        this.data.url = url;
        this.data.elapsed = Date.now();
        return this;
    }

    public insertField(field : string, value: any): AnalyticsService {
        this.data[field] = value;
        return this;
    }

    public exit(): AnalyticsService {
        this.data.elapsed = Date.now() - this.data.elapsed;
        return this;
    }

    public send() {
        logger.info("[event] \n " + JSON.stringify(this.data));
    }

    
}