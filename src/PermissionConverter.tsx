// PermissionConverter.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

type ConversionType = "textToNumeric" | "numericToText";

const PermissionConverter: React.FC = () => {
  const [inputPermission, setInputPermission] = useState("");
  const [outputPermission, setOutputPermission] = useState("");
  const [conversionType, setConversionType] = useState<ConversionType>("textToNumeric");

  const convertToNumeric = (permission: string): string => {
    const permissionMap: { [key: string]: number } = {
      r: 4,
      w: 2,
      x: 1,
      "-": 0,
    };

    if (permission.length !== 9) return "Invalid input";

    const numericPermission = permission
      .match(/.{1,3}/g)!
      .map((segment) =>
        segment.split("").reduce((acc, curr) => acc + (permissionMap[curr] || 0), 0)
      )
      .join("");

    return numericPermission;
  };

  const convertToText = (permission: string): string => {
    const numericMap: { [key: number]: string } = {
      0: "---",
      1: "--x",
      2: "-w-",
      3: "-wx",
      4: "r--",
      5: "r-x",
      6: "rw-",
      7: "rwx",
    };

    if (!/^[0-7]{3}$/.test(permission)) return "Invalid input";

    const textPermission = permission
      .split("")
      .map((segment) => numericMap[parseInt(segment)])
      .join("");

    return textPermission;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const converter = conversionType === "textToNumeric" ? convertToNumeric : convertToText;
    setOutputPermission(converter(inputPermission));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center">
          Permission Converter
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Enter permission code"
          variant="outlined"
          value={inputPermission}
          onChange={(e) => setInputPermission(e.target.value)}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="conversion-type">Conversion type</InputLabel>
          <Select
            label="Conversion type"
            id="conversion-type"
            value={conversionType}
            onChange={(e) => setConversionType(e.target.value as ConversionType)}
          >
            <MenuItem value="textToNumeric">Text to numeric (e.g., rwxr-xr-x)</MenuItem>
            <MenuItem value="numericToText">Numeric to text (e.g., 755)</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Convert
        </Button>
      </Box>
      {outputPermission && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Converted permission:</Typography>
          <Typography variant="body1">{outputPermission}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default PermissionConverter;