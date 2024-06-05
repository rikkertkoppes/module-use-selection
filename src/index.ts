import React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Selection = Record<string, boolean>;

const emptySelection = {};
interface SelectionState {
    selections: {
        [key: string]: Selection;
    };
    getSelection: (selectionKey: string, persist?: boolean) => Selection;
    setSelection: (
        selectionKey: string,
        selection: Selection,
        persist?: boolean
    ) => void;
    select: (
        selectionKey: string,
        itemKeys: string[],
        multiple?: boolean,
        persist?: boolean
    ) => void;
    clear: (selectionKey: string, persist?: boolean) => void;
    items: (selectionKey: string, persist?: boolean) => string[];
}

export const useSelectionStateOld = create<SelectionState>((set, get) => ({
    selections: {},
    getSelection: (selectionKey: string) => {
        let selections = get().selections;
        if (selections[selectionKey]) return selections[selectionKey];
        return emptySelection;
    },
    setSelection: (selectionKey: string, selection: Selection) => {
        set({ selections: { ...get().selections, [selectionKey]: selection } });
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

export const useSelectionState = create<SelectionState>((set, get, store) =>
    persist<SelectionState>(
        (pset, pget) => {
            let access = (persist: boolean) => {
                if (persist) return { get: pget, set: pset };
                return { get, set };
            };
            return {
                selections: {},
                getSelection: (selectionKey: string, persist = false) => {
                    let { get } = access(persist);
                    let selections = get().selections;
                    if (selections[selectionKey])
                        return selections[selectionKey];
                    return emptySelection;
                },
                setSelection: (
                    selectionKey: string,
                    selection: Selection,
                    persist = false
                ) => {
                    let { get, set } = access(persist);
                    set({
                        selections: {
                            ...get().selections,
                            [selectionKey]: selection,
                        },
                    });
                },
                select: (
                    selectionKey: string,
                    itemKeys: string[],
                    multiple?: boolean,
                    persist = false
                ) => {
                    let { get, set } = access(persist);
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
                    set({
                        selections: {
                            ...selections,
                            [selectionKey]: selection,
                        },
                    });
                },
                clear: (selectionKey: string, persist = false) => {
                    let { get } = access(persist);
                    return get().select(selectionKey, [], persist);
                },
                items: (selectionKey: string, persist = false) => {
                    let { get } = access(persist);
                    let selections = get().selections;
                    let sel = selections[selectionKey] || {};
                    return Object.keys(sel).filter((key) => sel[key]);
                },
            };
        },
        { name: "selection-storage" }
    )(set, get, store)
);

export const useSelectionItem = (
    selectionKey: string,
    itemKey: string,
    persist = false
) => {
    let selected = useSelectionState(
        ({ getSelection }: SelectionState) =>
            !!getSelection(selectionKey, persist)[itemKey]
    );
    let selectItem = useSelectionState(({ select }: SelectionState) => select);
    let select = React.useCallback(
        (multiple?: boolean) => {
            selectItem(selectionKey, [itemKey], multiple, persist);
        },
        [selectionKey, selectItem]
    );
    let clear = React.useCallback(() => {
        selectItem(selectionKey, [], false, persist);
    }, [selectionKey, selectItem]);

    return { selected, select, clear };
};

export const useSelect = (selectionKey: string, persist = false) => {
    let selectItem = useSelectionState(({ select }: SelectionState) => select);

    let select = React.useCallback(
        (itemKeys: string[], multiple?: boolean) => {
            selectItem(selectionKey, itemKeys, multiple, persist);
        },
        [selectionKey, selectItem]
    );
    let clear = React.useCallback(() => {
        selectItem(selectionKey, [], false, persist);
    }, [selectionKey, selectItem]);

    return {
        select,
        clear,
    };
};

export const useSelection = (selectionKey: string, persist = false) => {
    let selection = useSelectionState(({ getSelection }: SelectionState) =>
        getSelection(selectionKey, persist)
    );
    let selectItem = useSelectionState(({ select }: SelectionState) => select);

    let items = Object.keys(selection).filter((key) => !!selection[key]);

    let selected = (itemKey: string) => {
        return !!selection[itemKey];
    };

    let select = React.useCallback(
        (itemKeys: string[], multiple?: boolean) => {
            selectItem(selectionKey, itemKeys, multiple, persist);
        },
        [selectionKey, selectItem]
    );
    let clear = React.useCallback(() => {
        selectItem(selectionKey, [], false, persist);
    }, [selectionKey, selectItem]);

    return {
        items,
        selected,
        select,
        clear,
    };
};

export default useSelection;
