# Section 13: Making Navigation Reusable (Toàn bộ Bài 221 - 238)

## 📌 Bức tranh tổng quan (Tại sao phải tự xây dựng Navigation?)
Trong các dự án thực tế, bạn thường dùng thư viện như `react-router-dom`. Tuy nhiên, Stephen Grider yêu cầu chúng ta **tự tay xây dựng hệ thống Router từ con số 0** trong Section này để:
1. Hiểu cặn kẽ bản chất Single Page Application (SPA).
2. Nắm vững cơ chế hoạt động của History API (`pushState`, `popstate`), Context API và Custom Hooks.
3. Không bị bỡ ngỡ và làm chủ hoàn toàn khi sử dụng các thư viện Router nâng cao sau này.

---

## 📚 CHI TIẾT TỪNG BÀI HỌC (LÝ THUYẾT CHUYÊN SÂU & THỰC HÀNH)

---

### 📖 Lesson 221: Traditional Browser Navigation (Cách điều hướng truyền thống & Vấn đề)
* **Cơ chế truyền thống**: Khi bạn bấm vào thẻ `<a href="/dashboard">`, trình duyệt gửi một HTTP GET Request lên server -> Server trả về một file `dashboard.html` hoàn toàn mới -> Trình duyệt tải lại toàn bộ trang.
* **Vấn đề cốt tử đối với React**:
  * Mỗi khi tải lại trang, **TOÀN BỘ BỘ NHỚ VÀ STATE CỦA JAVASCRIPT BỊ XÓA SẠCH VỀ 0** (Reset JS Environment).
  * Mất hết State người dùng đang nhập, biến lưu trong RAM biến mất, màn hình bị chớp trắng để nạp lại `index.html` và file `bundle.js` từ đầu.
* 💡 **Ví dụ minh họa**: Giống như bạn đang tô màu một bức tranh (State). Nếu chuyển sang phòng khác mà phải xé bỏ bức tranh cũ vẽ lại từ đầu (Reload), bạn sẽ mất sạch công sức vừa tô.

---

### 📖 Lesson 222: Theory of Navigation in React (Lý thuyết điều hướng trong React SPA)
Để giải quyết vấn đề trên, React áp dụng kiến trúc **Single Page Application (SPA)**:
1. **Khi mới vào website (Initial Load)**: 
   * Trình duyệt luôn nhận file `index.html` -> Tải file `bundle.js` -> React khởi chạy -> Đọc đường dẫn trên thanh URL (`window.location.pathname`) -> Hiển thị component tương ứng.
2. **Khi người dùng click chuyển trang bên trong ứng dụng (In-app Navigation)**:
   * **BƯỚC 1**: Chặn hành vi tải trang mặc định của thẻ `<a>` bằng `event.preventDefault()`.
   * **BƯỚC 2**: Đổi đường dẫn trên thanh URL bằng hàm `window.history.pushState({}, '', to)` (Đổi URL nhưng tuyệt đối không nạp lại trang).
   * **BƯỚC 3**: Cập nhật State nội bộ trong React (`currentPath`) để React biết đường dẫn mới và hoán đổi Component hiển thị trên màn hình.
* 💡 **Lợi ích lớn**: Dữ liệu đã fetch từ API ở trang trước vẫn còn nguyên trong bộ nhớ RAM, khi bấm quay lại trang cũ sẽ hiển thị ngay lập tức (Instant) mà không cần gọi API lại.

---

### 📖 Lesson 223: Extracting the DropdownPage (Tách trang DropdownPage)
* **Lý do**: File `App.jsx` sẽ đóng vai trò là "Bộ điều phối Router trung tâm", do đó toàn bộ code demo Dropdown ở `App.jsx` cần được đóng gói riêng vào `src/pages/DropdownPage.jsx` (giống như `AccordionPage.jsx` và `ButtonPage.jsx`).

#### 🛠️ `[CODE CHÍNH THỨC VÀO DỰ ÁN]`
* **File tạo mới**: `src/pages/DropdownPage.jsx`

```javascript
// src/pages/DropdownPage.jsx
import { useState } from 'react';
import Dropdown from '../components/Dropdown';

function DropdownPage() {
    // State lưu trữ tùy chọn màu sắc hiện tại
    const [selection, setSelection] = useState(null);

    // Hàm callback cập nhật state khi người dùng chọn 1 option
    const handleSelect = (option) => {
        setSelection(option);
    };

    // Dữ liệu danh sách tùy chọn
    const options = [
        { label: 'Red', value: 'red' },
        { label: 'Green', value: 'green' },
        { label: 'Blue', value: 'blue' }
    ];

    return (
        <div className="flex">
            {/* Hiển thị Dropdown dưới dạng Controlled Component */}
            <Dropdown options={options} value={selection} onChange={handleSelect} />
        </div>
    );
}

export default DropdownPage;
```

---

### 📖 Lesson 224: Answering Critical Questions (Phân tích các câu hỏi then chốt)
* **Câu hỏi 1**: Phần nào trên URL là quan trọng nhất cho Router?
  * `http://localhost:3000/accordion` -> Domain (`localhost:3000`) sẽ thay đổi khi deploy lên server thật (`myapp.com`). Vì vậy Router **chỉ quan tâm đến phần pathname đằng sau** (ví dụ: `/accordion`, `/buttons`, `/`).
* **Câu hỏi 2**: Làm sao để lấy pathname bằng JavaScript?
  * Sử dụng thuộc tính có sẵn của trình duyệt: `window.location.pathname`.

---

### 📖 Lesson 225: The PushState Function (Hàm `window.history.pushState`)
* **Cú pháp**: `window.history.pushState({}, '', '/accordion')`
* **Tác dụng**: Cập nhật URL trên thanh địa chỉ của trình duyệt sang `/accordion` và lưu vào lịch sử lướt web mà **KHÔNG làm mới (reload) trang web**.
* ⚠️ **Điểm đặc biệt cần nhớ**: Bản thân hàm `pushState` **KHÔNG** phát ra bất kỳ sự kiện nào và **KHÔNG** làm React tự render lại. Do đó, sau khi gọi `pushState`, chúng ta bắt buộc phải tự cập nhật State của React (`setCurrentPath(to)`).

---

### 📖 Lesson 226: Handling Link Clicks (Xử lý sự kiện Click trên Link)
* Khi người dùng click vào thẻ `<a>`:
  ```javascript
  const handleClick = (event) => {
      event.preventDefault(); // 1. Chặn reload trang
      window.history.pushState({}, '', to); // 2. Đổi URL
      setCurrentPath(to); // 3. Báo cho React render component mới
  };
  ```

---

### 📖 Lesson 227: Handling Back/Forward Buttons (Xử lý nút Back/Forward trình duyệt)
* **Vấn đề**: Khi người dùng bấm nút **Back (Quay lại)** hoặc **Forward (Tiến lên)** trên trình duyệt, URL trên thanh địa chỉ thay đổi nhưng hàm `handleClick` của thẻ `<a>` không chạy.
* **Cơ chế của trình duyệt**: Mỗi khi bấm nút Back/Forward, trình duyệt phát ra sự kiện có tên là **`popstate`** trên đối tượng `window`.
* **Giải pháp**: Đăng ký lắng nghe sự kiện `popstate`:
  ```javascript
  window.addEventListener('popstate', () => {
      // Khi bấm Back/Forward, đọc lại URL mới và cập nhật vào State React
      setCurrentPath(window.location.pathname);
  });
  ```

---

### 📖 Lesson 228, 229 & 230: Navigation Context & Programmatic Navigation (Bộ não điều phối Router)
* **Tại sao cần Context?**:
  * State `currentPath` và hàm `navigate(to)` cần được chia sẻ cho:
    * Component `<Link>` (ở Sidebar) để đổi URL.
    * Component `<Route>` (ở App) để quyết định ẩn/hiện trang.
    * Các nút bấm điều hướng theo logic code (Programmatic Navigation).

#### 🛠️ `[CODE CHÍNH THỨC VÀO DỰ ÁN]`
* **File tạo mới**: `src/context/navigation.jsx`

```javascript
// src/context/navigation.jsx
import { createContext, useState, useEffect } from 'react';

// 1. Tạo Context để chia sẻ dữ liệu điều hướng
const NavigationContext = createContext();

function NavigationProvider({ children }) {
    // 2. Khởi tạo State với URL hiện tại trên thanh địa chỉ trình duyệt
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    // 3. Lesson 229: Lắng nghe sự kiện Back/Forward của trình duyệt
    useEffect(() => {
        const handler = () => {
            // Khi người dùng bấm Back/Forward -> Cập nhật currentPath
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener('popstate', handler);

        // Cleanup: Hủy lắng nghe khi NavigationProvider bị unmount
        return () => {
            window.removeEventListener('popstate', handler);
        };
    }, []);

    // 4. Lesson 230: Hàm điều hướng theo lập trình (Programmatic Navigation)
    const navigate = (to) => {
        // Đổi URL trên trình duyệt
        window.history.pushState({}, '', to);
        // Cập nhật State để React re-render trang mới
        setCurrentPath(to);
    };

    return (
        <NavigationContext.Provider value={{ currentPath, navigate }}>
            {children}
        </NavigationContext.Provider>
    );
}

export { NavigationProvider };
export default NavigationContext;
```

---

### 📖 Lesson 231, 233 & 234: Component `<Link>` (Tạo thẻ liên kết thông minh)
* **Mục tiêu**: Thay thế thẻ `<a href="...">` thông thường.
* **Xử lý phím Ctrl / Command (Lesson 233)**: Người dùng có thói quen giữ phím `Ctrl` (trên Windows) hoặc `Command` (trên Mac) khi click để **mở tab mới trong nền**. Nếu ta luôn gọi `event.preventDefault()`, tính năng mở tab mới sẽ bị hỏng!
  * **Giải pháp**: Kiểm tra `if (event.metaKey || event.ctrlKey) return;` để trình duyệt tự mở tab mới theo mặc định.

#### 🛠️ `[CODE CHÍNH THỨC VÀO DỰ ÁN]`
* **File tạo mới**: `src/components/Link.jsx`

```javascript
// src/components/Link.jsx
import classNames from 'classnames';
import useNavigation from '../hooks/use-navigation';

function Link({ to, children, className, activeClassName }) {
    // Lấy hàm navigate và currentPath từ Custom Hook
    const { navigate, currentPath } = useNavigation();

    // Lesson 234 & 237: Gộp class styling và class active khi đang ở đúng trang
    const classes = classNames(
        'text-blue-500',
        className,
        // Nếu URL hiện tại trùng khớp với prop 'to' -> Gắn thêm activeClassName
        currentPath === to && activeClassName
    );

    const handleClick = (event) => {
        // Lesson 233: Nếu giữ Ctrl / Command để mở tab mới -> Bỏ qua, để trình duyệt tự xử lý
        if (event.metaKey || event.ctrlKey) {
            return;
        }

        // Chặn reload toàn bộ trang
        event.preventDefault();

        // Chuyển trang mượt mà bằng SPA Router
        navigate(to);
    };

    return (
        <a className={classes} href={to} onClick={handleClick}>
            {children}
        </a>
    );
}

export default Link;
```

---

### 📖 Lesson 232: Component `<Route>` (Cánh cửa kiểm soát hiển thị)
* **Mục tiêu**: Nhận vào `path` và `{children}`.
* **Cơ chế**: So sánh `currentPath` hiện tại với `path` của Route:
  * Nếu `currentPath === path` -> Trả về `{children}` (Hiển thị trang).
  * Nếu không trùng -> Trả về `null` (Không hiển thị gì).

#### 🛠️ `[CODE CHÍNH THỨC VÀO DỰ ÁN]`
* **File tạo mới**: `src/components/Route.jsx`

```javascript
// src/components/Route.jsx
import useNavigation from '../hooks/use-navigation';

function Route({ path, children }) {
    const { currentPath } = useNavigation();

    // Nếu đường dẫn hiện tại khớp với path đã định nghĩa cho Route này
    if (path === currentPath) {
        return children;
    }

    // Không khớp -> Ẩn hoàn toàn
    return null;
}

export default Route;
```

---

### 📖 Lesson 235: Custom Navigation Hook (`useNavigation`)
* **Lý do**: Thay vì ở mọi component đều phải import cả `useContext` lẫn `NavigationContext` (2 dòng import lặp đi lặp lại), ta gom vào 1 Custom Hook `useNavigation()`.

#### 🛠️ `[CODE CHÍNH THỨC VÀO DỰ ÁN]`
* **File tạo mới**: `src/hooks/use-navigation.js`

```javascript
// src/hooks/use-navigation.js
import { useContext } from 'react';
import NavigationContext from '../context/navigation';

// Custom Hook tiện ích
function useNavigation() {
    return useContext(NavigationContext);
}

export default useNavigation;
```

---

### 📖 Lesson 236 & 237: Adding Sidebar & Highlighting Active Link (Menu & Đổi màu Link đang chọn)
* **Tạo Sidebar**: Định nghĩa mảng các đường link (`/`, `/accordion`, `/buttons`).
* **Active Link Styling (Lesson 237)**: Khi người dùng đang ở trang nào, link ở menu bên trái sẽ tự động thêm viền xanh và in đậm chữ (`font-bold border-l-4 border-blue-500 pl-2`) để người dùng biết mình đang ở đâu.

#### 🛠️ `[CODE CHÍNH THỨC VÀO DỰ ÁN]`
* **File tạo mới**: `src/components/Sidebar.jsx`

```javascript
// src/components/Sidebar.jsx
import Link from './Link';

function Sidebar() {
    // Danh sách các link điều hướng
    const links = [
        { label: 'Dropdown', path: '/' },
        { label: 'Accordion', path: '/accordion' },
        { label: 'Buttons', path: '/buttons' }
    ];

    const renderedLinks = links.map((link) => {
        return (
            <Link
                key={link.label}
                to={link.path}
                className="mb-3"
                // Class kích hoạt khi link đang active
                activeClassName="font-bold border-l-4 border-blue-500 pl-2"
            >
                {link.label}
            </Link>
        );
    });

    return (
        // Menu cố định bên trái khi cuộn chuột (sticky)
        <div className="sticky top-0 flex flex-col items-start">
            {renderedLinks}
        </div>
    );
}

export default Sidebar;
```

---

### 📖 Lesson 238: Navigation Wrapup (Ráp nối toàn bộ hệ thống vào `index.jsx` & `App.jsx`)

#### 🛠️ `[CODE CHÍNH THỨC VÀO DỰ ÁN]`

#### 1. File `src/main.jsx` (hoặc `index.jsx`):
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Bọc NavigationProvider để toàn bộ ứng dụng dùng chung Router
import { NavigationProvider } from './context/navigation';

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);

root.render(
    <NavigationProvider>
        <App />
    </NavigationProvider>
);
```

#### 2. File `src/App.jsx` (Bố cục Grid 2 cột: Cột trái 1 phần cho Sidebar, Cột phải 5 phần cho các Route):
```javascript
import Sidebar from './components/Sidebar';
import Route from './components/Route';
import AccordionPage from './pages/AccordionPage';
import DropdownPage from './pages/DropdownPage';
import ButtonPage from './pages/ButtonPage';

function App() {
    return (
        <div className="container mx-auto grid grid-cols-6 gap-4 mt-4">
            {/* Cột 1: Sidebar menu */}
            <Sidebar />

            {/* Cột 2: Vùng hiển thị Route động theo URL */}
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
            </div>
        </div>
    );
}

export default App;
```

---

## 🎯 TỔNG KẾT TƯ TƯỞNG CỐT LÕI SECTION 13
1. **Tại sao không dùng thẻ `<a>`?** -> Vì `<a>` làm reload trang, xóa sạch bộ nhớ JS & State.
2. **Cặp đôi hoàn hảo**:
   * `<Link>`: Chặn reload (`preventDefault`), đổi URL (`pushState`), kích hoạt đổi State (`navigate`).
   * `<Route>`: Đọc `currentPath`, so khớp với `path` của chính nó để hiển thị hoặc ẩn component.
3. **Nút Back/Forward**: Được đồng bộ tự động nhờ lắng nghe sự kiện `popstate` trong `useEffect` của `NavigationProvider`.
