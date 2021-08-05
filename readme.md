# use-selection

# usage

use `useSelection` to store selections

```
npm install @rkmodules/use-selection
```

```typescript
import useSelection from "@rkmodules/use-selection";
```

# examples

use `useSelectionItem` in the context of a single item

```tsx
const TableRow = ({ rowId }) => {
    // "rows" is the key for the selection
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

# project setup

followed https://www.twilio.com/blog/2017/06/writing-a-node-module-in-typescript.html for project setup
