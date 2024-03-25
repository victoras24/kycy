export const fetchAddressData = (addressSeqNo) => {
    return fetch(
        `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=31d675a2-4335-40ba-b63c-d830d6b5c55d&q=${addressSeqNo}`
    )
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then((data) => {
            const filteredAddress = data.result.records.filter(record => record.address_seq_no === addressSeqNo);
            return filteredAddress; // Return an array with the filtered ad
        })
        .catch((error) => {
            console.error("Error fetching address data:", error);
            throw error;
        });
};