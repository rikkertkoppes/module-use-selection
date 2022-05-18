import React from "react";
import create from "zustand";

type Selection = Record<string, boolean>;

const emptySelection = {};
interface SelectionState {
    selections: {
        [key: string]: Selection;
    };
    getSelection: (selectionKey: string) => Selection;
    select: (
        selectionKey: string,
        itemKeys: string[],
        multiple?: boolean
    ) => void;
    clear: (selectionKey: string) => void;
    items: (selectionKey: string) => string[];
}

export const useSelectionState = create<SelectionState>((set, get) => ({
    selections: {},
    getSelection: (selectionKey: string) => {
        let selections = get().selections;
        if (selections[selectionKey]) return selections[selectionKey];
        return emptySelection;
    },
    select: (selectionKey: string, itemKeys: string[], multiple?: boolean) => {
        /**
         * when multiple is off
         * -> select only everything that was clicked, disregarding the old selection
         * -> when item was selected, deselect
         * when multiple is on
         * -> if all items already selected, deselect them from the selection
         * -> otherwise, add them to the selection
         */
        let selections = get().selections;
        let sel = selections[selectionKey] || {};
        let allSelected = itemKeys.every((key) => sel[key]);
        // if multiple is on start new selection with existing selection
        // otherwise empty
        let selection = multiple ? { ...sel } : {};
        // for the given items, unselect if allSelected
        // otherwise add to the selection
        itemKeys.forEach((key) => (selection[key] = !allSelected));
        set({ selections: { ...selections, [selectionKey]: selection } });
    },
    clear: (selectionKey: string) => {
        return get().select(selectionKey, []);
    },
    items: (selectionKey: string) => {
        let selections = get().selections;
        let sel = selections[selectionKey] || {};
        return Object.keys(sel).filter((key) => sel[key]);
    },
}));

export const useSelectionItem = (selectionKey: string, itemKey: string) => {
    let selected = useSelectionState(
        ({ getSelection }: SelectionState) =>
            !!getSelection(selectionKey)[itemKey]
    );
    let selectItem = useSelectionState(({ select }: SelectionState) => select);
    let select = React.useCallback(
        (multiple?: boolean) => {
            selectItem(selectionKey, [itemKey], multiple);
        },
        [selectionKey, selectItem]
    );
    let clear = React.useCallback(() => {
        selectItem(selectionKey, []);
    }, [selectionKey, selectItem]);

    return { selected, select, clear };
};

export const useSelect = (selectionKey: string) => {
    let selectItem = useSelectionState(({ select }: SelectionState) => select);

    let select = React.useCallback(
        (itemKeys: string[], multiple?: boolean) => {
            selectItem(selectionKey, itemKeys, multiple);
        },
        [selectionKey, selectItem]
    );
    let clear = React.useCallback(() => {
        selectItem(selectionKey, []);
    }, [selectionKey, selectItem]);

    return {
        select,
        clear,
    };
};

export const useSelection = (selectionKey: string) => {
    let selection = useSelectionState(({ getSelection }: SelectionState) =>
        getSelection(selectionKey)
    );
    let selectItem = useSelectionState(({ select }: SelectionState) => select);

    let items = Object.keys(selection).filter((key) => !!selection[key]);

    let selected = (itemKey: string) => {
        return !!selection[itemKey];
    };

    let select = React.useCallback(
        (itemKeys: string[], multiple?: boolean) => {
            selectItem(selectionKey, itemKeys, multiple);
        },
        [selectionKey, selectItem]
    );
    let clear = React.useCallback(() => {
        selectItem(selectionKey, []);
    }, [selectionKey, selectItem]);

    return {
        items,
        selected,
        select,
        clear,
    };
};

export default useSelection;
