import { useEffect, useRef, useState } from 'react'

// Close menu when not clicking on ref element

const useClickOutside = () => {
    const [expanded, setExpanded] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setExpanded(false);
            }
        }

        document.addEventListener('mouseup', handleClickOutside)
        return () => {
            document.removeEventListener('mouseup', handleClickOutside)
        }
    }, [ref])

    return { expanded, setExpanded, ref }
}

export default useClickOutside
