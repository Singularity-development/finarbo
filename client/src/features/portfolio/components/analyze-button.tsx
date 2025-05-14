import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function AnalyzeButton() {
  const { t } = useTranslation();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.button
      className="relative overflow-hidden bg-blue-600 text-white px-4 py-1 rounded-lg flex items-center gap-2 cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{
        boxShadow:
          "0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -2px rgba(59, 130, 246, 0.2)",
      }}
      animate={
        isHovering
          ? {
              boxShadow:
                "0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -4px rgba(59, 130, 246, 0.3)",
            }
          : {
              boxShadow:
                "0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -2px rgba(59, 130, 246, 0.2)",
            }
      }
      transition={{ duration: 0.3 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500"
        animate={
          isHovering
            ? {
                background:
                  "linear-gradient(90deg, rgba(37, 99, 235, 1) 0%, rgba(59, 130, 246, 1) 50%, rgba(37, 99, 235, 1) 100%)",
              }
            : {
                background:
                  "linear-gradient(90deg, rgba(37, 99, 235, 1) 0%, rgba(59, 130, 246, 1) 100%)",
              }
        }
        transition={{ duration: 0.5 }}
      />

      {/* Wave */}
      {isHovering && (
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 rounded-full bg-white/10"
          animate={{
            scale: [0, 5],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        />
      )}

      {/* Efecto de brillo en el texto */}
      {isHovering && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 0.5,
          }}
        />
      )}

      <motion.div
        animate={
          isHovering
            ? {
                rotate: [0, 20, -20, 0],
              }
            : {}
        }
        transition={{
          duration: 1,
          repeat: isHovering ? Number.POSITIVE_INFINITY : 0,
          repeatDelay: 2,
        }}
      >
        <ShieldCheck
          className={`h-4 w-4 relative z-10 ${
            isHovering ? "text-yellow-300" : "text-white"
          }`}
        />
      </motion.div>
      <span className="relative z-10">
        {t("actions.portfolioAnalysis", { ns: "portfolio" })}
      </span>
    </motion.button>
  );
}
