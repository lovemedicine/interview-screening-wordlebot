import { Button, CircularProgress } from "@mui/material";

type Props = {
    loading: boolean;
    disabled: boolean;
    onClick: (...args: any) => any;
};

export default function SubmitButton({ loading, disabled, onClick }: Props) {
    return (
        <div style={{ marginTop: "1rem" }}>
            <Button
                variant="contained"
                disabled={disabled}
                onClick={onClick}
                sx={{ marginLeft: "2.7rem" }}
            >
                Submit
            </Button>
            <CircularProgress
                size="1.3rem"
                sx={{
                    ml: 1.5,
                    position: "relative",
                    top: "5px",
                    visibility: loading ? "visible" : "hidden",
                }}
            />
        </div>
    );
}
