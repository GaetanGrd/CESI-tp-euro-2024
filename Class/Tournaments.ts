import { Team } from './Team';
import { Match } from './Match';

export class Tournament {
    teams: Team[];
    roundOf16Matches: Match[];
    quarterFinalMatches: Match[];
    semiFinalMatches: Match[];
    finalMatch: Match;
    thirdPlaceMatch: Match;

    constructor(teams: Team[]) {
        this.teams = teams;
        this.roundOf16Matches = [];
        this.quarterFinalMatches = [];
        this.semiFinalMatches = [];
        this.finalMatch = new Match(null, 0, null, 0);
        this.thirdPlaceMatch = new Match( null, 0, null, 0);
    }


