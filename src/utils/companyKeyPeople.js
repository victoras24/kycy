export const fetchKeyPeople = (value) => {
    return fetch(
        `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=a1deb65d-102b-4e8e-9b9c-5b357d719477&q=${value}`
    )
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok")
            }
            return res.json()
        })
        .then((data) => {
            return data.result.records; // Return the records from the response data
        });
}
