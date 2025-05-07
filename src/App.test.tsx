import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "./TimeTracker";

it("renders headline", () => {
    render(<App />);
    const title = screen.getByText("Hello World!");
    expect(title).toBeInTheDocument();
});
