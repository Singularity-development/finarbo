import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-3 border-t border-gray-800 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} Singularity Studio. {t(`footer`, { ns: "global" })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
