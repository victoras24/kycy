import React, { useState, useEffect } from "react";
import { ImMagicWand } from "react-icons/im";
import { FaMicrophone } from "react-icons/fa";
import debounce from "lodash/debounce";

export default function Search() {
    const [input, setInput] = useState("")
    const [organisations, setOrganisations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const debouncedFetchCompanyData = debounce((value) => {
        fetchCompanyData(value)
    }, 300)

    useEffect(() => {
        if (input.trim() !== "") {
            debouncedFetchCompanyData(input)
        } else {
            setOrganisations([])
        }
        // Cleanup debounce on unmount
        return () => debouncedFetchCompanyData.cancel()
    }, [input])

    const fetchCompanyData = (value) => {
        setLoading(true)
        fetch(`http://localhost:3000/api/organisations?keyword=${value}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok')
                }
                return res.json()
            })
            .then((data) => {
                setOrganisations(data)
                setLoading(false)
                setError(null)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
                setError(error.message)
                setLoading(false)
                setOrganisations([])
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
            {organisations.length > 0 && (
                <div className="result-wrapper">
                    {organisations.map((company, index) => (
                        <div className="search-result" key={index}>
                            <div className="search-result-organisation-name">
                                {company["organisation_name"]}
                            </div>
                            <div className="search-result-address">
                                {company["street"]}
                                {company["building"]}
                                {company["territory"]}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    )
}