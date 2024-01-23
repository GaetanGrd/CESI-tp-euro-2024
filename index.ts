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
    let groups: Array<Group> = [];
    groups[0] = new Group(1, [shuffledHat1[0], shuffledHat2[0], shuffledHat3[0], shuffledHat4[0]]);
    groups[1] = new Group(2, [shuffledHat1[1], shuffledHat2[1], shuffledHat3[1], shuffledHat4[1]]);
    groups[2] = new Group(3, [shuffledHat1[2], shuffledHat2[2], shuffledHat3[2], shuffledHat4[2]]);
    groups[3] = new Group(4, [shuffledHat1[3], shuffledHat2[3], shuffledHat3[3], shuffledHat4[3]]);
    groups[4] = new Group(5, [shuffledHat1[4], shuffledHat2[4], shuffledHat3[4], shuffledHat4[4]]);
    groups[5] = new Group(6, [shuffledHat1[5], shuffledHat2[5], shuffledHat3[5], shuffledHat4[5]]);

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



