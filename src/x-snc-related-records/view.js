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
				<span>
					{state.fieldList.map(field => (
						<p>item desc: {item[field].displayValue}</p>
					))}
				</span>
			)}
		</div>
	);

	/*
	  return (
		  <div className="related-records">
			  <section className="glass">
				  <div className="cards">
				  <h1>Data provided</h1>
				  {
						  properties.items.map((item, index) => (
							  <div className="card">
								  <span>{item.id} - {item.description}</span>
							  </div>
						  ))
					  }
				  </div>
			  </section>
		  </div >)
		   */
};