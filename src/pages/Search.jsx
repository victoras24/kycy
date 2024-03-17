import React, { useState, useEffect } from "react";
import { ImMagicWand } from "react-icons/im";
import { FaMicrophone } from "react-icons/fa";
import debounce from "lodash/debounce";

export default function Search() {
    const [input, setInput] = useState("")
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const debouncedFetchData = debounce((value) => {
        fetchData(value)
    }, 300)

    useEffect(() => {
        if (input.trim() !== "") {
            debouncedFetchData(input)
        } else {
            setData([])
        }
        return () => debouncedFetchData.cancel()
    }, [input])

    const fetchData = (value) => {
        setLoading(true)
        fetchCompanyData(value)
            .then((companyData) => {
                const addressSeqNos = companyData.map(company => company.address_seq_no)
                return fetchAddressData(addressSeqNos.join('|'))
                    .then((addressData) => {
                        // Merge company data with address data
                        const mergedData = companyData.map(company => {
                            const address = addressData.find(address => address.address_seq_no === company.address_seq_no)
                            return {
                                ...company,
                                address: address || null
                            }
                        })
                        setData(mergedData)
                    })
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
                setError(error.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const fetchCompanyData = (value) => {
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

    const fetchAddressData = (addressSeqNos) => {
        return fetch(
            `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=31d675a2-4335-40ba-b63c-d830d6b5c55d&q=${addressSeqNos}`
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

    return (
        <div className="search-bar-container">
            <div className="input-wrapper">
                <ImMagicWand id="search-icon" />
                <input
                    className="search-bar-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search for companies..."
                />
                <div className="micro-wrapper">
                    {loading ? <span id="loader"></span> : <FaMicrophone id="microphone-icon" />}
                </div>
            </div>
            {error && <div>Error: {error}</div>}
            {data.length > 0 && (
                <div className="result-wrapper">
                    {data.map((item, index) => (
                        <div className="search-result" key={index}>
                            <div className="search-result-organisation-name">
                                {item.organisation_name}
                            </div>
                            {item.address && (
                                <div className="search-result-address">{item.address.street}, {item.address.building}, {item.address.territory}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
