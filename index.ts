import {shuffle} from "lodash";
import {Team} from "./Class/teams";
import {Group} from "./Class/groups";
import {Match} from "./Class/match";

// divise l'ensemble des équipes hors playoff + les équipes qualifiées en 6 groupe et renvoie le tableaux des groupes (1 équipe de chaque chapeau)
const setRandomGroup = (): Group[] => {
    const teams = Team.getTeams().filter(team => !team.playoff);
    const playoffTeams = getPlayoffWinners();

    const allTeams = [...playoffTeams, ...teams];

    // On mélange les équipes de chaque chapeau
    const shuffledHats = [1, 2, 3, 4].map(hatNumber =>
        shuffle(allTeams.filter(team => team.hat === hatNumber.toString()))
    );

    // On attribue les équipes à chaque groupe
    const groups = Array.from({ length: Group.MAX_GROUP }, (_, index) => {
        const hats = shuffledHats.map(hatArray => hatArray[index]);
        return new Group(index + 1, hats);
    });

    // On renvoie les groupes
    return groups;
};

// Renvoie les équipes qualifiées pour les playoffs
const getPlayoffWinners = (): Team[] => {
    const teams = Team.getTeams();
    const playoffTeams = teams.filter(team => Boolean(team.playoff));

    return [getWinner(playoffTeams, "A"), getWinner(playoffTeams, "B"), getWinner(playoffTeams, "C")];
};

// Renvoie une équipe gagnante d'un groupe de playoff
const getWinner = (teams: Team[], playoffgrp: string): Team => {
    const playoffTeams = teams.filter(team => team.playoff === playoffgrp);

    return playoffTeams[Math.floor(Math.random() * playoffTeams.length)];
};

// Simuler un match entre 2 équipes (1 victoire = 3 points, 1 nul = 1 point, 1 défaite = 0 point)
const simulateMatch = ( local: Team, visitor: Team): Match => {
    const scoreLocal = Math.floor(Math.random() * 50);
    const scoreVisitor = Math.floor(Math.random() * 50);

    return new Match(local, scoreLocal, visitor, scoreVisitor);

};

// Simuler tous les matchs d'un groupe
const simulatePool = (group: Group) => {
    const teams = group.teams;
    const generateMatches = (team: Team, index: number) =>
        teams.slice(index + 1).map(otherTeam => simulateMatch( team, otherTeam));

    return teams.flatMap((team, index) => generateMatches(team, index));
};

// calculer le classement d'un groupe en fonction des points
// 1 victoire = 3 points, 1 nul = 1 point, 1 défaite = 0 point
// si égalité de points, on regarde le goal average
// si égalité de goal average, on regarde le nombre de buts marqués
// si égalité de buts marqués, on regarde le nombre de buts encaissés
// si égalité de buts encaissés, on en tire un au sort
const getRanking = (group: Group): [Team, number][] => {
    const ranking = group.teams.map(team => [team, 0] as [Team, number]);

    for (const match of group.poolMatches) {
        const local = ranking.find(team => team[0].code === match.local.code);
        const visitor = ranking.find(team => team[0].code === match.visitor.code);

        if (local && visitor) {
            if (match.scoreLocal > match.scoreVisitor) {
                local[1] += 3;
            } else if (match.scoreLocal === match.scoreVisitor) {
                local[1] += 1;
                visitor[1] += 1;
            } else {
                visitor[1] += 3;
            }
        }
    }

    ranking.sort((a, b) => {
        if (a[1] > b[1]) {
            return -1;
        } else if (a[1] === b[1]) {
            const local = group.poolMatches.filter(match => match.local.code === a[0].code).reduce((acc, match) => acc + match.scoreLocal, 0);
            const visitor = group.poolMatches.filter(match => match.visitor.code === a[0].code).reduce((acc, match) => acc + match.scoreVisitor, 0);

            const local2 = group.poolMatches.filter(match => match.local.code === b[0].code).reduce((acc, match) => acc + match.scoreLocal, 0);
            const visitor2 = group.poolMatches.filter(match => match.visitor.code === b[0].code).reduce((acc, match) => acc + match.scoreVisitor, 0);

            if (local - visitor > local2 - visitor2) {
                return -1;
            } else if (local - visitor === local2 - visitor2) {
                if (local > local2) {
                    return -1;
                } else if (local === local2) {
                    if (visitor - local > visitor2 - local2) {
                        return -1;
                    } else if (visitor - local === visitor2 - local2) {
                        if (visitor > visitor2) {
                            return -1;
                        } else if (visitor === visitor2) {
                            return Math.random() - 0.5;
                        }
                    }
                }
            }
        }
        return 1;
    });
    return ranking;
}

// renvoyer les équipes qualifiées pour le tournois à élimination directe
const getQualifiedTeams = (groups: Group[]): Team[] => {
    const qualifiedTeams = groups.flatMap(group => group.poolRanking.slice(0, 2));
    const thirdTeams = groups.flatMap(group => group.poolRanking.slice(2, 3));

    const thirdTeamsSorted = thirdTeams.sort((a, b) => b[1] - a[1]);

    return [...qualifiedTeams, ...thirdTeamsSorted.slice(0, 4)].map(team => team[0]);
};

// retourner les équipes gagnantes d'un ensemble de matchs
const getWinners = (matches: Match[]): Team[] => {
    return matches.map(match => match.scoreLocal > match.scoreVisitor ? match.local : match.visitor);
};

const getloooser = (matches: Match[]): Team[] => {
    return matches.map(match => match.scoreLocal < match.scoreVisitor ? match.local : match.visitor);
}

// tirage au sort des matchs du tour préliminaire
const getRoundOf16Matches = (qualifiedTeams: Team[]): Match[] => {
    const shuffledTeams = shuffle(qualifiedTeams);
    const matches = [];

    for (let i = 0; i < shuffledTeams.length; i += 2) {
        matches.push(simulateMatch(shuffledTeams[i], shuffledTeams[i + 1]));
    }

    return matches;
};

// quart de finale : 8 équipes index 1 vs 2 index 3 vs 4 etc...
const getQuarterFinalMatches = (roundOf16Match : Team[]): Match[] => {
    const matches = [];

    for (let i = 0; i < roundOf16Match.length; i += 2) {
        matches.push(simulateMatch(roundOf16Match[i], roundOf16Match[i + 1]));
    }

    return matches;
}

// demi finale : 4 équipes index 1 vs 2 index 3 vs 4
const getSemiFinalMatches = (quarterFinalMatches: Team[]): Match[] => {
    const matches = [];

    for (let i = 0; i < quarterFinalMatches.length; i += 2) {
        matches.push(simulateMatch(quarterFinalMatches[i], quarterFinalMatches[i + 1]));
    }

    return matches;
};

// finale : 2 équipes index 1 vs 2
const getFinalMatch = (semiFinalWinners: Team[]): Match => {
    return simulateMatch(semiFinalWinners[0], semiFinalWinners[1]);
};

// petite finale : 2 équipes perdantes des demi finales
const getThirdPlaceMatch = (semiFinalLosers: Team[]): Match => {
    return simulateMatch(semiFinalLosers[0], semiFinalLosers[1]);
};

// truc pour afficher lol
const groups = setRandomGroup();
for (const group of groups) {
    group.poolMatches = simulatePool(group);
}
for (const group of groups) {
    group.poolRanking = getRanking(group);
}


for (let i = 0; i < 100; i++) {
    console.log(" ");
}

console.log("Equipes qualifiées pour les playoffs : ");
console.log(getPlayoffWinners().map(team => team.name + " " + team.playoff));
console.log(" ");

console.log("Liste des groupes : ");
console.log(groups.map(group => group.no + " : " + group.teams.map(team => team.name)));
console.log(" ");

console.log("Matchs de poule : ");
console.log(groups.map(group => group.poolMatches.map(match => match.local.name + " " + match.scoreLocal + " - " + match.scoreVisitor + " " + match.visitor.name)));
console.log(" ");

console.log("Classement des groupes : ");
console.log(groups.map(group => group.poolRanking.map(team => team[0].name + " " + team[1])));
console.log(" ");

const qualifiedTeams = getQualifiedTeams(groups);
console.log("Equipes qualifiées pour le tournois à élimination directe : ");
console.log(qualifiedTeams.map(team => team.name));
console.log(" ");

const roundOf16Matches = getRoundOf16Matches(qualifiedTeams);
console.log("Matchs du tour préliminaire : ");
console.log(roundOf16Matches.map(match => match.local.name + " " + match.scoreLocal + " - " + match.scoreVisitor + " " + match.visitor.name));
console.log(" ");

const roundOf16Winners = getWinners(roundOf16Matches);
console.log("Equipes qualifiées pour les quarts de finale : ");
console.log(roundOf16Winners.map(team => team.name));

const quarterFinalMatches = getQuarterFinalMatches(roundOf16Winners);
console.log("Matchs des quarts de finale : ");
console.log(quarterFinalMatches.map(match => match.local.name + " " + match.scoreLocal + " - " + match.scoreVisitor + " " + match.visitor.name));
console.log(" ");

const quarterFinalWinners = getWinners(quarterFinalMatches);
console.log("Equipes qualifiées pour les demi finales : ");
console.log(quarterFinalWinners.map(team => team.name));
console.log(" ");

const semiFinalMatches = getSemiFinalMatches(quarterFinalWinners);
console.log("Matchs des demi finales : ");
console.log(semiFinalMatches.map(match => match.local.name + " " + match.scoreLocal + " - " + match.scoreVisitor + " " + match.visitor.name));
console.log(" ");

const semiFinalWinners = getWinners(semiFinalMatches);
console.log("Equipes qualifiées pour la finale : ");
console.log(semiFinalWinners.map(team => team.name));
console.log(" ");

const finalMatch = getFinalMatch(semiFinalWinners);
console.log("Match de la finale : ");
console.log(finalMatch.local.name + " " + finalMatch.scoreLocal + " - " + finalMatch.scoreVisitor + " " + finalMatch.visitor.name);
console.log(" ");

const semiFinalLosers = getloooser(semiFinalMatches);
const thirdPlaceMatch = getThirdPlaceMatch(semiFinalLosers);
console.log("Match de la petite finale : ");
console.log(thirdPlaceMatch.local.name + " " + thirdPlaceMatch.scoreLocal + " - " + thirdPlaceMatch.scoreVisitor + " " + thirdPlaceMatch.visitor.name);