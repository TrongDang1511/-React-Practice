# Section 18: Into the World of Reducers (Toàn bộ Bài 289 - 300)

## 📌 Bức tranh tổng quan (Tại sao cần `useReducer` & `Immer`?)
Khi ứng dụng có nhiều State phụ thuộc lẫn nhau hoặc có nhiều hành động thay đổi dữ liệu phức tạp, việc dùng quá nhiều `useState` sẽ khiến code bị phân mảnh và khó kiểm soát.

**`useReducer`** là Hook nâng cao có sẵn của React, đóng vai trò là "cánh cổng" để bạn làm quen với tư duy quản lý State của **Redux & Redux Toolkit** sau này. Ngoài ra, thư viện **`immer`** sẽ giúp chúng ta viết code cập nhật State cực kỳ ngắn gọn mà không sợ phạm luật bất biến (Immutability).

---

## 📚 CHI TIẾT TỪNG BÀI HỌC (LÝ THUYẾT CHUYÊN SÂU & THỰC HÀNH)

---

### 📖 Lesson 289 & 290: App Overview & Adding the Form (Bài toán Counter nâng cao)
* **Mục tiêu**: Xây dựng trang `CounterPage` với:
  1. Nút **Increment (+1)** và **Decrement (-1)**.
  2. Một Form nhập số lượng lớn để cộng thêm (`valueToAdd`). Khi bấm nút "Add it", cộng số này vào `count` và reset ô input về 0.
* **4 bước thiết lập ban đầu**:
  1. Tạo trang `src/pages/CounterPage.jsx`.
  2. Thêm route `/counter` vào `App.jsx`.
  3. Thêm link `Counter` vào `Sidebar.jsx`.

---

### 📖 Lesson 291: More on the Form (Phiên bản giải bằng `useState`)
* Khi giải bằng `useState`, ta cần 2 state riêng biệt:
  ```javascript
  const [count, setCount] = useState(initialCount);
  const [valueToAdd, setValueToAdd] = useState(0);
  ```
* Trong hàm `handleSubmit`, ta phải gọi liên tiếp `setCount` và `setValueToAdd` -> Các State bị phân tán và logic cập nhật nằm rải rác khắp các event handler.

---

### 📖 Lesson 292: `useReducer` in Action (Cơ chế hoạt động của `useReducer`)

```javascript
const [state, dispatch] = useReducer(reducer, { count: initialCount, valueToAdd: 0 });
```

* **`state`**: Một Object duy nhất chứa toàn bộ dữ liệu của Component (`{ count: 10, valueToAdd: 0 }`).
* **`dispatch(action)`**: Hàm "phát lệnh" gửi một `action` tới `reducer` để yêu cầu thay đổi State.
* **`reducer(state, action)`**: Hàm trung tâm tính toán và trả về **Object State MỚI** dựa trên lệnh `action` nhận được.

💡 **Ví dụ đời thực dễ hiểu**:
* Bạn là **Khách hàng** (Event Handler).
* Bạn viết một **Phiếu yêu cầu rút 500k** (`action = { type: 'withdraw', payload: 500 }`).
* Bạn đưa phiếu cho **Giao dịch viên** (`dispatch(action)`).
* Giao dịch viên đưa vào **Hệ thống sổ cái** (`reducer`) để tính toán lại số dư mới của bạn (`newState`).

---

### 📖 Lesson 293: Rules of Reducer Functions (3 Quy tắc sống còn của Reducer)
1. **Phải là Pure Function (Hàm thuần khiết)**: Không được chứa code bất đồng bộ (`async/await`, `fetch/axios`), không gọi API, không `Math.random()`, không sửa biến toàn cục bên ngoài.
2. **TUYỆT ĐỐI KHÔNG ĐƯỢC MUTATE STATE TRỰC TIẾP**:
   * ❌ CẤM: `state.count = state.count + 1;`
   * ✅ ĐÚNG: Phải luôn trả về object mới: `return { ...state, count: state.count + 1 };`
3. **Luôn luôn phải `return` một giá trị State mới** (nếu không return, State sẽ bị biến thành `undefined`).

---

### 📖 Lesson 294 & 295: Action Objects & Constant Action Types (Cấu trúc Action & Định nghĩa Hằng số)
* **Cấu trúc Action Object chuẩn trong ngành**:
  * `type` (Bắt buộc): Chuỗi mô tả hành động xảy ra (`'increment'`, `'change_value_to_add'`).
  * `payload` (Tùy chọn): Dữ liệu đính kèm đi cùng hành động.
* **Tại sao cần tạo Hằng số (Constants - Bài 295)?**:
  * Nếu gõ chữ chuỗi trực tiếp (`'increment'`), bạn rất dễ gõ sai chính tả (typo như `'incremet'`). Trình duyệt sẽ không báo lỗi mà âm thầm không chạy code!
  * **Giải pháp**: Khai báo hằng số:
    ```javascript
    const INCREMENT_COUNT = 'increment';
    const DECREMENT_COUNT = 'decrement';
    const SET_VALUE_TO_ADD = 'change_value_to_add';
    const ADD_VALUE_TO_COUNT = 'add_value_to_count';
    ```

---

### 📖 Lesson 296, 297 & 298: Refactoring to Switch & Design Considerations (Hoàn thiện Reducer thuần)
* Dùng câu lệnh `switch (action.type)` thay cho `if/else` để code sạch sẽ và có `default: return state;` phòng ngừa action lạ.

---

### 📖 Lesson 299 & 300: Introducing Immer & Immer in Action (Nâng cấp với thư viện `immer`)

#### Vấn đề của cách viết thuần:
Khi State có nhiều tầng lồng nhau, viết `{ ...state, user: { ...state.user, age: 20 } }` cực kỳ dài dòng và dễ sót.

#### Sức mạnh của `immer`:
Thư viện `immer` cung cấp hàm `produce` giúp bạn có thể **viết code "mutate" trực tiếp một cách an toàn**:
```javascript
// CÀI ĐẶT: npm install immer
import { produce } from 'immer';

// Với immer, bạn có thể gán trực tiếp state.count += 1 mà KHÔNG sợ phạm luật!
const reducer = (state, action) => {
    switch (action.type) {
        case INCREMENT_COUNT:
            state.count = state.count + 1; // Immer tự động nhân bản và trả về state mới!
            return;
        case DECREMENT_COUNT:
            state.count = state.count - 1;
            return;
        case SET_VALUE_TO_ADD:
            state.valueToAdd = action.payload;
            return;
        case ADD_VALUE_TO_COUNT:
            state.count = state.count + state.valueToAdd;
            state.valueToAdd = 0;
            return;
        default:
            return;
    }
};

// Khi khởi tạo useReducer: bọc reducer bằng produce()
const [state, dispatch] = useReducer(produce(reducer), { count: initialCount, valueToAdd: 0 });
```

---

## 🛠️ [CODE CHÍNH THỨC VÀO DỰ ÁN] (HƯỚNG DẪN 4 BƯỚC)

---

### BƯỚC 1: Cài đặt thư viện `immer` vào dự án
Mở Terminal tại thư mục `section10/comps` và chạy lệnh:
```bash
npm install immer
```

---

### BƯỚC 2: Tạo Trang `src/pages/CounterPage.jsx` hoàn chỉnh dùng `useReducer` + `immer` (Bài 292 - 300)
* **File tạo mới**: `src/pages/CounterPage.jsx` (hoặc `src/page/CounterPage.jsx`)

```javascript
// src/pages/CounterPage.jsx
import { useReducer } from 'react';
import { produce } from 'immer'; // Import produce từ immer
import Button from '../components/Button';
import Panel from '../components/Panel';

// 1. Định nghĩa các Hằng số Action Type để chống lỗi chính tả
const INCREMENT_COUNT = 'increment';
const DECREMENT_COUNT = 'decrement';
const SET_VALUE_TO_ADD = 'change_value_to_add';
const ADD_VALUE_TO_COUNT = 'add_value_to_count';

// 2. Hàm Reducer (Được Immer hỗ trợ nên có thể gán trực tiếp thuộc tính)
const reducer = (state, action) => {
    switch (action.type) {
        case INCREMENT_COUNT:
            state.count = state.count + 1;
            return;
        case DECREMENT_COUNT:
            state.count = state.count - 1;
            return;
        case SET_VALUE_TO_ADD:
            state.valueToAdd = action.payload;
            return;
        case ADD_VALUE_TO_COUNT:
            state.count = state.count + state.valueToAdd;
            state.valueToAdd = 0; // Reset ô input về 0 sau khi cộng
            return;
        default:
            return;
    }
};

function CounterPage({ initialCount = 10 }) {
    // 3. Khởi tạo useReducer bọc qua produce() của Immer
    const [state, dispatch] = useReducer(produce(reducer), {
        count: initialCount,
        valueToAdd: 0
    });

    // Các hàm phát tín hiệu (Dispatch actions)
    const increment = () => {
        dispatch({ type: INCREMENT_COUNT });
    };

    const decrement = () => {
        dispatch({ type: DECREMENT_COUNT });
    };

    const handleChange = (event) => {
        const value = parseInt(event.target.value) || 0;
        dispatch({
            type: SET_VALUE_TO_ADD,
            payload: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch({ type: ADD_VALUE_TO_COUNT });
    };

    return (
        <Panel className="m-3">
            <h1 className="text-lg font-bold mb-3">Count is: {state.count}</h1>
            
            {/* 2 nút tăng giảm */}
            <div className="flex flex-row gap-2 mb-4">
                <Button primary onClick={increment}>
                    Increment
                </Button>
                <Button secondary onClick={decrement}>
                    Decrement
                </Button>
            </div>

            {/* Form cộng thêm số lượng lớn */}
            <form onSubmit={handleSubmit}>
                <label className="block mb-1 font-medium">Add a lot!</label>
                <input
                    value={state.valueToAdd || ''}
                    onChange={handleChange}
                    type="number"
                    className="p-1 m-3 bg-gray-50 border border-gray-300 rounded"
                />
                <Button primary>Add it</Button>
            </form>
        </Panel>
    );
}

export default CounterPage;
```

---

### BƯỚC 3: Thêm Route `/counter` vào `App.jsx` (Bài 289)
* **File sửa**: `src/App.jsx`

```javascript
import Sidebar from './components/Sidebar';
import Route from './components/Route';
import AccordionPage from './pages/AccordionPage';
import DropdownPage from './pages/DropdownPage';
import ButtonPage from './pages/ButtonPage';
import ModalPage from './pages/ModalPage';
import TablePage from './pages/TablePage';
import CounterPage from './pages/CounterPage'; // 1. Import CounterPage

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
                <Route path="/table">
                    <TablePage />
                </Route>
                {/* 2. Thêm Route Counter */}
                <Route path="/counter">
                    <CounterPage initialCount={10} />
                </Route>
            </div>
        </div>
    );
}

export default App;
```

---

### BƯỚC 4: Thêm Link `Counter` vào `Sidebar.jsx` (Bài 289)
* **File sửa**: `src/components/Sidebar.jsx`

```javascript
import Link from './Link';

function Sidebar() {
    const links = [
        { label: 'Dropdown', path: '/' },
        { label: 'Accordion', path: '/accordion' },
        { label: 'Buttons', path: '/buttons' },
        { label: 'Modal', path: '/modal' },
        { label: 'Table', path: '/table' },
        { label: 'Counter', path: '/counter' } // Thêm link Counter
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

## 🎯 TỔNG KẾT TƯ TƯỞNG CỐT LÕI SECTION 18
1. **`useReducer` vs `useState`**: Khi có nhiều state liên quan mật thiết và nhiều hành động thay đổi phức tạp, gom về `useReducer` giúp quản lý tập trung và dễ bảo trì.
2. **Action Object**: Luôn có `type` (hằng số) và `payload` (dữ liệu gửi kèm).
3. **Immer (`produce`)**: Cho phép viết code cập nhật State dạng đột biến (`state.count += 1`) một cách an toàn mà không sợ phá vỡ tính bất biến của React!
