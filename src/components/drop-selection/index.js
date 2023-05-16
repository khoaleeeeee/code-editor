import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";

export default function Selection({ label, optionList, onChange }) {
  const [option, setOption] = React.useState("");

  const handleChange = (event) => {
    setOption(event.target.value);
    onChange(event.target.value);
  };
  const CustomSelect = styled(Select)(() => ({
    color: "#ffffff",
    "&.MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#444e5b",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6895bb",
      },
    },
  }));

  return (
    <Box sx={{ width: "20%", marginLeft: "1rem" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" sx={{ color: "#ffffff" }}>
          {label}
        </InputLabel>
        <CustomSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={option}
          label={label}
          onChange={handleChange}
        >
          {optionList.map((opt) => (
            <MenuItem value={opt} key={opt}>
              {opt}
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>
    </Box>
  );
}
