// export de la class TEAM (Devellopement fonctionnel)
// readOnly
import {Team} from "./teams";
import {Match} from "./match";

import fs from "fs";

export	class Group {
    no: number;
    teams: Team[];
    poolMatches: Match[];
    poolRanking: [Team, number][];

    static MAX_GROUP = 6;

    constructor(no: number, teams: Team[]) {
        this.no = no;
        this.teams = teams;
        this.poolMatches = [];
        this.poolRanking = [];
    }
}