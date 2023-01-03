import { createGraphQLEffect } from '@servicenow/ui-effect-graphql';
import { glideRecordQuery } from "./query";

const customActions = {
	RECORD_FETCH_REQUESTED: 'RECORD_FETCH_REQUESTED',
	DATA_FETCH_STARTED: 'DATA_FETCH_STARTED',
	RECORD_FETCH_SUCCEEDED: 'RECORD_FETCH_SUCCEEDED',
	DATA_FETCH_FAILED: 'DATA_FETCH_FAILED',

	RELATED_RECORDS_REQUESTED: 'RELATED_RECORDS_FETCH_REQUESTED',
	RELATED_RECORDS_FETCH_SUCCEEDED: 'RELATED_RECORDS_FETCH_SUCCEEDED',
}

export const requestRecordData = (coeffects) => {
	const { action, state, updateState, dispatch } = coeffects;
	const { properties } = state;

	console.log('📗 Action:  request Record');
	console.log("  - state  ", state);
	console.log("  - dispatch RECORD_FETCH_REQUESTED");

	console.log("  - MATCHING FIELDS  ", properties.fields);

	let fieldsAsCSV = properties.fields;
	let graphQLFieldsString = buildGraphQLFieldsString (fieldsAsCSV);
	const fieldArray = fieldsAsCSV.split(",");

	// set fieldList to present in the View
	updateState({ fieldList: fieldArray });

	dispatch(
		customActions.RECORD_FETCH_REQUESTED,
		{
			encodedQuery: "sys_id=" + properties.id,
			table: properties.table,
			fields: graphQLFieldsString,
		}
	);
}

const buildGraphQLFieldsString = (fieldsAsCSV) => {
	const fieldArray = fieldsAsCSV.split(",");
	let graphQLFieldsString = "";
	let fieldList = [];
	for (const field of fieldArray) {
		graphQLFieldsString += `${field} {label value displayValue} `;
		fieldList.push(field);
	}
	console.log("  => - fieldList       : ", fieldList);
	console.log("  => - graphQLFieldsString : ", graphQLFieldsString);
	return  graphQLFieldsString;
}


const createRecordQuery = createGraphQLEffect(
	glideRecordQuery,
	{
		variableList: ["encodedQuery"],
		templateVarList: ['table', 'fields'],
		startActionType: customActions.DATA_FETCH_STARTED,
		successActionType: customActions.RECORD_FETCH_SUCCEEDED,
		errorActionType: customActions.DATA_FETCH_FAILED
	}
);

const createRelatedRecordsQuery = createGraphQLEffect(
	glideRecordQuery,
	{
		variableList: ["encodedQuery"],
		templateVarList: ['table', 'fields'],
		startActionType: customActions.DATA_FETCH_STARTED,
		successActionType: customActions.RELATED_RECORDS_FETCH_SUCCEEDED,
		errorActionType: customActions.DATA_FETCH_FAILED
	}
);


const startDataFetch = ({ action, state, dispatch }) => {
	console.log('📗 Action: Fetching Data...');
	console.log("   action", action);
};

const buildEncodedQuery = (object) => {
	let encodedQuery = '';
	for (const key in object) {
		if (object.hasOwnProperty(key)) {
			let value = object[key];
			//console.log("    - " + key + " ( " + typeof value + " )");
			if (value == null) continue;
			//console.log("    value=", value);
			if (typeof value === 'object') {
				value = value.value;
			}
			encodedQuery += `${key}=${value}^`;
			//console.log(encodedQuery);
		}
	}
	// Remove the last '^' character
	encodedQuery = encodedQuery.slice(0, -1);
	return encodedQuery;
}


const handleRecordFetchSuccess = ({ action, state, dispatch, updateState, }) => {
	const { payload, meta } = action;
	const { properties } = state;

	console.log('📗 Action: Record Fetch Success');

	console.log("   meta: ", meta);
	console.log("   meta - variables: ", meta["options"]["variables"]);

	if (payload.errors.length) {
		console.error(payload.errors[0]);
		console.error(payload.data);
		dispatch('PROPERTIES_SET', { error: FETCH_ERROR });
		return;
	}
	const table = meta["options"]["templateVars"]["table"] || "";
	const fields = meta["options"]["templateVars"]["fields"] || "";
	const record = payload["data"]["GlideRecord_Query"][table]["_results"][0] || {};
	console.log("   table  : ", table);
	console.log("   record : ", record);


	let fieldsAsCSV = properties.displayfields;
	let graphQLFieldsString = buildGraphQLFieldsString (fieldsAsCSV);

	console.log("  - MATCHING FIELDS  ", properties.fields);
	console.log("  - DISPLAY  FIELDS  ", properties.displayfields);

	updateState({ record: record });

	console.log("  - BUILD ENCODED QUERY  ");
	let encodedQuery = buildEncodedQuery(record);
	console.log("  		- " + encodedQuery);
	dispatch(
		customActions.RELATED_RECORDS_REQUESTED,
		{
			encodedQuery: encodedQuery,
			table: table,
			fields: graphQLFieldsString,
		}
	);
}

const handleRelatedRecordsFetchSuccess = ({ action, state, dispatch, updateState, }) => {
	const { payload, meta } = action;
	console.log('📗 Action: Related Records Fetch Success');
	console.log("   meta: ", meta);
	console.log("   meta - variables: ", meta["options"]["variables"]);
	const table = meta["options"]["templateVars"]["table"] || "";
	const result = payload["data"]["GlideRecord_Query"][table]["_results"] || [];
	console.log("   table  : ", table);
	console.log("   result : ", result);
	updateState({ items: result });
}

const handleRecordFetchFailure = ({ action, state, dispatch }) => {
	console.log('📕 Actions: Error Data Fetch');
	console.log("Error: action = ", action);
	console.log(`Error: ${action.payload.response.statusText}`);
	dispatch('PROPERTIES_SET', { error: FETCH_ERROR });
};


// 1. [actionTypes.COMPONENT_BOOTSTRAPPED]: requestRecordData,
// 2. requestRecordData  => dispatch(customActions.RECORD_FETCH_REQUESTED,...
// 3. [customActions.RECORD_FETCH_REQUESTED]: createDataQuery,
// 4. [customActions.RECORD_FETCH_SUCCEEDED]: handleRecordFetchSuccess,
// 5. handleRecordFetchSuccess => dispatch(customActions.GOOGLE_API_LOAD_REQUESTED, { googleApiKey: googleMapApiKey });


// 2. => requestRelatedRecordsData 

export const dataActionHandlers = {
	[customActions.RECORD_FETCH_REQUESTED]: createRecordQuery,
	[customActions.DATA_FETCH_STARTED]: startDataFetch,
	[customActions.RECORD_FETCH_SUCCEEDED]: handleRecordFetchSuccess,
	[customActions.DATA_FETCH_FAILED]: handleRecordFetchFailure,
	// Related Records
	[customActions.RELATED_RECORDS_REQUESTED]: createRelatedRecordsQuery,
	[customActions.RELATED_RECORDS_FETCH_SUCCEEDED]: handleRelatedRecordsFetchSuccess,
};