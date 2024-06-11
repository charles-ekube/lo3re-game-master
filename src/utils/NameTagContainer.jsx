import Avatar from "./Avatar";
import Text from "./CustomText";

const NameTagContainer = ({ name, photo }) => {
  return (
    <div className="flexRow alignCenter" style={{ gap: "8px" }}>
      <Avatar name={name} src={photo} />
      <Text
        className={"satoshi-text f14 capitalize"}
        style={{ color: "rgba(16, 16, 16, 1)" }}
      >
        {name}
      </Text>
    </div>
  );
};

export default NameTagContainer;
