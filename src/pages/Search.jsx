import React, { useState, useEffect } from "react";
import { ImMagicWand } from "react-icons/im";
import { FaMicrophone } from "react-icons/fa";
import debounce from "lodash/debounce";
import { fetchCompanyData } from '../utils/companyDataApi';
import { fetchAddressData } from '../utils/companyAddressApi';

export default function Search() {
    const [input, setInput] = useState("")
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const debouncedFetchDataFromApi = debounce((value) => {
        fetchDataFromApi(value)
    }, 300)

    useEffect(() => {
        if (input.trim() !== "") {
            debouncedFetchDataFromApi(input)
        } else {
            setData([])
        }
        return () => debouncedFetchDataFromApi.cancel()
    }, [input])

    const fetchDataFromApi = (value) => {
        setLoading(true)
        fetchCompanyData(value)
            .then((companyData) => {
                const addressPromises = companyData.map(company => {
                    return fetchAddressData(company.address_seq_no)
                })
                Promise.all(addressPromises)
                    .then((addressResults) => {
                        const mergedData = companyData.map((company, index) => {
                            return {
                                ...company,
                                addresses: addressResults[index] || []
                            }
                        })
                        setData(mergedData)
                    })
            })
            .catch((error) => {
                setError(error.message)
            })
            .finally(() => {
                setLoading(false)
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
                            {item.addresses && (
                                <div className="search-result-address">
                                    {item.addresses.map((address, idx) => (
                                        <div className="search-result-each-address" key={idx}>
                                            {`${address.street}, ${address.building}, ${address.territory}`}
                                        </div>
                                    ))}
                                </div>

                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
