
import fs from "fs";
import { Team } from "./teams";

export class Match {
    local: Team;
    scoreLocal: number;
    visitor: Team;
    scoreVisitor: number;

    constructor(local: Team, scoreLocal: number, visitor: Team, scoreVisitor: number) {
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

    