import { useRef, useState } from "react"

export default function IconButton({ children, text, color, link, ...props }) {
    const [hovered, setHovered] = useState(false)
    const ref = useRef(null)
    return (
        <a href={link} target="_blank" rel="noopener noreferrer">
            <button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={`flex py-2 px-2 items-center rounded-full text-white ${color || "bg-black"}`}

                {...props}>
                {children}
                <div
                    style={{ width: hovered ? ref.current?.offsetWidth || 0 : 0 }}
                    className=" overflow-x-hidden transition-all duration-300 ease-out">
                    <span ref={ref}>{text}</span>
                </div>
            </button>
        </a >
    )
}