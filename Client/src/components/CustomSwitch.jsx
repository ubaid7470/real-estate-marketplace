import { alpha, styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#AF795D",
    "&:hover": {
      backgroundColor: alpha("#AF795D", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#AF795D",
  },
}));

export default function CustomSwitch(props) {
  return (
    <>
      <PinkSwitch {...props} />
    </>
  );
}
