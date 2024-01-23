import {shuffle} from "lodash";
import {Team} from "./Class/teams";
import {Group} from "./Class/groups";
import { group } from "console";

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


console.log(setRandomGroup());
