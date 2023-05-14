import { Player } from '../types/Game';

export const modifyPlayer = (playersArr: Player[], id: number, newState: any) =>
    playersArr.map((player, index) =>
        index === id ? { ...player, ...newState } : player
    );

export const getConnectedPlayers = (players: Player[]) =>
    players.filter(player => player.connected);
