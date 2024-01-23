import { Group } from '../groups';
import { Team } from '../teams';

describe('Group', () => {
    it('should create a new group', () => {
        const team = new Team('Test', 'red', 'blue', 1, 'TST', '1', 'A');
        const group = new Group(1, [team]);
        expect(group.no).toBe(1);
        expect(group.teams.length).toBe(1);
    });

    // Add more tests as needed
});