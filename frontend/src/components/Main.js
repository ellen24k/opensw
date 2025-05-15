import { Stack } from "@mui/material";

function Main({ children, spacing }) {
    return (
        <Stack spacing={spacing}>
            {children}
        </Stack>
    )
}

export default Main;