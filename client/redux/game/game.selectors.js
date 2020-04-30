import { createSelector } from 'reselect';

const selectGameState = state => state.game;

export const selectGame = createSelector([selectGameState], game => game);

export const selectFieldTypes = createSelector([selectGameState], game => game.fieldTypes);
export const selectPlayers = createSelector([selectGameState], game => game.players);

export const selectGameLoaded = createSelector([selectGameState], game => game.gameLoaded);
export const selectPlayerId = createSelector([selectGameState], game => game.playerId);
export const selectLobbyId = createSelector([selectGameState], game => game.lobbyId);