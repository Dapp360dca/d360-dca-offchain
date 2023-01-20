import AccountCard from "./AccountCard";

const AccountGrid = (props: any) => {
  return (
    <div className="flex bg-[image:url('/bgf.jpg')] bg-no-repeat bg-cover bg-center bg-fixed  h-screen w-full">
      <div className="container max-w-screen-lg mx-auto mt-20">
      <div className="text-3xl text-[#900603] font-bold flex justify-center mt-6">Account Overview</div>
      <div className="grid gap-x-0 gap-y-0 grid-cols-3">
      {props.accounts.map((account: any, index: Number) => (
        <AccountCard key={index} meta={account} />
      ))}
    </div>
    </div>
    </div>
  );
};

export default AccountGrid;
