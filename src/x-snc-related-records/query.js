export const glideRecordQuery = `
query ($encodedQuery: String!) {
    GlideRecord_Query {
      {{table}}(queryConditions: $encodedQuery) {
        _rowCount
        _results {
          {{fields}}
        }
      }
    }
  }`;