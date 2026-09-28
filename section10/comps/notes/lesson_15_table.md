# Section 15: Make a Feature-Full Data Table! (Toàn bộ Bài 249 - 261)

## 📌 Bức tranh tổng quan (Tại sao phải tạo Table tái sử dụng?)
Trong hầu hết mọi ứng dụng web (từ trang quản trị Admin, e-commerce đến hệ thống quản lý), hiển thị danh sách dữ liệu dạng bảng là yêu cầu bắt buộc. Nếu bạn viết một component Table mà bị cứng các cột (như chỉ hiển thị `fruit.name`, `fruit.color`), mỗi khi cần làm bảng mới (như Danh sách Người dùng, Xe hơi, Đơn hàng), bạn lại phải viết lại toàn bộ code Table.

Section 15 sẽ giúp bạn **xây dựng một Component Table linh hoạt 100% (Reusable Table)**: Chỉ cần truyền dữ liệu `data` và cấu hình cột `config`, Table sẽ tự động render bất kỳ loại dữ liệu nào!

---

## 📚 CHI TIẾT TỪNG BÀI HỌC (LÝ THUYẾT CHUYÊN SÂU & THỰC HÀNH)

---

### 📖 Lesson 249: Creating a Reusable Table (Khởi tạo Component & Trang Demo)
* **Các bước thiết lập ban đầu**:
  1. Tạo component `src/components/Table.jsx`.
  2. Tạo trang demo `src/pages/TablePage.jsx`.
  3. Thêm route `/table` vào `App.jsx`.
  4. Thêm link `Table` vào `Sidebar.jsx`.

---

### 📖 Lesson 250: Communicating Data to the Table (Cấu trúc dữ liệu `data`)
* **Nguyên tắc truyền dữ liệu**:
  * Dữ liệu danh sách (`data`) được định nghĩa ở trang cha (`TablePage.jsx`) dưới dạng **Mảng các Object** (Array of Objects). Mỗi Object đại diện cho 1 dòng (`tr`) trong bảng.
* **Mẫu dữ liệu đĩa trái cây**:
  ```javascript
  const data = [
      { name: 'Orange', color: 'bg-orange-500', score: 5 },
      { name: 'Apple', color: 'bg-red-500', score: 3 },
      { name: 'Banana', color: 'bg-yellow-500', score: 1 },
      { name: 'Lime', color: 'bg-green-500', score: 4 }
  ];
  ```

---

### 📖 Lesson 251: Reminder on Table HTML Structure (Cấu trúc chuẩn của HTML Table)
* **Quy tắc nghiêm ngặt của React đối với HTML Table**:
  * Thẻ `<table>` **KHÔNG ĐƯỢC** chứa trực tiếp thẻ `<div>`. Nếu làm vậy, React sẽ văng cảnh báo: `Warning: validateDOMNesting(...): <div> cannot appear as a child of <table>`.
* **Cấu trúc HTML Table chuẩn**:
  * `<table>`: Thẻ bao ngoài cùng.
  * `<thead>`: Chứa dòng tiêu đề cột (`<tr><th>Title 1</th><th>Title 2</th></tr>`).
  * `<tbody>`: Chứa các dòng dữ liệu (`<tr><td>Value 1</td><td>Value 2</td></tr>`).

---

### 📖 Lesson 252 & 253: Building Rows & Styling (Code thử nghiệm sơ khai & Thêm Tailwind)
* Ở cách làm ban đầu, ta dùng `data.map()` để render cứng các dòng `<tr>` và ô `<td>`:
  ```javascript
  // ❌ CÁCH LÀM SƠ KHAI (CHƯA TÁI SỬ DỤNG ĐƯỢC)
  const renderedRows = data.map((fruit) => (
      <tr key={fruit.name}>
          <td>{fruit.name}</td>
          <td>{fruit.color}</td>
          <td>{fruit.score}</td>
      </tr>
  ));
  ```
* **Class CSS Tailwind cho Table**:
  * `table`: `table-auto border-spacing-2`
  * `th` / `thead`: `border-b-2`
  * `td` / `tr`: `border-b`

---

### 📖 Lesson 254 & 255: Done! But It's Not Reusable & Here's the Idea (Ý tưởng cấu hình `config`)
* ❌ **Vấn đề**: Cách làm trên cứng nhắc vì trong `Table.jsx` ta gõ trực tiếp `fruit.name`, `fruit.color`, `fruit.score`. Nếu ngày mai truyền vào mảng các Car `{ make, model, price }`, Table sẽ bị crash!
* 💡 **Ý TƯỞNG CỐT LÕI (Config Array Pattern)**:
  * Component cha (`TablePage.jsx`) sẽ truyền xuống thêm một prop gọi là **`config`**.
  * `config` là một mảng mô tả cấu hình cho từng cột: Tên cột là gì (`label`), và ô đó sẽ hiển thị như thế nào (`render`).

---

### 📖 Lesson 256, 257 & 258: Dynamic Table Headers & The `render()` Function (Cơ chế Hàm `render`)

#### Tại sao `config` lại chứa hàm `render(fruit)`?
Mỗi cột có cách hiển thị khác nhau:
1. Cột Tên Fruit: Chỉ cần lấy chuỗi chữ `fruit.name`.
2. Cột Score: Chỉ cần lấy số `fruit.score`.
3. Cột Color: Không hiển thị chữ `bg-red-500` mà phải hiển thị một **ô vuông có màu tương ứng** (`<div className={`p-3 m-2 ${fruit.color}`} />`).
4. Cột Tính toán: Tính bình phương điểm `fruit.score ** 2`.

👉 **Hàm `render(rowData)` đóng vai trò là một "Hàm tùy biến giao diện"**: Component cha tự quyết định vẽ ô đó như thế nào và trả về cho Table render!

---

### 📖 Lesson 259 & 260: Nested Maps & Fixing Colors (Vòng lặp lồng 2 tầng)
Trong `Table.jsx`, để vẽ được toàn bộ bảng động, ta dùng **2 vòng lặp `.map()` lồng nhau**:
* **Vòng lặp ngoài (`data.map`)**: Duyệt qua từng dòng (`rowData`).
* **Vòng lặp trong (`config.map`)**: Duyệt qua từng cột trong dòng đó và gọi `column.render(rowData)` để lấy nội dung ô `<td>`.

```javascript
// [LÝ THUYẾT - VÒNG LẶP LỒNG CHI TIẾT]
const renderedRows = data.map((rowData) => {
    // Với mỗi dòng, duyệt qua từng cột trong mảng config để tạo ra mảng các thẻ <td>
    const renderedCells = config.map((column) => {
        return (
            <td key={column.label}>
                {column.render(rowData)}
            </td>
        );
    });

    return <tr key={keyFn(rowData)}>{renderedCells}</tr>;
});
```

---

### 📖 Lesson 261: Adding a Key Function (`keyFn`)
* **Vấn đề `key`**: Khi render danh sách `<tr>`, React bắt buộc phải có thuộc tính `key` duy nhất. Tuy nhiên `Table` không biết dữ liệu `data` dùng trường nào làm ID (dữ liệu Fruit dùng `fruit.name`, dữ liệu User dùng `user.id`, dữ liệu Car dùng `car.vin`).
* **Giải pháp**: Component cha sẽ truyền xuống một hàm `keyFn`:
  `keyFn={(fruit) => fruit.name}`
  Inside Table: `<tr key={keyFn(rowData)}>` -> Giúp Table tự lấy đúng `key` duy nhất cho mọi loại dữ liệu!

---

## 🛠️ [CODE CHÍNH THỨC VÀO DỰ ÁN] (HƯỚNG DẪN 5 BƯỚC)

---

### BƯỚC 1: Tạo Component `<Table />` hoàn chỉnh (Bài 256 - 261)
* **File tạo mới**: `src/components/Table.jsx`

```javascript
// src/components/Table.jsx

// Component Table nhận 3 props:
// - data: Mảng chứa dữ liệu các dòng
// - config: Mảng cấu hình các cột (gồm label và hàm render)
// - keyFn: Hàm định nghĩa cách lấy key duy nhất cho mỗi dòng
function Table({ data, config, keyFn }) {
    // 1. Render danh sách các tiêu đề cột (<thead>) dựa trên mảng config
    const renderedHeaders = config.map((column) => {
        return (
            <th key={column.label} className="p-2">
                {column.label}
            </th>
        );
    });

    // 2. Render danh sách các dòng dữ liệu (<tbody>) sử dụng 2 vòng lặp map lồng nhau
    const renderedRows = data.map((rowData) => {
        // Vòng lặp trong: Tạo ra danh sách các thẻ <td> cho từng cột trong dòng này
        const renderedCells = config.map((column) => {
            return (
                <td key={column.label} className="p-3">
                    {/* Gọi hàm render() được định nghĩa từ mảng config và truyền rowData vào */}
                    {column.render(rowData)}
                </td>
            );
        });

        // Vòng lặp ngoài: Trả về thẻ <tr> đại diện cho 1 dòng dữ liệu
        return (
            <tr key={keyFn(rowData)} className="border-b">
                {renderedCells}
            </tr>
        );
    });

    return (
        // Áp dụng Tailwind CSS chuẩn cho bảng HTML
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

### BƯỚC 2: Tạo Trang `TablePage.jsx` định nghĩa `data` & `config` (Bài 250, 255, 258)
* **File tạo mới**: `src/pages/TablePage.jsx` (hoặc `src/page/TablePage.jsx`)

```javascript
// src/pages/TablePage.jsx
import Table from '../components/Table';

function TablePage() {
    // 1. Dữ liệu danh sách hoa quả
    const data = [
        { name: 'Orange', color: 'bg-orange-500', score: 5 },
        { name: 'Apple', color: 'bg-red-500', score: 3 },
        { name: 'Banana', color: 'bg-yellow-500', score: 1 },
        { name: 'Lime', color: 'bg-green-500', score: 4 }
    ];

    // 2. Mảng Cấu hình Cột (Config Array): Định nghĩa nhãn tiêu đề và cách hiển thị nội dung từng ô
    const config = [
        {
            label: 'Name',
            render: (fruit) => fruit.name
        },
        {
            label: 'Color',
            // Render ô vuông có màu tương ứng dựa vào class Tailwind của fruit.color
            render: (fruit) => <div className={`p-3 m-2 ${fruit.color}`} />
        },
        {
            label: 'Score',
            render: (fruit) => fruit.score
        }
    ];

    // 3. Hàm tạo key duy nhất cho từng dòng (dùng fruit.name)
    const keyFn = (fruit) => {
        return fruit.name;
    };

    return (
        <div>
            {/* Truyền data, config và keyFn xuống Table */}
            <Table data={data} config={config} keyFn={keyFn} />
        </div>
    );
}

export default TablePage;
```

---

### BƯỚC 3: Thêm Route `/table` vào `App.jsx` (Bài 249)
* **File sửa**: `src/App.jsx`

```javascript
import Sidebar from './components/Sidebar';
import Route from './components/Route';
import AccordionPage from './pages/AccordionPage';
import DropdownPage from './pages/DropdownPage';
import ButtonPage from './pages/ButtonPage';
import ModalPage from './pages/ModalPage';
import TablePage from './pages/TablePage'; // Import thêm TablePage

function App() {
    return (
        <div className="container mx-auto grid grid-cols-6 gap-4 mt-4">
            <Sidebar />
            <div className="col-span-5">
                <Route path="/">
                    <DropdownPage />
                </Route>
                <Route path="/accordion">
                    <AccordionPage />
                </Route>
                <Route path="/buttons">
                    <ButtonPage />
                </Route>
                <Route path="/modal">
                    <ModalPage />
                </Route>
                {/* THÊM ROUTE TABLE TẠI ĐÂY */}
                <Route path="/table">
                    <TablePage />
                </Route>
            </div>
        </div>
    );
}

export default App;
```

---

### BƯỚC 4: Thêm Link `Table` vào `Sidebar.jsx` (Bài 249)
* **File sửa**: `src/components/Sidebar.jsx`

```javascript
import Link from './Link';

function Sidebar() {
    const links = [
        { label: 'Dropdown', path: '/' },
        { label: 'Accordion', path: '/accordion' },
        { label: 'Buttons', path: '/buttons' },
        { label: 'Modal', path: '/modal' },
        { label: 'Table', path: '/table' } // THÊM LINK NÀY
    ];

    const renderedLinks = links.map((link) => {
        return (
            <Link
                key={link.label}
                to={link.path}
                className="mb-3"
                activeClassName="font-bold border-l-4 border-blue-500 pl-2"
            >
                {link.label}
            </Link>
        );
    });

    return (
        <div className="sticky top-0 flex flex-col items-start">
            {renderedLinks}
        </div>
    );
}

export default Sidebar;
```

---

## 🎯 TỔNG KẾT TƯ TƯỞNG CỐT LÕI SECTION 15
1. **Config Array Pattern**: Tách biệt hoàn toàn phần Dữ liệu (`data`) và Cách hiển thị (`config`).
2. **Cơ chế hàm `render(rowData)`**: Giúp component cha linh hoạt tùy biến ô hiển thị (chuỗi chữ, icon, ô màu, nút bấm...) mà không làm sửa đổi code bên trong `Table.jsx`.
3. **Vòng lặp lồng nhau**: Dùng `data.map` tạo các dòng `<tr>`, bên trong dùng `config.map` tạo các ô `<td>`.
4. **Hàm `keyFn`**: Giúp `Table` lấy đúng thuộc tính duy nhất làm `key` cho bất kỳ đối tượng dữ liệu nào.
