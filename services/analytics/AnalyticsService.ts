import { LoggerModes, JetLogger } from 'jet-logger';
import fetch from "node-fetch";
import { IAnalytics } from './IAnalytics';
import { type } from 'jquery';
const logger = JetLogger(LoggerModes.Console);

export class AnalyticsService implements IAnalytics {
  
    private data : { user_id: string, domain: string, url : string, length: number; in_TIMESTAMP: number, out_TIMESTAMP: number, elapsed: number};
    public static token : { access_token : string, expires_in : number };
    private static obj : IAnalytics = { entrance: function(){ return this }, exit: function(){ return this }, setField: function(){return this}, send: function(){}};

    private constructor() {
        this.data =  {
            domain: `${process.env.ANALYTICS_DOMAIN}`,
            url : '',
            user_id: '',
            elapsed : 0,
            in_TIMESTAMP: 0,
            out_TIMESTAMP: 0,
            length: 0
        }
    }

    public static create(): IAnalytics {
        if (this.checkServiceIsAvaliable()) return new AnalyticsService();
        else return this.obj; 
    }

    public static checkServiceIsAvaliable() : boolean {
        if (!process.env.ANALYTICS_ENDPOINT || !process.env.OAUTH_ENDPOINT || !process.env.OAUTH_ANALYTICS_USER || !process.env.OAUTH_ANALYTICS_PASSWORD)
            return false;
        return true;
    }

    private static async getTokenAuthorize() {

        const username = process.env.OAUTH_ANALYTICS_USER;
        const password = process.env.OAUTH_ANALYTICS_PASSWORD;
        const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');

        const headers = {
            "X-Azure-FDID" : "00028f9e-042f-4dda-a5d1-739b39c453e3",
            "Content-Type" : "application/x-www-form-urlencoded",
            "Authorization" : `Basic ${encodedCredentials}`
        }

        let urlencoded = new URLSearchParams();
        urlencoded.append("grant_type", "client_credentials");

        const requestOptions : RequestInit = {
            method: 'POST',
            headers: headers,
            body: urlencoded,
            redirect: 'follow'
        };

        const url : URL = new URL(`${process.env.OAUTH_ENDPOINT}`);

        this.token = await fetch(url, requestOptions)
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error("Fail obtaining token");
        })
        .then(result => { 
            return {access_token: result.access_token, expires_in: Date.now() + result.expires_in * 1000 - 100};
        });

    }

    private static isAnExpiredToken() : boolean {
        const currentDate = Date.now();
        if (currentDate > this.token.expires_in) return true;
        else return false;
    }

    public entrance(url: string) : AnalyticsService {
        this.data.url = url;
        this.data.in_TIMESTAMP = Date.now();
        return this;
    }

    public exit(): AnalyticsService {
        this.data.out_TIMESTAMP = Date.now();
        this.data.elapsed = this.data.out_TIMESTAMP - this.data.in_TIMESTAMP;
        console.log(this.data.elapsed);
        return this;
    }

    public async send() {
        try {
            if (!AnalyticsService.token || AnalyticsService.isAnExpiredToken() ) await AnalyticsService.getTokenAuthorize();
            const headers = {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${AnalyticsService.token.access_token}`
            }

            const body  = this.data

            const requestOptions : RequestInit = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
                redirect: 'follow'
            };

            const url : URL = new URL(`${process.env.ANALYTICS_ENDPOINT}`);
            console.log(requestOptions);
         //   fetch(url, requestOptions);
        }
        catch(error) { 
            console.error(error);
        }
    }

    public setField(field: string, value: unknown) : AnalyticsService {
        if (field in this.data && typeof value === typeof this.data[field]) this.data[field] = value;
        return this;
    }


}