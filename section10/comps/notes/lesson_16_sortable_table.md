# Section 16: Getting Clever with Data Sorting (Toàn bộ Bài 262 - 281)

## 📌 Bức tranh tổng quan (Kiến trúc Sắp xếp Dữ liệu trong React)
Trong Section này, chúng ta sẽ thêm tính năng **Sắp xếp (Sort)** dữ liệu khi người dùng bấm vào các tiêu đề cột (`<th>`). 

Bí thuật lớn nhất của Section này nằm ở **Design Pattern (Mẫu thiết kế)**:
* Chúng ta **KHÔNG THAY ĐỔI 1 DÒNG CODE NÀO** trong file `Table.jsx` cũ!
* Chúng ta áp dụng **Wrapper Component Pattern (Component bao bọc)**: Tạo một component mới có tên là `SortableTable.jsx` để quản lý toàn bộ State sắp xếp, sau đó truyền dữ liệu đã được sort xuống cho `Table.jsx` hiển thị.

---

## 📚 CHI TIẾT TỪNG BÀI HỌC (LÝ THUYẾT CHUYÊN SÂU & THỰC HÀNH)

---

### 📖 Lesson 262: Adding Sorting to the Table (Chu trình Sắp xếp)
* **Vấn đề**: Khi bấm liên tục vào tiêu đề 1 cột, chu trình sắp xếp sẽ xoay vòng qua 3 trạng thái:
  $$\text{Chưa sort (null)} \longrightarrow \text{Tăng dần ('asc')} \longrightarrow \text{Giảm dần ('desc')} \longrightarrow \text{Chưa sort (null)}$$
* **Nguyên tắc**: Khi sắp xếp, chúng ta di chuyển **toàn bộ dòng (`tr`)**, chứ không chỉ đổi chỗ các con số hay chữ cái đơn lẻ trong cột đó!

---

### 📖 Lesson 263, 264, 265 & 266: JavaScript Sort in Depth (Thuật toán Sắp xếp Chuỗi & Object)

#### ⚠️ Cạm bẫy của hàm `.sort()` mặc định trong JS:
1. **Biến đổi trực tiếp mảng gốc (Mutation)**: Hàm `array.sort()` làm thay đổi mảng ban đầu. Trong React, **TUYỆT ĐỐI KHÔNG MUTATE STATE**. Ta phải tạo mảng copy: `[...data].sort(...)`.
2. **So sánh mặc định ép về chuỗi**: `[10, 5, 40, 25].sort()` sẽ cho ra `[10, 25, 40, 5]` vì `'25' < '5'`.
3. **So sánh chuỗi chuẩn xác**: Phải dùng `a.localeCompare(b)` thay vì dấu `< >` để so sánh chữ cái đúng theo bảng chữ cái.

#### 💡 Thuật toán so sánh tổng quát cho Object (Lesson 266 & 267):
```javascript
// [LÝ THUYẾT - THUẬT TOÁN SORT TỔNG QUÁT]
const sortedData = [...data].sort((a, b) => {
    // 1. Gọi hàm sortValue từ config để lấy giá trị cần so sánh của 2 đối tượng
    const valueA = sortValue(a);
    const valueB = sortValue(b);

    // 2. Xác định chiều sắp xếp (asc: 1, desc: -1)
    const reverseOrder = sortOrder === 'asc' ? 1 : -1;

    // 3. Nếu là chuỗi -> Dùng localeCompare
    if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB) * reverseOrder;
    }

    // 4. Nếu là số -> Trừ trực tiếp
    return (valueA - valueB) * reverseOrder;
});
```

---

### 📖 Lesson 268 & 269: Optional Sorting & Customizing Header Cells (Cột có Sort / Cột không Sort)
* Không phải cột nào cũng sắp xếp được (ví dụ: Cột Ô Màu `Color` không có ý nghĩa để sắp xếp).
* Trong mảng `config`:
  * Cột nào có thêm thuộc tính `sortValue`: Là cột **có thể sắp xếp được** (hiển thị icon mũi tên và cho bấm).
  * Cột nào **không có** `sortValue`: Là cột bình thường (không có icon, click không làm gì).

---

### 📖 Lesson 270 & 271: React Fragments (`<React.Fragment>` / `<>...</>`)
* **Vấn đề**: Khi bọc tiêu đề `<th>` với icon mũi tên, ta muốn gộp 2 phần tử lại nhưng thẻ `<th>` không được chứa thẻ `<div>` lồng vào giữa.
* **Giải pháp**: Dùng `<React.Fragment key={column.label}>` (hoặc cú pháp viết tắt `<>...</>`). Fragment giúp nhóm nhiều phần tử JSX mà **KHÔNG TẠO RA BẤT KỲ THẺ HTML THỰC TẾ NÀO TRÊN DOM**.

---

### 📖 Lesson 272 - 277: Adding `SortableTable` (Wrapper Component Pattern)
* **TẠI SAO DÙNG `SortableTable.jsx`?**:
  * `Table.jsx` giữ vai trò là component "ngu ngốc" (Dumb presentation component): Chỉ biết nhận dữ liệu và vẽ ra bảng HTML.
  * `SortableTable.jsx` đóng vai trò "thông minh" (Smart container component): Nắm giữ State `sortBy` và `sortOrder`, tính toán mảng `sortedData`, chèn icon vào tiêu đề rồi truyền xuống cho `Table.jsx`.

#### 🧠 State Design trong `SortableTable`:
1. `sortBy`: Tên cột đang được sort (ví dụ: `'Name'`, `'Score'`, hoặc `null`).
2. `sortOrder`: Trạng thái sort (`'asc'`, `'desc'`, hoặc `null`).

---

### 📖 Lesson 278, 279 & 280: Icons & Header Styling (Hiển thị Icon mũi tên)
* Sử dụng 2 icon từ `react-icons/go`: `GoTriangleUp` và `GoTriangleDown`.
* **Cơ chế hiển thị Icon**:
  * Nếu cột chưa sort hoặc `sortOrder === null`: Hiện cả 2 mũi tên mờ (hoặc ẩn).
  * Nếu `sortOrder === 'asc'`: Chỉ hiện mũi tên chỉ LÊN ($\Delta$).
  * Nếu `sortOrder === 'desc'`: Chỉ hiện mũi tên chỉ XUỐNG ($\nabla$).

---

## 🛠️ [CODE CHÍNH THỨC VÀO DỰ ÁN] (HƯỚNG DẪN 3 BƯỚC)

---

### BƯỚC 1: Tạo Component `SortableTable.jsx` (Bài 272 - 280)
* **File tạo mới**: `src/components/SortableTable.jsx`

```javascript
// src/components/SortableTable.jsx
import { useState } from 'react';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import Table from './Table';

function SortableTable(props) {
    // 1. State lưu tên cột đang được sort (null, 'Name', 'Score')
    const [sortBy, setSortBy] = useState(null);
    // 2. State lưu chiều sort (null, 'asc', 'desc')
    const [sortOrder, setSortOrder] = useState(null);

    const { config, data } = props;

    // Handler xử lý khi click vào tiêu đề cột
    const handleClick = (label) => {
        // Nếu chuyển sang click một cột khác -> Tự động đưa về 'asc' cho cột mới
        if (sortBy && label !== sortBy) {
            setSortOrder('asc');
            setSortBy(label);
            return;
        }

        // Xoay vòng chu trình sort: null -> asc -> desc -> null
        if (sortOrder === null) {
            setSortOrder('asc');
            setSortBy(label);
        } else if (sortOrder === 'asc') {
            setSortOrder('desc');
            setSortBy(label);
        } else if (sortOrder === 'desc') {
            setSortOrder(null);
            setSortBy(null);
        }
    };

    // 3. Cập nhật mảng config: Thêm hàm header tùy biến cho các cột có sortValue
    const updatedConfig = config.map((column) => {
        // Nếu cột không có sortValue -> Giữ nguyên cột đó
        if (!column.sortValue) {
            return column;
        }

        // Nếu cột có sortValue -> Thêm hàm header để biến <th> thành nút bấm có Icon
        return {
            ...column,
            header: () => (
                <th
                    className="cursor-pointer hover:bg-gray-100 p-2"
                    onClick={() => handleClick(column.label)}
                >
                    <div className="flex items-center">
                        {getIcons(column.label, sortBy, sortOrder)}
                        {column.label}
                    </div>
                </th>
            )
        };
    });

    // 4. Tính toán dữ liệu đã được Sắp xếp (sortedData)
    let sortedData = data;
    if (sortOrder && sortBy) {
        // Tìm ra cột đang được sort dựa vào sortBy
        const { sortValue } = config.find((column) => column.label === sortBy);

        // Copy mảng data và tiến hành sort
        sortedData = [...data].sort((a, b) => {
            const valueA = sortValue(a);
            const valueB = sortValue(b);

            const reverseOrder = sortOrder === 'asc' ? 1 : -1;

            if (typeof valueA === 'string') {
                return valueA.localeCompare(valueB) * reverseOrder;
            } else {
                return (valueA - valueB) * reverseOrder;
            }
        });
    }

    // 5. Truyền dữ liệu đã sort và config đã cập nhật xuống cho Table gốc hiển thị
    return <Table {...props} data={sortedData} config={updatedConfig} />;
}

// Hàm phụ trợ tạo Icon mũi tên theo trạng thái
function getIcons(label, sortBy, sortOrder) {
    // Nếu cột này không phải cột đang sort -> Hiện cả 2 mũi tên
    if (label !== sortBy) {
        return (
            <div>
                <GoTriangleUp />
                <GoTriangleDown />
            </div>
        );
    }

    if (sortOrder === null) {
        return (
            <div>
                <GoTriangleUp />
                <GoTriangleDown />
            </div>
        );
    } else if (sortOrder === 'asc') {
        return (
            <div>
                <GoTriangleUp />
            </div>
        );
    } else if (sortOrder === 'desc') {
        return (
            <div>
                <GoTriangleDown />
            </div>
        );
    }
}

export default SortableTable;
```

---

### BƯỚC 2: Cập nhật `Table.jsx` hỗ trợ Custom Header (Bài 270)
* **File sửa**: `src/components/Table.jsx` (Chỉ thêm 3 dòng hỗ trợ render `column.header` nếu có, dùng `Fragment`):

```javascript
// src/components/Table.jsx
import { Fragment } from 'react'; // Import Fragment

function Table({ data, config, keyFn }) {
    const renderedHeaders = config.map((column) => {
        // Nếu cột có hàm header tùy biến từ SortableTable -> Gọi hàm header()
        if (column.header) {
            return <Fragment key={column.label}>{column.header()}</Fragment>;
        }

        // Mặc định render <th> thường
        return (
            <th key={column.label} className="p-2">
                {column.label}
            </th>
        );
    });

    const renderedRows = data.map((rowData) => {
        const renderedCells = config.map((column) => {
            return (
                <td key={column.label} className="p-3">
                    {column.render(rowData)}
                </td>
            );
        });

        return (
            <tr key={keyFn(rowData)} className="border-b">
                {renderedCells}
            </tr>
        );
    });

    return (
        <table className="table-auto border-spacing-2">
            <thead>
                <tr className="border-b-2">
                    {renderedHeaders}
                </tr>
            </thead>
            <tbody>
                {renderedRows}
            </tbody>
        </table>
    );
}

export default Table;
```

---

### BƯỚC 3: Cập nhật `TablePage.jsx` thêm `sortValue` & dùng `<SortableTable />` (Bài 268, 273)
* **File sửa**: `src/pages/TablePage.jsx` (hoặc `src/page/TablePage.jsx`):

```javascript
// src/pages/TablePage.jsx
// Đổi import Table thành SortableTable
import SortableTable from '../components/SortableTable';

function TablePage() {
    const data = [
        { name: 'Orange', color: 'bg-orange-500', score: 5 },
        { name: 'Apple', color: 'bg-red-500', score: 3 },
        { name: 'Banana', color: 'bg-yellow-500', score: 1 },
        { name: 'Lime', color: 'bg-green-500', score: 4 }
    ];

    const config = [
        {
            label: 'Name',
            render: (fruit) => fruit.name,
            // Thêm sortValue cho cột Name -> Bật tính năng Sort theo tên
            sortValue: (fruit) => fruit.name
        },
        {
            label: 'Color',
            render: (fruit) => <div className={`p-3 m-2 ${fruit.color}`} />
            // Cột Color KHÔNG có sortValue -> Không thể sắp xếp
        },
        {
            label: 'Score',
            render: (fruit) => fruit.score,
            // Thêm sortValue cho cột Score -> Bật tính năng Sort theo điểm
            sortValue: (fruit) => fruit.score
        }
    ];

    const keyFn = (fruit) => {
        return fruit.name;
    };

    return (
        <div>
            {/* Sử dụng SortableTable thay cho Table */}
            <SortableTable data={data} config={config} keyFn={keyFn} />
        </div>
    );
}

export default TablePage;
```

---

## 🎯 TỔNG KẾT TƯ TƯỞNG CỐT LÕI SECTION 16
1. **Wrapper Component Pattern**: `SortableTable` bọc lấy `Table`. `Table` vẫn giữ nguyên nhiệm vụ vẽ bảng thuần túy, còn `SortableTable` xử lý toàn bộ logic sắp xếp.
2. **Thuộc tính `sortValue`**: Khai báo ở mảng `config` trong `TablePage`. Cột nào có `sortValue` thì mới sắp xếp được.
3. **`React.Fragment`**: Giúp gộp phần tử JSX mà không chèn thêm thẻ HTML thừa làm hỏng cấu trúc bảng.
4. **Chu trình Sort**: `null` $\to$ `'asc'` $\to$ `'desc'` $\to$ `null`.
