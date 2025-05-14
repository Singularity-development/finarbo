import Slider from "@/components/ui/slider";
import { RuleResult } from "@/services/apis/analysis/rule.model";
import { useTranslation } from "react-i18next";

const QuoteBlock = ({ quote, author }: { quote: string; author: string }) => (
  <blockquote className="relative text-gray-400 italic mt-4 p-4 px-6 border border-gray-800 rounded-md">
    <figure className="absolute top-4 left-4 text-gray-700 text-6xl font-serif">
      "
    </figure>
    <div className="pt-3 ml-10 text-white">
      <i>{quote}</i>
      <div className="text-gray-400 text-right mt-2">— {author}</div>
    </div>
  </blockquote>
);

const RiskQuotes = ({ riskResult }: { riskResult: RuleResult }) => {
  const { t } = useTranslation();

  const quotes = t(`result.${riskResult.code}.quotes`, {
    ns: "rules",
    returnObjects: true,
  }) as { quote: string; author: string }[];

  if (!quotes || !Array.isArray(quotes)) {
    return <></>;
  }

  if (quotes.length === 1) {
    return <QuoteBlock quote={quotes[0].quote} author={quotes[0].author} />;
  }

  return (
    <Slider
      slides={quotes.map((quote) => (
        <QuoteBlock quote={quote.quote} author={quote.author} />
      ))}
    />
  );
};

export default RiskQuotes;
