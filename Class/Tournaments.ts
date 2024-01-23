import { Team } from './teams';
import { Match } from './match';

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
        this.finalMatch = new Match(new Team("","","",0,"",""),0,new Team("","","",0,"",""),0);
        this.thirdPlaceMatch = new Match(new Team("","","",0,"",""),0,new Team("","","",0,"",""),0);
    }
}


