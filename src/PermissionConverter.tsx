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
  Grid,
  Tooltip,
  IconButton,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

type ConversionType = "textToNumeric" | "numericToText";

interface CheckboxState {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  public: { read: boolean; write: boolean; execute: boolean };
}

// カスタムテーマの作成
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#4791db",
      dark: "#115293",
    },
    secondary: {
      main: "#f50057",
      light: "#f73378",
      dark: "#ab003c",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

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
    const textPermission = `${checkboxState.owner.read ? "r" : "-"}${
      checkboxState.owner.write ? "w" : "-"
    }${checkboxState.owner.execute ? "x" : "-"}${
      checkboxState.group.read ? "r" : "-"
    }${checkboxState.group.write ? "w" : "-"}${
      checkboxState.group.execute ? "x" : "-"
    }${checkboxState.public.read ? "r" : "-"}${
      checkboxState.public.write ? "w" : "-"
    }${checkboxState.public.execute ? "x" : "-"}`;
    const numericPermission = convertToNumeric(textPermission);
    setOutputTextLower(textPermission);
    setInputPermissionLower(numericPermission);
  }, [checkboxState]);

  // クリップボードにコピーする関数
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // ここでコピー成功の通知を表示することもできます
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
          pt: 4,
          pb: 8,
        }}
      >
        {/* 左側の広告スペース */}
        <Box
          sx={{
            width: { xs: 0, md: "15%" },
            display: { xs: "none", md: "block" },
            bgcolor: "background.default",
          }}
        >
          {/* 広告コンテンツがここに入ります */}
        </Box>

        {/* メインコンテンツ */}
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: 5, textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 1 }}>
              <SecurityIcon sx={{ fontSize: 40, color: "primary.main", mr: 1 }} />
              <Typography variant="h4" color="primary" fontWeight="bold">
                パーミッションプロフェッサーくん
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              Unixファイルパーミッションを簡単に変換・設定できるツール
            </Typography>
          </Box>
      
          {/* 教育的コンテンツ */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: 6,
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <InfoIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" color="primary" fontWeight="medium">
                Unixパーミッションについて
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              Unixシステムでは、ファイルやディレクトリに対するアクセス権限を「パーミッション」として設定します。
              パーミッションは「所有者（owner）」「グループ（group）」「その他（public）」の3つのカテゴリに対して、
              「読み取り（read）」「書き込み（write）」「実行（execute）」の権限を設定できます。
            </Typography>
            <Typography variant="body1" paragraph>
              パーミッションは「テキスト形式」（例：rwxr-xr-x）と「数値形式」（例：755）の2つの方法で表現できます。
              このツールでは、両形式の間で簡単に変換することができます。
            </Typography>
            
            <Box sx={{ bgcolor: "primary.light", color: "white", p: 2, borderRadius: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
                数値形式の意味
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: "white" }}>
                数値形式では、各権限に数値を割り当てています：
              </Typography>
              <Grid container spacing={2} sx={{ color: "white" }}>
                <Grid item xs={4}>
                  <Box sx={{ p: 1, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 1, textAlign: "center" }}>
                    <Typography variant="body2">読み取り（r）: 4</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ p: 1, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 1, textAlign: "center" }}>
                    <Typography variant="body2">書き込み（w）: 2</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ p: 1, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 1, textAlign: "center" }}>
                    <Typography variant="body2">実行（x）: 1</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Typography variant="body2" sx={{ mt: 1, color: "white" }}>
                これらの値を足し合わせて、各カテゴリの権限を表します。例えば「7」は「rwx」（4+2+1）を意味します。
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              よく使われるパーミッション例
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                  <Typography variant="subtitle2" color="primary">755 (rwxr-xr-x)</Typography>
                  <Typography variant="body2">実行可能なプログラムやスクリプト、ディレクトリに一般的</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                  <Typography variant="subtitle2" color="primary">644 (rw-r--r--)</Typography>
                  <Typography variant="body2">一般的なファイル（テキストファイルなど）に一般的</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                  <Typography variant="subtitle2" color="primary">600 (rw-------)</Typography>
                  <Typography variant="body2">所有者のみがアクセスできる機密ファイル</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                  <Typography variant="subtitle2" color="primary">777 (rwxrwxrwx)</Typography>
                  <Typography variant="body2">全ユーザーが全権限を持つ（セキュリティ上注意が必要）</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* パーミッション変換機能 */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 4,
              borderLeft: `4px solid ${theme.palette.secondary.main}`,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: 6,
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <SwapHorizIcon color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h5" color="secondary" fontWeight="medium">
                パーミッション変換
              </Typography>
            </Box>
            
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
                placeholder={conversionType === "textToNumeric" ? "例: rwxr-xr-x" : "例: 755"}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
                fullWidth
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
                  sx={{ borderRadius: 2 }}
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
                color="secondary"
                size="large"
                startIcon={<SwapHorizIcon />}
                sx={{ 
                  mt: 1,
                  py: 1.2,
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4
                  }
                }}
              >
                変換する
              </Button>
            </Box>
            
            {outputPermissionUpper && (
              <Box 
                sx={{ 
                  mt: 4, 
                  p: 2, 
                  bgcolor: "background.default", 
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider"
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" color="text.primary">変換結果:</Typography>
                  <Tooltip title="クリップボードにコピー">
                    <IconButton 
                      size="small" 
                      onClick={() => copyToClipboard(outputPermissionUpper)}
                      color="primary"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center",
                    p: 2,
                    bgcolor: "secondary.light",
                    color: "white",
                    borderRadius: 1.5,
                    fontFamily: "monospace",
                    fontSize: "1.2rem",
                    fontWeight: "bold"
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                  {outputPermissionUpper}
                </Box>
              </Box>
            )}
          </Paper>

          {/* チェックボックス機能 */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 4,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: 6,
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <SecurityIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" color="primary" fontWeight="medium">
                チェックボックスでパーミッション設定
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {["owner", "group", "public"].map((section, index) => (
                <Grid item xs={12} md={4} key={section}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: "background.default", 
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      height: "100%"
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: "bold",
                        color: index === 0 ? "primary.main" : index === 1 ? "secondary.main" : "text.primary"
                      }}
                    >
                      {section === "owner" ? "所有者 (Owner)" : 
                       section === "group" ? "グループ (Group)" : "その他 (Public)"}:
                    </Typography>
                    <FormGroup>
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
                              color={index === 0 ? "primary" : index === 1 ? "secondary" : "default"}
                            />
                          }
                          label={
                            <Typography variant="body2">
                              {permission === "read" ? "読み取り (Read)" : 
                               permission === "write" ? "書き込み (Write)" : "実行 (Execute)"}
                            </Typography>
                          }
                        />
                      ))}
                    </FormGroup>
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            <Box 
              sx={{ 
                mt: 4, 
                p: 3, 
                bgcolor: "primary.light", 
                color: "white",
                borderRadius: 2
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "white" }}>現在のパーミッション設定:</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: "rgba(255,255,255,0.1)", 
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Typography variant="body1" sx={{ color: "white" }}>
                      数値:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: "monospace", 
                          fontWeight: "bold",
                          color: "white"
                        }}
                      >
                        {inputPermissionLower}
                      </Typography>
                      <Tooltip title="クリップボードにコピー">
                        <IconButton 
                          size="small" 
                          onClick={() => copyToClipboard(inputPermissionLower)}
                          sx={{ color: "white", ml: 1 }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: "rgba(255,255,255,0.1)", 
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Typography variant="body1" sx={{ color: "white" }}>
                      テキスト:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: "monospace", 
                          fontWeight: "bold",
                          color: "white"
                        }}
                      >
                        {outputTextLower}
                      </Typography>
                      <Tooltip title="クリップボードにコピー">
                        <IconButton 
                          size="small" 
                          onClick={() => copyToClipboard(outputTextLower)}
                          sx={{ color: "white", ml: 1 }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
      
          {/* 使用方法ガイド */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              borderLeft: `4px solid ${theme.palette.secondary.main}`,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: 6,
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <InfoIcon color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h5" color="secondary" fontWeight="medium">
                使用方法
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: "background.default", 
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    height: "100%"
                  }}
                >
                  <Typography variant="subtitle1" color="secondary" fontWeight="bold" gutterBottom>
                    上部の変換ツール
                  </Typography>
                  <Typography variant="body2">
                    テキスト形式（rwxr-xr-x）と数値形式（755）の間で変換できます。
                    変換タイプを選択し、入力フィールドにパーミッションを入力して「変換」ボタンをクリックしてください。
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: "background.default", 
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    height: "100%"
                  }}
                >
                  <Typography variant="subtitle1" color="secondary" fontWeight="bold" gutterBottom>
                    下部のチェックボックスツール
                  </Typography>
                  <Typography variant="body2">
                    チェックボックスを使って視覚的にパーミッションを設定できます。
                    各カテゴリ（owner、group、public）に対して、読み取り、書き込み、実行の権限を切り替えることができます。
                    設定に応じて、テキスト形式と数値形式の両方が自動的に表示されます。
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
        
        {/* 右側の広告スペース */}
        <Box
          sx={{
            width: { xs: 0, md: "15%" },
            display: { xs: "none", md: "block" },
            bgcolor: "background.default",
          }}
        >
          {/* 広告コンテンツがここに入ります */}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PermissionConverter;
