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
        return get().selections[selectionKey] || emptySelection;
    },
    select: (selectionKey: string, itemKeys: string[], multiple?: boolean) => {
        let selections = get().selections;
        let sel = selections[selectionKey] || {};
        let selection = multiple ? { ...sel } : {};
        itemKeys.forEach((key) => (selection[key] = !sel[key]));
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
    let select = (multiple?: boolean) => {
        selectItem(selectionKey, [itemKey], multiple);
    };
    let clear = () => {
        selectItem(selectionKey, []);
    };

    return { selected, select, clear };
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

    let select = (itemKeys: string[], multiple?: boolean) => {
        selectItem(selectionKey, itemKeys, multiple);
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
