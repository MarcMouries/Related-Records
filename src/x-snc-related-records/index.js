import { createCustomElement, actionTypes } from "@servicenow/ui-core";
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import properties from './properties';
import styles from './styles.scss';
import view from './view';
import { dataActionHandlers, customActions, requestRecordData, createDataQuery, startDataFetch, finishDataFetchSuccess, finishDataFetchFailure } from './actions';

const { COMPONENT_BOOTSTRAPPED } = actionTypes;

createCustomElement('x-snc-related-records', {
	renderer: { type: snabbdom },
	view,
	styles,
	properties,
	actionHandlers: {
		[actionTypes.COMPONENT_BOOTSTRAPPED]: requestRecordData,

		...dataActionHandlers
	}
});