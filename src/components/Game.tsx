import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { WordleRequestItem, fetchWordleResult } from "../api/api";
import Guess from "./Guess";

const MAX_GUESSES = 6;
type GameStatus = "ongoing" | "win" | "lose" | "initializing" | "submitting" | "error";

export default function Game() {
    const [guesses, setGuesses] = useState<WordleRequestItem[]>([]);
    const [newGuess, setNewGuess] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function getNextGuess(request: WordleRequestItem[]) {
        setLoading(true);
        let success = false;

        try {
            const { guess } = await fetchWordleResult(request);
            setNewGuess(guess);
            success = true;
        } catch (err: any) {
            setError(String(err));
        }

        setLoading(false);
        return success;
    }

    useEffect(() => {
        getNextGuess([]);
    }, []);

    async function submitClue(clue: string) {
        setError(null);
        const allGuesses = [...guesses, { word: newGuess, clue }];

        if (clue !== "ggggg" && allGuesses.length < MAX_GUESSES) {
            const succeess = await getNextGuess(allGuesses);
            if (!succeess) return false;
        }

        setGuesses(allGuesses);
        return true;
    }

    const status: GameStatus =
        error ? "error"
        : newGuess === "" ? "initializing"
        : loading ? "submitting"
        : guesses.length && guesses[guesses.length - 1].clue === "ggggg" ? "win"
        : guesses.length === MAX_GUESSES ? "lose"
        : "ongoing";

    if (status === "initializing") return <CircularProgress />;

    return (
        <div>
            {guesses.map((request, index) => (
                <Guess
                    key={index}
                    number={index + 1}
                    guess={request.word}
                    submittedClue={request.clue}
                    loading={false}
                ></Guess>
            ))}
            {["ongoing", "error", "submitting"].includes(status) && (
                <Guess
                    number={guesses.length + 1}
                    guess={newGuess}
                    loading={loading}
                    submitClue={submitClue}
                ></Guess>
            )}
            {["win", "lose"].includes(status) && (
                <div style={{ fontSize: "2rem", marginTop: "2rem" }}>
                    <strong>You {status}!</strong>
                </div>
            )}
            {status === "error" && error && (
                <div style={{ marginTop: "2rem", fontSize: "2rem", color: "red" }}>{error}</div>
            )}
        </div>
    );
}
