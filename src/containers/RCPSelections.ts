import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ProfessionActions from '../actions/ProfessionActions';
import { AppState } from '../reducers/app';
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from '../selectors/rcpSelectors';
import { getAttributes, getCantrips, getCombatTechniques, getSkills, getSpecialAbilities, getSpells, getWiki } from '../selectors/stateSelectors';
import { Selections as SelectionsInterface } from '../types/data.d';
import { Selections, SelectionsDispatchProps, SelectionsOwnProps, SelectionsStateProps } from '../views/rcp/Selections';

function mapStateToProps(state: AppState) {
	return {
		attributes: getAttributes(state),
		cantrips: getCantrips(state),
		combatTechniques: getCombatTechniques(state),
		currentRace: getCurrentRace(state)!,
		currentCulture: getCurrentCulture(state)!,
		currentProfession: getCurrentProfession(state)!,
		currentProfessionVariant: getCurrentProfessionVariant(state),
		skills: getSkills(state),
		specialAbilities: getSpecialAbilities(state),
		spells: getSpells(state),
		wiki: getWiki(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		setSelections(selections: SelectionsInterface) {
			dispatch<any>(ProfessionActions._setSelections(selections));
		}
	};
}

export const SelectionsContainer = connect<SelectionsStateProps, SelectionsDispatchProps, SelectionsOwnProps>(mapStateToProps, mapDispatchToProps)(Selections);
