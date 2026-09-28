# Section 17: Custom Hooks In Depth (Toàn bộ Bài 282 - 288)

## 📌 Bức tranh tổng quan (Custom Hook là gì & Tại sao cần?)
Trong React, để tái sử dụng **Giao diện (UI)**, ta tách thành các Component (như `Button`, `Panel`, `Table`). 
Nhưng nếu muốn tái sử dụng **Logic (State + Xử lý tính toán)** ở nhiều nơi khác nhau mà giao diện lại khác nhau (ví dụ: Sắp xếp bảng vs Sắp xếp thẻ Card), chúng ta dùng **Custom Hook**!

---

## 📚 CHI TIẾT TỪNG BÀI HỌC (LÝ THUYẾT CHUYÊN SÂU & THỰC HÀNH)

---

### 📖 Lesson 282: Exploring Code Reuse (Tái sử dụng Logic trong React)
* **Vấn đề**: Giả sử ứng dụng cần thêm 1 trang hiển thị Danh sách Nhà đất dạng Thẻ Card (`SortableList`). Giao diện thẻ Card hoàn toàn khác Bảng (`Table`), nhưng logic sắp xếp (`sortBy`, `sortOrder`, thuật toán `.sort()`) lại giống hệt 100%.
* **Giải pháp**: Tách toàn bộ logic sắp xếp ra khỏi `SortableTable.jsx` và đóng gói vào một Custom Hook gọi là `useSort`.

---

### 📖 Lesson 283 & 286: Revisiting Custom Hooks & Rules of Hooks (Định nghĩa & Quy tắc)
* **Custom Hook là gì?**: Là một hàm JavaScript tự định nghĩa chứa các logic tái sử dụng được, và **bắt buộc phải gọi ít nhất một React Hook có sẵn** (`useState`, `useEffect`, `useRef`, `useContext`...).
* **Quy tắc đặt tên (Rule of Hooks - Bài 286)**: Tên hàm Custom Hook **BẮT BUỘC PHẢI BẮT ĐẦU BẰNG TỪ `use`** (ví dụ: `useCounter`, `useSort`, `useNavigation`). Điều này giúp React linter nhận biết và kiểm tra quy tắc Hook cho bạn.
* **Nguyên tắc làm việc**: **Đừng bao giờ viết Custom Hook trước!** Luôn code tính năng hoàn chỉnh ngay bên trong Component trước. Sau khi code chạy đúng, ta mới tiến hành bóc tách ra Custom Hook.

---

### 📖 Lesson 284 & 285: Creating Demo `useCounter` (Ví dụ minh họa tính điểm)

#### 💡 [LÝ THUYẾT / VÍ DỤ MINH HỌA - HỌC CÁCH VIẾT USECOUNTER]
Giả sử ta có 1 hàm đếm số `useCounter`:

```javascript
// [VÍ DỤ DEMO - KHÔNG CẦN GÕ VÀO DỰ ÁN MAIN]
import { useState, useEffect } from 'react';

function useCounter(initialCount) {
    const [count, setCount] = useState(initialCount);

    useEffect(() => {
        console.log('Số đếm hiện tại:', count);
    }, [count]);

    const increment = () => {
        setCount(count + 1);
    };

    // Tra về Object chứa State và Hàm handler để Component bên ngoài sử dụng
    return {
        count: count,
        increment: increment
    };
}
```

---

### 📖 Lesson 287: Hook Creation Process in Depth (Công thức 6 bước tạo Custom Hook)

Để bóc tách bất kỳ logic nào thành Custom Hook, hãy tuân theo **Công thức 6 bước**:

1. **Bước 1**: Tìm tất cả các dòng code liên quan đến một tính năng duy nhất trong Component (State, Effect, Handlers).
2. **Bước 2**: Tạo một hàm mới có tên bắt đầu bằng `use...` (ví dụ: `useSort`).
3. **Bước 3**: Copy toàn bộ đoạn code logic đó (không dính dáng tới JSX) đưa vào hàm `use...`.
4. **Bước 4**: Xác định **Đầu vào (Inputs / Arguments)**: Những dữ liệu nào từ bên ngoài cần truyền vào hàm `useSort(data, config)`?
5. **Bước 5**: Xác định **Đầu ra (Outputs / Return value)**: Trả về một Object chứa các State và Hàm mà Component cần dùng `{ sortedData, setSortColumn, sortBy, sortOrder }`.
6. **Bước 6**: Gọi Custom Hook vừa tạo ở bên trong Component.

---

### 📖 Lesson 288: Making a Reusable Sorting Hook (`useSort`)
Áp dụng công thức 6 bước để tách toàn bộ logic sort ra khỏi `SortableTable.jsx` đưa vào file `src/hooks/use-sort.js`.

---

## 🛠️ [CODE CHÍNH THỨC VÀO DỰ ÁN] (HƯỚNG DẪN 2 BƯỚC)

---

### BƯỚC 1: Tạo Custom Hook `src/hooks/use-sort.js` (Bài 288)
* **File tạo mới**: `src/hooks/use-sort.js`

```javascript
// src/hooks/use-sort.js
import { useState } from 'react';

// Custom Hook nhận vào đầu vào là data (dữ liệu mảng) và config (cấu hình cột)
function useSort(data, config) {
    // 1. Quản lý State sắp xếp
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    // 2. Hàm xử lý thay đổi cột sort và chiều sort (asc -> desc -> null)
    const setSortColumn = (label) => {
        if (sortBy && label !== sortBy) {
            setSortOrder('asc');
            setSortBy(label);
            return;
        }

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

    // 3. Thuật toán tính toán mảng dữ liệu đã được sort
    let sortedData = data;
    if (sortOrder && sortBy) {
        const { sortValue } = config.find((column) => column.label === sortBy);
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

    // 4. Trả về đầu ra là các biến và hàm cần thiết cho Component
    return {
        sortBy,
        sortOrder,
        sortedData,
        setSortColumn
    };
}

export default useSort;
```

---

### BƯỚC 2: Refactor `SortableTable.jsx` sử dụng `useSort` (Bài 288)
* **File sửa**: `src/components/SortableTable.jsx` (Dọn dẹp code trở nên vô cùng sạch sẽ và ngắn gọn):

```javascript
// src/components/SortableTable.jsx
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import Table from './Table';
import useSort from '../hooks/use-sort'; // 1. Import Custom Hook useSort

function SortableTable(props) {
    const { config, data } = props;

    // 2. Sử dụng Custom Hook useSort để lấy dữ liệu đã sort và hàm điều khiển
    const {
        sortBy,
        sortOrder,
        sortedData,
        setSortColumn
    } = useSort(data, config);

    // 3. Cập nhật mảng config gán sự kiện click gọi hàm setSortColumn
    const updatedConfig = config.map((column) => {
        if (!column.sortValue) {
            return column;
        }

        return {
            ...column,
            header: () => (
                <th
                    className="cursor-pointer hover:bg-gray-100 p-2"
                    onClick={() => setSortColumn(column.label)}
                >
                    <div className="flex items-center">
                        {getIcons(column.label, sortBy, sortOrder)}
                        {column.label}
                    </div>
                </th>
            )
        };
    });

    // 4. Truyền sortedData và updatedConfig xuống cho Table
    return <Table {...props} data={sortedData} config={updatedConfig} />;
}

// Hàm phụ trợ vẽ Icon
function getIcons(label, sortBy, sortOrder) {
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

## 🎯 TỔNG KẾT TƯ TƯỞNG CỐT LÕI SECTION 17
1. **Mục đích của Custom Hook**: Tái sử dụng **Logic không chứa JSX** (State + Effect + Handlers) cho nhiều component khác nhau.
2. **Quy tắc vàng**: Tên Custom Hook **bắt buộc** có tiền tố `use...`.
3. **Quy trình 6 bước**: Xác định logic $\to$ Tạo hàm `use...` $\to$ Copy logic vào $\to$ Xác định Inputs $\to$ Xác định Outputs $\to$ Gọi hook ở Component.
