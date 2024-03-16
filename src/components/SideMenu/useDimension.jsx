import { useState, useEffect } from 'react';

export const useDimensions = (ref) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const getDimensions = () => {
            if (ref.current) { // Check if the ref is not null
                const { current } = ref;
                setDimensions({
                    width: current.offsetWidth,
                    height: current.offsetHeight,
                });
            }
        };

        getDimensions();
        window.addEventListener('resize', getDimensions) // Update dimensions on resize

        return () => {
            window.removeEventListener('resize', getDimensions) // Clean up event listener
        };
    }, [ref])

    return dimensions;
};
