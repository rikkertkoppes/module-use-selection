import React from "react";
import globalHook, { Store } from "use-global-hook";

type Selection = Record<string, boolean>;
interface SelectionState {
    [key: string]: Selection;
}

interface SelectionActions {
    select: (
        selectionKey: string,
        itemKeys: string[],
        multiple?: boolean
    ) => void;
}

const initialState = {};

const actions = {
    select: (
        store: Store<SelectionState, SelectionActions>,
        selectionKey: string,
        itemKeys: string[],
        multiple?: boolean
    ) => {
        let state = store.state[selectionKey] || {};
        let selection = multiple ? { ...state } : {};
        itemKeys.forEach((key) => (selection[key] = !state[key]));
        store.setState({ ...store.state, [selectionKey]: selection });
    },
};

const useGlobal = globalHook<SelectionState, SelectionActions>(
    React,
    initialState,
    actions
);

export const useSelectionItem = (selectionKey: string, itemKey: string) => {
    let [selected, actions] = useGlobal(
        (state: SelectionState) => !!(state[selectionKey] || {})[itemKey]
    );
    let select = (multiple?: boolean) => {
        actions.select(selectionKey, [itemKey], multiple);
    };
    let clear = () => {
        actions.select(selectionKey, []);
    };

    return { selected, select, clear };
};

export const useSelection = (selectionKey: string) => {
    let [state, actions] = useGlobal(
        (state: SelectionState) => state[selectionKey] || {}
    );

    let items = Object.keys(state).filter((key) => !!state[key]);

    let selected = (itemKey: string) => {
        return !!state[itemKey];
    };

    let select = (itemKeys: string[], multiple?: boolean) => {
        actions.select(selectionKey, itemKeys, multiple);
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
