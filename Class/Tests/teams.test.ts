import { Team } from '../teams';

describe('Team', () => {
    it('should create a new team', () => {
        const team = new Team('Test', 'red', 'blue', 1, 'TST', '1', 'A');
        expect(team.name).toBe('Test');
        expect(team.primary_color).toBe('red');
        expect(team.secondary_color).toBe('blue');
        expect(team.fifa_ranking).toBe(1);
        expect(team.code).toBe('TST');
        expect(team.hat).toBe('1');
        expect(team.playoff).toBe('A');
    });

    // Add more tests as needed
});