import { useState } from "react";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import useGameStore from "../zustandStore/store";

export const PersonalProfile = () => {
    const {
    name,
    setName,
    configPicked,
    setConfigPicked,
    loadDefaultConfig,
    loadCustomConfig
  } = useGameStore();
  const [nameValue, setNameValue] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#28262c",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        key={"formWrapper"}
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#2a4849",
          width: "600px",
          height: "600px",
          borderRadius: "24px",
        }}
      >
        <Box m={4} sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar sx={{ width: "120px", height: "120px", fontSize: "38px" }}>
            {"P"}
          </Avatar>
        </Box>
        <Box
          m={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            m={2}
            sx={{ color: "#b5ca8d", fontWeight: "600", fontSize: "24px" }}
          >
            {nameValue || "Enter your name"}
          </Typography>
          <Box>
            <TextField
              variant="outlined"
              sx={{
                // Цвет текста внутри input
                "& .MuiOutlinedInput-input": {
                  fontWeight: "600",
                  color: "#b5ca8d",
                },
                // Стили рамки (fieldset)
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8bb174",
                  borderWidth: 2,
                  borderRadius: "33px",
                },
                // Рамка при фокусе
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#8bb174",
                    borderWidth: 2,
                  },
              }}
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
          </Box>
          <Box>
            <Box
              mt={2}
              sx={{ display: "flex", gap: "10px", flexDirection: "row" }}
            >
              <Button variant="outlined" onClick={(e) => setConfigPicked(0)}>
                default config
              </Button>
              <Button variant="outlined" onClick={(e) => setConfigPicked(1)}>
                upload custom config
              </Button>
            </Box>
            <Typography
              m={2}
              sx={{ fontSize: "18px", color: "tomato", textAlign: "center" }}
            >
              You picked{" "}
              {configPicked === 0
                ? "default config"
                : configPicked === 1
                ? "custom config set"
                : "Please pick config"}
            </Typography>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Button
              sx={{
                height: "80px",
                fontSize: "24px",
                width: "100%",
                backgroundColor: "#f3a712",
                "&.Mui-disabled": {
                  backgroundColor: "grey",
                },
              }}
              disabled={!nameValue.length || configPicked === null}
              onClick={() => {
          setName(nameValue);
          if (configPicked === 0) loadDefaultConfig();
          if (configPicked === 1) loadCustomConfig();
        }}
            >
              Play
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
