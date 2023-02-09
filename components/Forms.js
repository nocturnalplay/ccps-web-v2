import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export function DropDown(props) {
  return (
    <Select
      id={props.id}
      value={props.value}
      label={props.label}
      onChange={props.onChange}
      name={props.name}
      className={props.className}
      fullWidth
      size="small"
    >
      {props.data.map((a) => (
        <MenuItem key={a} value={a}>
          {a}
        </MenuItem>
      ))}
    </Select>
  );
}

export function DateFormate(val) {
  if (!val) {
    return "";
  } else {
    let a = val.split("-");
    if (a.length > 1) {
      return `${a[2]}/${a[1]}/${a[0]}`;
    } else {
      return val;
    }
  }
}
