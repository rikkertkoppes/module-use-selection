import React from "react";
import globalHook, { Store } from "use-global-hook";

type Selection = Record<string, boolean>;
interface SelectionState {
    [key: string]: Selection;
}

interface SelectionActions {
    setSelection: (name: string, selection: Selection) => void;
}

const initialState = {};

const actions = {
    setSelection: (
        store: Store<SelectionState, SelectionActions>,
        name: string,
        selection: Selection
    ) => {
        store.setState({ ...store.state, [name]: selection });
    },
};

const useGlobal = globalHook<SelectionState, SelectionActions>(
    React,
    initialState,
    actions
);

export const useSelection = (selectionKey: string) => {
    let [state, actions] = useGlobal(
        (state: SelectionState) => state[selectionKey] || {}
    );

    let items = Object.keys(state).filter((key) => !!state[key]);

    let selected = (itemKey: string) => {
        return !!state[itemKey];
    };

    let select = (itemKeys: string[], multiple?: boolean) => {
        let selection: Selection = {};
        itemKeys.forEach((key) => (selection[key] = !state[key]));
        if (!multiple) {
            // replace selection
            actions.setSelection(selectionKey, selection);
        } else {
            // augment selection
            actions.setSelection(selectionKey, { ...state, ...selection });
        }
    };

    let clear = () => {
        return select([]);
    };

    return {
        items,
        selected,
        select,
        clear,
    };
};

export default useSelection;
