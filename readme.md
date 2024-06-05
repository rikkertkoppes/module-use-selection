# use-selection

# usage

use `useSelection` to store selections

```
npm install @rkmodules/use-selection
```

```typescript
// pick what you need, more info below
import useSelection, {
    useSelectionItem,
    useSelect,
    useSelectionState,
} from "@rkmodules/use-selection";
```

## useSelection

```typescript
let { selected, select, items, clear } = useSelection(selectionKey: string, persist?: boolean);
```

-   `select(itemKeys: string[], multiple?: boolean)`:
    -   when `multiple` is `false` and all items are already selected, they are deselected
    -   when `multiple` is `false` otherwise, sets the selection to the given items
    -   when `multiple` is `true` and all items are already selected, they are deselected
    -   when `multiple` is `true` otherwise, all are added to the selection
-   `selected(itemKey: string)`: checks whether an item is selected
-   `clear()`: clears the selection
-   `items`: the items in the selection

## useSelectionItem

```typescript
let { selected, select, clear } = useSelectionItem(selectionKey: string, itemKey: string, perist?: boolean);
```

-   `select(multiple?: boolean)`:
    -   when `multiple` is `false`, the item is toggled as the only item in the selection
    -   when `multiple` is `true` the item is added or removed from the selection
-   `selected()`: checks whether the item is selected
-   `clear()`: clears the selection

## useSelect

```typescript
let { select, clear } = useSelection(selectionKey: string, persist?: boolean);
```

-   `select(itemKeys: string[], multiple?: boolean)`:
    -   when `multiple` is `false` and all items are already selected, they are deselected
    -   when `multiple` is `false` otherwise, sets the selection to the given items
    -   when `multiple` is `true` and all items are already selected, they are deselected
    -   when `multiple` is `true` otherwise, all are added to the selection
-   `clear()`: clears the selection

# examples

use `useSelection` to handle an entire selection as a whole

```tsx
const TableBody = () => {
    // "rows" is the key for the selection, to be able to have multiple selections
    let { selected, select, items, clear } = useSelection("rows");
    let rows = ["a", "b", "c"];

    return (
        <table>
            {rows.map((item) => {
                return (
                    <tr
                        key={item}
                        className={selected(item) ? "selected" : ""}
                        onClick={(e) => select([item], e.ctrlKey)}
                    >
                        <td>{item}</td>
                    </tr>
                );
            })}
        </table>
    );
};
```

use `useSelectionItem` in the context of a single item

```tsx
const TableRow = ({ rowId }) => {
    // "rows" is the key for the selection, to be able to have multiple selections
    // rowId is the key for the item
    let { selected, select, clear } = useSelectionItem("rows", rowId);

    return (
        <tr
            className={selected ? "selected" : ""}
            onClick={(e) => select(e.ctrlKey)}
        >
            <td>{rowId}</td>
        </tr>
    );
};
```

use `useSelect` to only get `select` and clear `methods`, these do not update when the selection changes, preventing rerenders

use `useSelectionState` to get access to the underlying state, which gives you access to the same `select`, `clear` and `items` members that `useSelection` and `useSelect` expose. Also, you have access to the raw `getSelection` and `setSelection` methods that operate on the selection, which is a dictionary containing boolean values for all items

# project setup

followed https://www.twilio.com/blog/2017/06/writing-a-node-module-in-typescript.html for project setup

# development

tests: `npm test`
publish: `npm publish`
