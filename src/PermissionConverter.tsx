import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Divider,
  Paper,
} from "@mui/material";

type ConversionType = "textToNumeric" | "numericToText";

interface CheckboxState {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  public: { read: boolean; write: boolean; execute: boolean };
}

const PermissionConverter: React.FC = () => {
  // 画面上部の機能用のstate
  const [inputPermissionUpper, setInputPermissionUpper] = useState("");
  const [outputPermissionUpper, setOutputPermissionUpper] = useState("");

  // 画面下部の機能用のstate
  const [outputTextLower, setOutputTextLower] = useState("");
  const [inputPermissionLower, setInputPermissionLower] = useState("");
  const [checkboxState, setCheckboxState] = useState<CheckboxState>({
    owner: { read: false, write: false, execute: false },
    group: { read: false, write: false, execute: false },
    public: { read: false, write: false, execute: false },
  });

  const [conversionType, setConversionType] =
    useState<ConversionType>("textToNumeric");

  // AdSenseのスクリプトを挿入する
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://adm.shinobi.jp/s/8a76f3b6ab6d540ea99edc699fd00623";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
  }, []);

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
        segment
          .split("")
          .reduce((acc, curr) => acc + (permissionMap[curr] || 0), 0)
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

  const handleSubmitUpper = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const converter =
      conversionType === "textToNumeric" ? convertToNumeric : convertToText;
    setOutputPermissionUpper(converter(inputPermissionUpper));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const [section, permission] = name.split(".");

    setCheckboxState((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section as keyof CheckboxState],
        [permission]: checked,
      },
    }));
  };

  useEffect(() => {
    if (
      conversionType === "numericToText" &&
      /^[0-7]{3}$/.test(inputPermissionUpper)
    ) {
      const textPermission = convertToText(inputPermissionUpper);
      const permissions = textPermission.match(/.{1,3}/g)!;

      const newCheckboxState: CheckboxState = {
        owner: {
          read: permissions[0][0] === "r",
          write: permissions[0][1] === "w",
          execute: permissions[0][2] === "x",
        },
        group: {
          read: permissions[1][0] === "r",
          write: permissions[1][1] === "w",
          execute: permissions[1][2] === "x",
        },
        public: {
          read: permissions[2][0] === "r",
          write: permissions[2][1] === "w",
          execute: permissions[2][2] === "x",
        },
      };
      setCheckboxState(newCheckboxState);
    }
  }, [inputPermissionUpper]);

  useEffect(() => {
    const textPermission = `${checkboxState.owner.read ? "r" : "-"}${checkboxState.owner.write ? "w" : "-"
      }${checkboxState.owner.execute ? "x" : "-"}${checkboxState.group.read ? "r" : "-"
      }${checkboxState.group.write ? "w" : "-"}${checkboxState.group.execute ? "x" : "-"
      }${checkboxState.public.read ? "r" : "-"}${checkboxState.public.write ? "w" : "-"
      }${checkboxState.public.execute ? "x" : "-"}`;
    const numericPermission = convertToNumeric(textPermission);
    setOutputTextLower(textPermission);
    setInputPermissionLower(numericPermission);
  }, [checkboxState]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左サイドバー */}
      <Box
        sx={{
          width: "15%",
          backgroundColor: "#f9f9f9",
          p: 2,
          textAlign: "center",
        }}
      >
        <div id="ads-left">
          <script
            src="https://adm.shinobi.jp/s/8a76f3b6ab6d540ea99edc699fd00623"
            async
          ></script>
        </div>
      </Box>

      {/* メインコンテンツ */}
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="sm">
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" align="center" color="primary">
              パーミッションプロフェッサーくん
            </Typography>
          </Box>
          {/* コンテンツここに配置 */}
          {/* パーミッション変換機能 */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Box
              component="form"
              onSubmit={handleSubmitUpper}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="パーミッションコードを入力"
                variant="outlined"
                value={inputPermissionUpper}
                onChange={(e) => setInputPermissionUpper(e.target.value)}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="conversion-type">変換タイプ</InputLabel>
                <Select
                  label="変換タイプ"
                  id="conversion-type"
                  value={conversionType}
                  onChange={(e) =>
                    setConversionType(e.target.value as ConversionType)
                  }
                >
                  <MenuItem value="textToNumeric">
                    テキストから数値へ (例: rwxr-xr-x)
                  </MenuItem>
                  <MenuItem value="numericToText">
                    数値からテキストへ (例: 755)
                  </MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                変換
              </Button>
            </Box>
            {outputPermissionUpper && (
              <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h6">変換されたパーミッション:</Typography>
                <Typography variant="body1" color="secondary">
                  {outputPermissionUpper}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* チェックボックス機能 */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h4" align="center" color="primary">
                チェックボックスでパーミッション設定
              </Typography>
              <Divider />
              <FormGroup>
                {["owner", "group", "public"].map((section) => (
                  <Box key={section}>
                    <Typography variant="subtitle1">{section}:</Typography>
                    {["read", "write", "execute"].map((permission) => (
                      <FormControlLabel
                        key={permission}
                        control={
                          <Switch
                            checked={
                              checkboxState[section as keyof CheckboxState][
                              permission as keyof typeof checkboxState["owner"]
                              ]
                            }
                            onChange={handleCheckboxChange}
                            name={`${section}.${permission}`}
                          />
                        }
                        label={permission}
                      />
                    ))}
                  </Box>
                ))}
              </FormGroup>
              <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h6">現在のパーミッション設定:</Typography>
                <Typography variant="body1" color="secondary">
                  数値: {inputPermissionLower}
                </Typography>
                <Typography variant="body1" color="secondary">
                  テキスト: {convertToText(inputPermissionLower)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* 右サイドバー */}
      <Box
        sx={{
          width: "15%",
          backgroundColor: "#f9f9f9",
          p: 2,
          textAlign: "center",
        }}
      >
        <div id="ads-right">
          <script
            src="https://adm.shinobi.jp/s/8a76f3b6ab6d540ea99edc699fd00623"
            async
          ></script>
        </div>
      </Box>
    </Box>
  );
};



export default PermissionConverter;
