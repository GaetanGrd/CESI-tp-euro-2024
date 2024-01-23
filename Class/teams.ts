// export de la class TEAM (Devellopement fonctionnel)
// readOnly
import fs from "fs";

export class Team {
    name: string;
    primary_color: string;
    secondary_color: string;
    fifa_ranking: number;
    code: string;
    hat: string;
    playoff?: string;

    constructor(name: string, primary_color: string, secondary_color: string, fifa_ranking: number, code: string, hat: string, playoff?: string) {
        this.name = name;
        this.primary_color = primary_color;
        this.secondary_color = secondary_color;
        this.fifa_ranking = fifa_ranking;
        this.code = code;
        this.hat = hat;
        this.playoff = playoff;
    }

    public static getTeams(): Team[] {
        const rawTeams = fs.readFileSync("./Data/countries.json", "utf8");
        return JSON.parse(rawTeams);
    }
}