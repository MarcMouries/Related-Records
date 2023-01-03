import "@servicenow/now-card";
import "@servicenow/now-highlighted-value";
import "@servicenow/now-label-value";

export default (state, { dispatch }) => {
	console.log("📗 View: state", state);
	const { properties, record } = state;
	//console.log("📗 View: properties", properties);
	//console.log("📗 View: record", record);

	if (state.loading)
		return <div>Loading...</div>;

	if (!state.record)
		return <div>No Record</div>;

	if (!state.items)
		return <div>No Related records found</div>;

	return (
		<div>
			{state.items.map(item =>
				<now-card className="card">
					<now-card-header
						tagline={{ "label": item["number"].value, "icon": "form-fill" }}
						heading={{ "label": item["short_description"].value, "size": "sm", "lines": 1 }} >
					</now-card-header>
					<now-card-divider></now-card-divider>
					<now-label-value-tabbed
						size="sm"
						items={state.fieldList.map(
							field => {
								return {
									label: item[field].label,
									value: item[field].displayValue
								}
							})}
					/> {/* now-label-value-tabbed */}
				</now-card>
			)
			}
		</div>
	);

};