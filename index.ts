import {shuffle} from "lodash";
import {Team} from "./Class/teams";
import {Group} from "./Class/groups";

// divise l'ensemble des équipes hors playoff + les équipes qualifiées en 6 groupe et renvoie le tableaux des groupes (1 équipe de chaque chapeau)
const setRandomGroup = (): Group[] => {
    const teams = Team.getTeams().filter(team => !team.playoff);
    const playoffTeams = getPlayoffWinners();

    const allTeams = [...playoffTeams, ...teams];

    // On recupere la liste des équipe pour chaque chapeau
    const hat1 = allTeams.filter(team => team.hat === "1");
    const hat2 = allTeams.filter(team => team.hat === "2");
    const hat3 = allTeams.filter(team => team.hat === "3");
    const hat4 = allTeams.filter(team => team.hat === "4");

    // On mélange les équipes de chaque chapeau
    const shuffledHat1 = shuffle(hat1);
    const shuffledHat2 = shuffle(hat2);
    const shuffledHat3 = shuffle(hat3);
    const shuffledHat4 = shuffle(hat4);

    // On attribue les équipes à chaque groupe
    const groups = Array.from({ length: 6 }, (_, index) => {
        const hats = [shuffledHat1, shuffledHat2, shuffledHat3, shuffledHat4].map(hatArray => hatArray[index]);
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



console.log(getPlayoffWinners());
