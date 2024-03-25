export const fetchCompanyData = (value) => {
    return fetch(
        `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=b48bf3b6-51f2-4368-8eaa-63d61836aaa9&q=${value}`
    )
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok")
            }
            return res.json()
        })
        .then((data) => {
            return data.result.records
        })
}