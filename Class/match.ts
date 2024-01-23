// export de la class match (Devellopement fonctionnel)

import fs from "fs";
import { Team } from "./teams";

export class Match {
    type: string;
    local: Team;
    scoreLocal: number;
    visitor: Team;
    scoreVisitor: number;

    constructor(type: string, local: Team, scoreLocal: number, visitor: Team, scoreVisitor: number) {
        this.type = type;
        this.local = local;
        this.scoreLocal = scoreLocal;
        this.visitor = visitor;
        this.scoreVisitor = scoreVisitor;
    }

    public static getMatches(): Match[] {
        const rawMatches = fs.readFileSync("./Data/matches.json", "utf8");
        return JSON.parse(rawMatches);
    }
}

    