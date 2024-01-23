// export de la class TEAM (Devellopement fonctionnel)
// readOnly
import {Team} from "./teams";
import fs from "fs";

export	class Group {
    no: number;
    teams: Team[];

    static MAX_GROUP = 6;

    constructor(no: number, teams: Team[]) {
        this.no = no;
        this.teams = teams;
    }
}