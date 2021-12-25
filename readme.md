# use-selection

# usage

use `useSelection` to store selections

```
npm install @rkmodules/use-selection
```

```typescript
import useSelection from "@rkmodules/use-selection";
```

# behaviour

When the multiple flag is off, the items passed into `select` are selected. Everything else is deselected. So it disregards any existing selection

When the multiple flag is on, the bahaviour is twofold:

-   when all items passed into `select` are already selected, they are subtracted from the existing selection
-   otherwise, they are added to the existing selection

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

# project setup

followed https://www.twilio.com/blog/2017/06/writing-a-node-module-in-typescript.html for project setup
