import { useStoreState } from "../utils/store";

const Address = () => {
  const walletStore = useStoreState((state: any) => state.wallet);

  return (
    <div className="fixed top-14">
      <div>
        <h1 className="font-bold px-4 text-[#09031B]">
          Address: {walletStore.address}
        </h1>
      </div>
    </div>
  );
};

export default Address;
