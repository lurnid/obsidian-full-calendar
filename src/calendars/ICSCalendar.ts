import { request } from "obsidian";
import { CalendarInfo } from "src/types";
import { Calendar, EventResponse } from "./Calendar";
import { getEventsFromICS } from "../parsing/ics";
const WEBCAL = "webcal";

export default class ICSCalendar extends Calendar {
    private url: string;
    private response: string | null = null;

    constructor(color: string, url: string) {
        super(color);
        if (url.startsWith(WEBCAL)) {
            url = "https" + url.slice(WEBCAL.length);
        }
        this.url = url;
    }

    get type(): CalendarInfo["type"] {
        return "ical";
    }

    get identifier(): string {
        return this.url;
    }
    get name(): string {
        return this.url;
    }

    async revalidate(): Promise<void> {
        this.response = await request({
            url: this.url,
            method: "GET",
        });
    }

    async getEvents(): Promise<EventResponse[]> {
        if (!this.response) {
            return [];
        }
        return getEventsFromICS(this.response).map((e) => [e, null]);
    }
}