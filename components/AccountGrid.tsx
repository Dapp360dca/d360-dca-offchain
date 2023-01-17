import AccountCard from "./AccountCard";

const AccountGrid = (props: any) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {props.accounts.map((account: any, index: Number) => (
        <AccountCard key={index} meta={account} />
      ))}
    </div>
  );
};

export default AccountGrid;
