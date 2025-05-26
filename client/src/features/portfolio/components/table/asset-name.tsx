import AssetLogo from "./asset-logo";

const AssetName = ({ symbol, name }: { symbol: string; name?: string }) => {
  return (
    <div className="flex items-center gap-2">
      <AssetLogo symbol={symbol} />

      <div className="flex flex-col items-start">
        <h5>{symbol}</h5>
        {name && name !== symbol && (
          <p className="text-xs text-gray-500">{name}</p>
        )}
      </div>
    </div>
  );
};

export default AssetName;
