import Logo from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";

const AssetLogo = ({
  symbol,
  size = 32,
}: {
  symbol: string;
  size?: number;
}) => {
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const src = useMemo(() => {
    return `${import.meta.env.VITE_CDN_URL}/Logos/${symbol.toUpperCase()}.svg`; // TODO - move to env variable
  }, [symbol]);

  if (imgError) {
    return (
      <span className="filter grayscale">
        <Logo />
      </span>
    );
  }

  return (
    <>
      {loading && (
        <Skeleton
          className="rounded-full h-4"
          style={{ width: size, height: size }}
        />
      )}
      <img
        className="rounded-full"
        style={{
          width: size,
          height: size,
          display: loading ? "none" : "block",
        }}
        src={src}
        alt={symbol}
        onLoad={() => setLoading(false)}
        onError={() => {
          setImgError(true);
          setLoading(false);
        }}
      />
    </>
  );
};

export default AssetLogo;
