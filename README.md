# Wordle Bot UI

A simple React app providing a UI for a Wordle Bot that offers word guesses based on clues received
from a Wordle game. Based on
[@interview-screening-wordlebot](https://github.com/venteur/interview-screening-wordlebot).

### How to Install

1. Clone this repo
2. Install dependencies

```
npm i
```

3. Start the dev server

```
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Automated Tests

To run several basic end-to-end tests in Cypress, make sure the dev server is working then run:

```
npm run e2e-test
```

### Application Design

Component structure:

-   App
    -   Layout
        -   Header
        -   Game
            -   Guess
                -   Letter
                -   SubmitButton

For expedience I opted to use `<div>`s and inline styles instead of MUI components and themes or an
alternative UI/CSS library, with the exception of `<Button />` and `<CircularProgress />`. Given
more time I'd use MUI components for layout and structure and/or Tailwind for styles.

I decided to render a single list of letters that displays the bot's guess and receives clue
entries. It makes for a more compact UI but probably requires more explanation in the UI than I've
provided.

Most of the state and interactivity is defined in the `<Game />` component. When the component first
loads, a new guess is fetched from the API and saved to the `newGuess` state along with a clue when
submitted by the user. The `guesses` state keeps a list of word/clue pairs already submitted. The
`error` state holds any errors returned by the API and `loading` keeps track of whether the UI is
waiting for an API response. There is also a derivative `status` state that tracks the progress of
the game through its various possible states
(`ongoing, win, lose, initializing, submitting, error`); it isn't strictly necessary but I found it
to lower the cognitive load and simplify the code to some extent, but there's still more complexity
here than I'd like.

The `<Guess />` component manages the display of all guesses (submitted or not) and the entering and
validation of clues. It contains a `clue` state that tracks the color of all the letters as they're
clicked. It also renders the submit button becauase validation and enabling/disabling of the button
requires access to the clue state. Clue validation is simple and given more time could be improved
to invalidate clues that contradict previous clues.

The `<Letter />` and `<Submit Button />` components are straightforward, rendering and handling
click events with handlers passed from above as props.
