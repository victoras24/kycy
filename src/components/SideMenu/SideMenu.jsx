import { useEffect, useRef } from "react";
import { motion, useCycle, AnimatePresence } from "framer-motion";
import { useDimensions } from "./useDimension";
import { ToggleMenu } from "./ToggleMenu";
import { MenuNav } from "./MenuNav";

const sidebar = {
    open: (height = 1000) => ({
        clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
        transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2
        }
    }),
    closed: {
        clipPath: "circle(30px at 40px 40px)",
        transition: {
            delay: 0.5,
            type: "spring",
            stiffness: 400,
            damping: 40
        }
    }
}

export const SideMenu = () => {
    const [isOpen, setIsOpen] = useCycle(false, true)
    const containerRef = useRef(null)
    const { height } = useDimensions(containerRef)

    useEffect(() => {
        document.addEventListener("mousedown", clickOutsideMenuToClose)
        return () => {
            document.removeEventListener("mousedown", clickOutsideMenuToClose)
        }
    })

    const clickOutsideMenuToClose = (e) => {
        if (isOpen && !containerRef.current?.contains(e.target)) {
            setIsOpen(false)
        }
    }

    return (
        <AnimatePresence>
            <motion.nav
                initial={false}
                animate={isOpen ? "open" : "closed"}
                custom={height}
                ref={containerRef}
                variants={sidebar}
            >
                <motion.div className="background" variants={sidebar} />
                <MenuNav />
                <ToggleMenu toggle={() => setIsOpen()} />
            </motion.nav>
        </AnimatePresence>
    )
}
