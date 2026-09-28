# Section 14: Creating Portals with ReactDOM (Toàn bộ Bài 239 - 248)

## 📌 Bức tranh tổng quan (Tại sao cần React Portals?)
Khi tạo một cửa sổ bật lên (**Modal / Popup**), chúng ta muốn Modal phủ kín 100% toàn bộ màn hình trình duyệt. Tuy nhiên, nếu đặt Modal bên trong các component con có CSS `position: relative`, Modal sẽ bị bóp nghẹt và vỡ khung. **React Portals (`ReactDOM.createPortal`)** ra đời để đưa HTML của Modal ra ngoài cùng của trang web (`document.body`) mà vẫn giữ nguyên luồng quản lý State của React!

---

## 📚 CHI TIẾT TỪNG BÀI HỌC (LÝ THUYẾT CHUYÊN SÂU & THỰC HÀNH)

---

### 📖 Lesson 239: Modal Component Overview (Tổng quan về Modal)
* **Khái niệm Modal**: Cửa sổ hộp thoại xuất hiện ở giữa màn hình, đè lên toàn bộ nội dung khác. Đi kèm một lớp nền tối (backdrop) để thu hút 100% sự chú ý của người dùng.
* **4 Bước chuẩn bị cơ bản**:
  1. Tạo file component `src/components/Modal.jsx`.
  2. Tạo file trang demo `src/pages/ModalPage.jsx`.
  3. Thêm đường dẫn Route `path="/modal"` vào `App.jsx`.
  4. Thêm mục điều hướng `Modal` vào `Sidebar.jsx`.

---

### 📖 Lesson 240: Toggling Visibility (Nơi nắm giữ State Ẩn/Hiện Modal)
* **Vấn đề thiết kế**: Nút "Mở Modal" và State `showModal` nên nằm ở đâu?
  * ❌ *Đặt nút bấm bên trong `Modal.jsx`*: Khiến Modal mất tính tái sử dụng (vì Modal sẽ luôn dính liền với 1 nút bấm cố định).
  * ✅ *Đặt State `showModal` và Nút bấm ở Trang cha (`ModalPage.jsx`)*: Trang cha sẽ điều khiển việc render Modal (`{showModal && <Modal />}`). Giúp Modal linh hoạt, có thể mở từ bất kỳ nút bấm nào.

---

### 📖 Lesson 241: At First Glance, Easy! (Cách làm ngây thơ & Class CSS của Modal)
* Để tạo Modal ở mức cơ bản, ta cần 2 lớp `div`:
  1. **Lớp nền tối (Backdrop)**: `fixed inset-0 bg-gray-300 opacity-80` (Phủ kín toàn màn hình, trong suốt 80%).
  2. **Hộp thoại chính (Dialog)**: `fixed inset-40 p-10 bg-white` (Nằm chính giữa màn hình, khoảng cách 40px với mép màn hình).

---

### 📖 Lesson 242: We're Lucky it Works At All! (Cạm bẫy CSS Stacking Context)
* **VẤN ĐỀ NGUY HIỂM CỦA CSS**:
  * Khi một phần tử cha có CSS `position: relative` (hoặc `transform`, `opacity < 1`), nó sẽ tạo ra một **Stacking Context (Khung tọa độ mới)**.
  * Khi đó, dù thẻ con bên trong có đặt `position: fixed` hay `absolute`, nó sẽ **KHÔNG PHỦ KÍN MÀN HÌNH** mà chỉ bị giới hạn bởi kích thước của thẻ cha đó!
* 💡 **Ví dụ minh họa**: Giống như bạn dán một tờ giấy ghi chú. Nếu bạn dán lên bảng tin tòa nhà (Root Body), ai cũng thấy. Nhưng nếu bạn dán nó bên trong một cái hộp kín (`position: relative`), tờ giấy không bao giờ thoát ra khỏi cái hộp đó được.

---

### 📖 Lesson 243: Fixing the Modal with Portals (`ReactDOM.createPortal`)
* **React Portal là gì?**: Là một API của React cho phép "bắn" cấu trúc HTML của 1 component ra một vị trí DOM bất kỳ bên ngoài (ví dụ: gắn trực tiếp vào `<div class="modal-container"></div>` ở `index.html`), nhưng vẫn giữ nguyên mối quan hệ cha-con trong React Tree.

```javascript
// Cú pháp React Portal:
ReactDOM.createPortal(JSX_NỘI_DUNG_MODAL, VỊ_TRÍ_DOM_ĐÍCH);
```

---

### 📖 Lesson 244, 245 & 246: Closing, Customizing & Styling Modal (Tùy biến Modal)
* **Đóng Modal**: Gọi callback `onClose()` khi người dùng click vào lớp nền tối (`backdrop`) hoặc click vào nút "Close/Cancel".
* **Tùy biến nội dung**: 
  * `children`: Cho phép truyền bất kỳ văn bản/JSX nào vào thân Modal.
  * `actionBar`: Prop chuyên dụng để truyền danh sách các nút bấm ở đáy Modal (như nút "I Accept", "Cancel").

---

### 📖 Lesson 247: One Small Bug (Khóa cuộn trang khi Modal mở)
* **Lỗi rò rỉ**: Khi Modal mở ra, người dùng vẫn có thể dùng con trỏ chuột cuộn trang web ở phía sau.
* **Giải pháp**: Dùng `useEffect` trong Modal để thêm class `overflow-hidden` vào thẻ `<body>` khi mount, và gỡ class đó ra khi unmount:
```javascript
useEffect(() => {
    // Khóa cuộn trang khi Modal xuất hiện
    document.body.classList.add('overflow-hidden');

    // Cleanup: Mở lại cuộn trang khi Modal biến mất
    return () => {
        document.body.classList.remove('overflow-hidden');
    };
}, []);
```

---

## 🛠️ [CODE CHÍNH THỨC VÀO DỰ ÁN] (HƯỚNG DẪN 5 BƯỚC)

---

### BƯỚC 1: Thêm container chứa Portal vào `index.html` (Bài 243)
* **File sửa**: `index.html` (hoặc `public/index.html`)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React Comps</title>
  </head>
  <body>
    <!-- Root mặc định của React -->
    <div id="root"></div>

    <!-- THÊM DÒNG NÀY: Vị trí đích để bốc Modal ra ngoài cùng -->
    <div class="modal-container"></div>

    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### BƯỚC 2: Tạo Component `<Modal />` dùng `createPortal` (Bài 243 - 247)
* **File tạo mới**: `src/components/Modal.jsx`

```javascript
// src/components/Modal.jsx
import ReactDOM from 'react-dom';
import { useEffect } from 'react';

function Modal({ onClose, children, actionBar }) {
    // Lesson 247: Khóa cuộn trang body khi Modal đang mở
    useEffect(() => {
        document.body.classList.add('overflow-hidden');

        // Cleanup: Mở lại cuộn trang khi Modal đóng (unmount)
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    // Sử dụng ReactDOM.createPortal để gắn HTML trực tiếp vào thẻ .modal-container
    return ReactDOM.createPortal(
        <div>
            {/* Lớp nền tối (Backdrop): Click vào nền tối sẽ gọi hàm onClose để đóng Modal */}
            <div 
                onClick={onClose} 
                className="fixed inset-0 bg-gray-300 opacity-80"
            ></div>

            {/* Hộp thoại Modal nằm ở giữa màn hình */}
            <div className="fixed inset-40 p-10 bg-white flex flex-col justify-between">
                {/* Nội dung chính của Modal */}
                <div>{children}</div>

                {/* Vùng chứa các nút bấm ở đáy Modal (ActionBar) */}
                <div className="flex justify-end">
                    {actionBar}
                </div>
            </div>
        </div>,
        // Vị trí DOM đích bên ngoài root
        document.querySelector('.modal-container')
    );
}

export default Modal;
```

---

### BƯỚC 3: Tạo Trang `ModalPage.jsx` (Bài 240, 244, 245)
* **File tạo mới**: `src/pages/ModalPage.jsx` (hoặc `src/page/ModalPage.jsx`)

```javascript
// src/pages/ModalPage.jsx
import { useState } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';

function ModalPage() {
    // State kiểm soát việc ẩn/hiện Modal
    const [showModal, setShowModal] = useState(false);

    // Mở Modal khi click nút
    const handleClick = () => {
        setShowModal(true);
    };

    // Đóng Modal
    const handleClose = () => {
        setShowModal(false);
    };

    // Danh sách các nút bấm ở chân Modal truyền vào prop actionBar
    const actionBar = (
        <div>
            <Button primary onClick={handleClose}>
                I Accept
            </Button>
        </div>
    );

    // Nội dung điều khoản truyền vào Modal qua children
    const modalContent = (
        <p>
            Here is an important agreement for you to accept! Please read carefully.
        </p>
    );

    return (
        <div>
            {/* Nút bấm để kích hoạt mở Modal */}
            <Button primary onClick={handleClick}>
                Open Modal
            </Button>

            {/* Điều kiện ngắn (Short-circuit): Chỉ render Modal khi showModal là true */}
            {showModal && (
                <Modal onClose={handleClose} actionBar={actionBar}>
                    {modalContent}
                </Modal>
            )}
        </div>
    );
}

export default ModalPage;
```

---

### BƯỚC 4: Thêm Route `/modal` vào `App.jsx` (Bài 239)
* **File sửa**: `src/App.jsx`

```javascript
import Sidebar from './components/Sidebar';
import Route from './components/Route';
import AccordionPage from './pages/AccordionPage';
import DropdownPage from './pages/DropdownPage';
import ButtonPage from './pages/ButtonPage';
import ModalPage from './pages/ModalPage'; // Import thêm ModalPage

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
                {/* THÊM ROUTE MODAL TẠI ĐÂY */}
                <Route path="/modal">
                    <ModalPage />
                </Route>
            </div>
        </div>
    );
}

export default App;
```

---

### BƯỚC 5: Thêm Link `Modal` vào `Sidebar.jsx` (Bài 239)
* **File sửa**: `src/components/Sidebar.jsx`

```javascript
import Link from './Link';

function Sidebar() {
    const links = [
        { label: 'Dropdown', path: '/' },
        { label: 'Accordion', path: '/accordion' },
        { label: 'Buttons', path: '/buttons' },
        { label: 'Modal', path: '/modal' } // THÊM LINK NÀY
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

## 🎯 TỔNG KẾT TƯ TƯỞNG CỐT LÕI SECTION 14
1. **Tại sao cần Portal?** -> Tránh cạm bẫy CSS `position: relative` ở thẻ cha khiến Modal bị bóp nghẹt.
2. **Cú pháp Portal**: `ReactDOM.createPortal(JSX, document.querySelector('.modal-container'))`.
3. **Quản lý State**: State `showModal` nằm ở trang cha (`ModalPage`), không nằm trong `Modal.jsx`.
4. **Trải nghiệm UX**: Dùng `useEffect` khóa cuộn `document.body.classList.add('overflow-hidden')` khi Modal xuất hiện.
