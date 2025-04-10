import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <span className="relative h-10 overflow-hidden flex items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={displayValue}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute w-full text-center"
        >
          {displayValue}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default AnimatedNumber;
