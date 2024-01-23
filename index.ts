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
const simulateMatch = (type: string, local: Team, visitor: Team): Match => {
    const scoreLocal = Math.floor(Math.random() * 5);
    const scoreVisitor = Math.floor(Math.random() * 5);

    return new Match(type, local, scoreLocal, visitor, scoreVisitor);

};

// Simuler tous les matchs d'un groupe
const simulatePool = (group: Group): Match[] => {
    const matches = [];

    for (let i = 0; i < group.teams.length; i++) {
        for (let j = i + 1; j < group.teams.length; j++) {
            matches.push(simulateMatch("group", group.teams[i], group.teams[j]));
        }
    }

    return matches;
}

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
console.log("résultat");
console.log(groups);


