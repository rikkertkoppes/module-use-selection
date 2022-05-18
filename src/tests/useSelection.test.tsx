/**
 * @jest-environment jsdom
 */

import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import useSelection, { useSelectionState } from "..";

function TestComponent() {
    let selection = useSelection("foo");
    return (
        <div data-testid="testcomponent">
            {selection.items}
            <div
                data-testid="sel1"
                onClick={(e) => selection.select(["one"], e.ctrlKey)}
            />
            <div
                data-testid="sel2"
                onClick={(e) => selection.select(["two"], e.ctrlKey)}
            />
            <div
                data-testid="sel3"
                onClick={(e) => selection.select(["three"], e.ctrlKey)}
            />
        </div>
    );
}

describe("useSelection", () => {
    beforeEach(() => {
        useSelectionState.getState().clear("foo");
    });
    test("initial state should be empty", () => {
        let { getByTestId } = render(<TestComponent />);
        let div = getByTestId("testcomponent");
        expect(div.textContent).toBe("");
    });
    test("should select none after clicking two times", () => {
        let { getByTestId } = render(<TestComponent />);
        let div = getByTestId("testcomponent");
        getByTestId("sel1").click();
        getByTestId("sel1").click();
        expect(div.textContent).toBe("");
    });
    test("should select one by clicking it", () => {
        let { getByTestId } = render(<TestComponent />);
        let div = getByTestId("testcomponent");
        getByTestId("sel1").click();
        expect(div.textContent).toBe("one");
    });
    test("should select two after 2nd click", () => {
        let { getByTestId } = render(<TestComponent />);
        let div = getByTestId("testcomponent");
        getByTestId("sel1").click();
        getByTestId("sel2").click();
        expect(div.textContent).toBe("two");
    });
    test("should select one and two when using multiple", () => {
        let { getByTestId } = render(<TestComponent />);
        let div = getByTestId("testcomponent");
        userEvent.click(getByTestId("sel1"));
        userEvent.click(getByTestId("sel2"), { ctrlKey: true });
        expect(div.textContent).toBe("onetwo");
    });
    test("should have access to the selection", () => {
        let { getByTestId } = render(<TestComponent />);
        userEvent.click(getByTestId("sel1"));
        userEvent.click(getByTestId("sel2"), { ctrlKey: true });
        expect(useSelectionState.getState().items("foo")).toEqual([
            "one",
            "two",
        ]);
    });
});
