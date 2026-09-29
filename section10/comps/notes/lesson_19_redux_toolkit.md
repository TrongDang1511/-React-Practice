# Section 19: Dive Into Redux Toolkit (Toàn bộ Bài 301 - 314)

## 📌 Bức tranh tổng quan (Tại sao cần Redux & Redux Toolkit?)

Khi ứng dụng phát triển lớn với hàng trăm Component, việc truyền State qua nhiều tầng Props (Prop Drilling) hoặc dùng `useReducer` tại từng Component riêng lẻ khiến việc quản lý dữ liệu trở nên phân mảnh.

* **Redux**: Là thư viện quản lý State tập trung (Centralized State Management). Toàn bộ State của ứng dụng sống ngoài cây Component trong một Object duy nhất gọi là **Redux Store**.
* **`react-redux`**: Thư viện cầu nối giúp các Component React kết nối và tương tác với Redux Store thông qua React Context System bên dưới.
* **Redux Toolkit (RTK)**: Thư viện chuẩn được đề xuất hiện nay để viết Redux. RTK giải quyết triệt để vấn đề "Boilerplate code" (viết quá nhiều mã lặp lại như Action Types, Switch Cases...) của Redux truyền thống, đồng thời tích hợp sẵn thư viện **Immer** giúp thao tác State dễ dàng.

---

## 📚 CHI TIẾT TỪNG BÀI HỌC (LÝ THUYẾT + CÚ PHÁP CODE + TƯ DUY)

---

### 📖 Lesson 301: Into the World of Redux (So sánh tư duy `useReducer` vs `Redux`)

> ⚠️ **Bài này chỉ có lý thuyết thuần túy** (Giúp định hình tư duy lưu trữ State).

#### 💡 Khái niệm & Tư duy:
* **Điểm giống nhau**: Redux giữ nguyên luồng tư duy từ `useReducer`: Để thay đổi State, bạn vẫn gửi một `action` object vào hàm `dispatch()`, action được chuyển tới `reducer` để tạo ra `state` mới.
* **Điểm khác nhau**:
  1. `useReducer`: Lưu State cục bộ bên trong **duy nhất 1 Component** (và truyền xuống con của nó). Khi Component bị unmount, State mất.
  2. `Redux`: Tạo ra một **Redux Store** nằm hoàn toàn **độc lập bên ngoài cây Component**. Bất kỳ Component nào trong ứng dụng cũng có thể truy cập trực tiếp vào Store.

#### 📊 Sơ đồ so sánh vị trí lưu trữ:
```text
  [useReducer - Cục bộ]                   [Redux - Tập trung]

       [App Component]                     ┌───────────────────────────┐
       │ (chứa State)                      │    REDUX STORE (Ngoài)    │
       ├── [Header]                        └─────────────┬─────────────┘
       └── [Dashboard]                                   │ (Kết nối trực tiếp)
            └── [UserProfile]              ┌─────────────┼─────────────┐
                (Phải chuyền props qua)    ▼             ▼             ▼
                                       [Header]     [Dashboard]  [UserProfile]
```

---

### 📖 Lesson 302: Redux vs Redux Toolkit

> 💡 **Code minh họa/tham khảo** (So sánh cú pháp giữa Redux truyền thống và Redux Toolkit – Không viết trực tiếp vào dự án).

#### 💡 Khái niệm & Tư duy:
* **Tầm quan trọng của `dispatch`**: Mọi thay đổi dữ liệu đều phải thông qua hàm `dispatch`. Nhờ đó ta dễ dàng theo dõi (traceability) nguyên nhân vì sao State thay đổi và từ Component nào.
* **Vấn đề của Redux truyền thống**: Bạn phải viết rất nhiều code lặp đi lặp lại (Boilerplate) như khai báo hằng số Action Types, Action Creators, và viết câu lệnh `switch/case`.
* **Giải pháp Redux Toolkit (RTK)**: Cung cấp hàm `createSlice()` để tự động tạo ra cả Action Types, Action Creators và Reducers chỉ trong 1 khối duy nhất.

#### 💻 Code so sánh cú pháp:

```javascript
// ❌ CÁCH VIẾT REDUX TRUYỀN THỐNG (Rối rắm, nhiều boilerplate)
const ADD_SONG = 'song/addSong'; // 1. Khai báo hằng số Action Type

function addSong(song) {         // 2. Viết hàm Action Creator
    return { type: ADD_SONG, payload: song };
}

function songsReducer(state = [], action) { // 3. Viết Switch/Case
    switch (action.type) {
        case ADD_SONG:
            return [...state, action.payload];
        default:
            return state;
    }
}
```

```javascript
// ✅ CÁCH VIẾT REDUX TOOLKIT (Gọn gàng, hiện đại)
import { createSlice } from '@reduxjs/toolkit';

const songsSlice = createSlice({
    name: 'song',
    initialState: [],
    reducers: {
        addSong(state, action) {
            // Viết trực tiếp push nhờ tích hợp sẵn Immer!
            state.push(action.payload);
        }
    }
});
// RTK tự động sinh ra cả Action Creator addSong và Reducer!
```

---

### 📖 Lesson 303: App Overview

> ⚠️ **Bài này chỉ giới thiệu yêu cầu bài toán thực hành.**

#### 💡 Khái niệm & Yêu cầu ứng dụng:
Xây dựng ứng dụng **Playlist** gồm 2 tính năng độc lập:
1. **Song Playlist**: Nút "Add Song" (thêm ngẫu nhiên 1 bài hát) và nút "X" (xóa bài hát đó).
2. **Movie Playlist**: Nút "Add Movie" (thêm ngẫu nhiên 1 bộ phim) và nút "X" (xóa bộ phim đó).
3. **Reset Both Button**: Nút nằm ở trên cùng để xóa toàn bộ bài hát và phim cùng lúc.

---

### 📖 Lesson 304: The Path Forward

> 💡 **Code minh họa cấu trúc dữ liệu tổng (State Shape) & Cấu trúc thư mục.**

#### 💡 Tư duy thiết kế State trong Redux:
Toàn bộ State của ứng dụng Redux này sẽ là 1 Object duy nhất chứa 2 mảng:
```javascript
// Cấu trúc State tổng lưu trong Redux Store:
{
    songs: ['Bài hát A', 'Bài hát B'],
    movies: ['Phim X', 'Phim Y']
}
```

#### 📁 Cấu trúc thư mục quy hoạch code Redux:
Tạo thư mục `src/store` chứa file `src/store/index.js`. Ban đầu ta sẽ viết toàn bộ code Redux vào file này để dễ hình dung, sau đó sẽ tách ra từng file slice riêng.

---

### 📖 Lesson 305: Implementation Time! (Khởi tạo Store và Slice)

> 🛠️ **Code CHÍNH THỨC trong dự án**: Tạo file `src/store/index.js`.

#### 💡 Tư duy & Cú pháp:
* `createSlice()`: Khai báo một lát cắt dữ liệu (State + Reducers).
* `configureStore()`: Hàm tạo ra Redux Store chứa tất cả các Slice Reducers.

```javascript
// src/store/index.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// 1. Khai tạo Slice quản lý danh sách bài hát (Songs)
const songsSlice = createSlice({
    name: 'song', // Tên định danh của slice (dùng làm tiền tố cho Action Type)
    initialState: [], // Giá trị State ban đầu là 1 mảng rỗng
    reducers: {
        // Hàm reducer xử lý thêm bài hát
        addSong(state, action) {
            // state ở đây đại diện cho mảng songs
            state.push(action.payload); // Đột biến mảng trực tiếp nhờ Immer
        },
        // Hàm reducer xử lý xóa bài hát (tạm thời để trống)
        removeSong(state, action) {}
    }
});

// 2. Khởi tạo Redux Store tổng
const store = configureStore({
    reducer: {
        // Khai báo thuộc tính 'songs' trong State tổng sẽ do songsSlice.reducer quản lý
        songs: songsSlice.reducer
    }
});

// Export store để kiểm tra
export { store };
```

---

### 📖 Lesson 306: Understanding the Store

> 💡 **Code thử nghiệm / Debug thủ công** (Dùng để hiểu cơ chế hoạt động của Store, sẽ xóa các dòng `console.log` và `dispatch` thủ công này khi bọc vào React).

#### 💡 Tư duy & Cú pháp:
* `store.getState()`: Lấy ra Object State hiện tại của Store.
* `store.dispatch(action)`: Phát một Action thử nghiệm lên Store.
* **Quy tắc quan trọng**: Key đặt ở `configureStore({ reducer: { songs: ... } })` chính là tên thuộc tính xuất hiện trong Object State tổng.

```javascript
// src/store/index.js (Đoạn code chạy thử ở cuối file)

// 1. Lấy State ban đầu từ Store
const startingState = store.getState();
console.log(JSON.stringify(startingState)); 
// Output: {"songs":[]} -> Vì initialState của songsSlice là []

// 2. Thử nghiệm dispatch một Action thủ công với Action Type đặc biệt
store.dispatch({
    type: 'song/addSong', // Định dạng: name/reducerName
    payload: 'New Song!!!'
});

// 3. Lấy lại State sau khi dispatch
const finalState = store.getState();
console.log(JSON.stringify(finalState)); 
// Output: {"songs":["New Song!!!"]} -> State đã được cập nhật thành công!
```

---

### 📖 Lesson 307: The Store's Initial State

> 🛠️ **Code CHÍNH THỨC trong dự án**: Điều chỉnh `initialState`.

#### 💡 Tư duy:
`initialState` quyết định kiểu dữ liệu và giá trị ban đầu của Slice đó trong Store. Có thể là mảng `[]`, số `0`, chuỗi `""` hoặc object `{}`.

```javascript
// src/store/index.js
const songsSlice = createSlice({
    name: 'song',
    initialState: [], // Chọn mảng rỗng vì danh sách bài hát là 1 mảng các chuỗi
    reducers: {
        addSong(state, action) {
            state.push(action.payload);
        }
    }
});
```

---

### 📖 Lesson 308: Understanding Slices (Cơ chế gộp Reducer & Quy tắc tham số `state`)

> 🛠️ **Code CHÍNH THỨC trong dự án**: Hiểu bản chất các thuộc tính trong Slice.

#### 💡 Tư duy & Phân biệt CỰC KỲ QUANG TRỌNG:
1. `songsSlice.reducer` (Không có 's'): Là một hàm **Mega-Reducer** được RTK tự động gộp từ tất cả các hàm nhỏ trong mục `reducers`. Đây là hàm được truyền vào `configureStore`.
2. **Tham số `state` bên trong Reducer của Slice**: 
   * **KHÔNG PHẢI** là Object State tổng của Store.
   * **CHỈ LÀ** mảnh State riêng do Slice đó quản lý (Ở đây `state` chính là mảng `songs`).
3. **Immer**: Cho phép dùng `state.push()` thay vì phải viết `[...state, action.payload]`.

```javascript
// src/store/index.js
const songsSlice = createSlice({
    name: 'song',
    initialState: [],
    reducers: {
        // state đại diện cho mảng songs (không phải toàn bộ store)
        addSong(state, action) {
            state.push(action.payload); // Sửa trực tiếp mảng an toàn nhờ Immer
        }
    }
});

const store = configureStore({
    reducer: {
        songs: songsSlice.reducer // Kết nối Mega-Reducer vào key 'songs' của Store
    }
});
```

---

### 📖 Lesson 309: Understanding Action Creators

> 🛠️ **Code CHÍNH THỨC trong dự án**: Xuất các Action Creators tự động.

#### 💡 Tư duy & Cú pháp:
`createSlice` tự động tạo ra các hàm **Action Creator** đính kèm trong thuộc tính `slice.actions`. 
* Khi gọi `songsSlice.actions.addSong("Bài hát A")` -> Trả về object: `{ type: "song/addSong", payload: "Bài hát A" }`.
* Giúp ta không bao giờ phải gõ thủ công chuỗi `'song/addSong'` (chống lỗi chính tả typo).

```javascript
// src/store/index.js

// Export các Action Creators để các Component React import và sử dụng
export const { addSong, removeSong } = songsSlice.actions;

// Test thử trong console:
console.log(addSong('Despacito')); 
// Output log: { type: 'song/addSong', payload: 'Despacito' }
```

---

### 📖 Lesson 310: Connecting React to Redux

> 🛠️ **Code CHÍNH THỨC trong dự án**: Bọc `<Provider>` tại file `src/main.jsx`.

#### 💡 Tư duy & 4 Bước kết nối React với Redux:
1. Export `store` từ file `src/store/index.js`.
2. Mở file gốc ứng dụng (`src/main.jsx`).
3. Import `Provider` từ thư viện `react-redux`.
4. Bọc Component `<App />` bằng `<Provider store={store}>`.

```javascript
// src/main.jsx
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // 1. Import Provider từ react-redux
import { store } from './store';        // 2. Import store từ file store vừa tạo
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
    // 3. Bọc App bằng Provider và truyền prop store
    <Provider store={store}>
        <App />
    </Provider>
);
```

---

### 📖 Lesson 311: Updating State from a Component (Phát Action từ Component)

> 🛠️ **Code CHÍNH THỨC trong dự án**: Cập nhật `src/components/SongPlaylist.jsx` (Luồng Dispatch).

#### 💡 Tư duy & 6 Bước cập nhật State từ Component:
1. Import `useDispatch` từ `react-redux`.
2. Import Action Creator (`addSong`) từ `../store`.
3. Gọi `const dispatch = useDispatch()` ở đầu Component.
4. Trong Event Handler, gọi `dispatch(addSong(songName))`.

```javascript
// src/components/SongPlaylist.jsx
import { useDispatch } from 'react-redux'; // 1. Import hook useDispatch
import { addSong } from '../store';        // 2. Import Action Creator addSong
import { createRandomSong } from '../data';

function SongPlaylist() {
    const dispatch = useDispatch(); // 3. Lấy hàm dispatch từ Store

    const handleSongAdd = (song) => {
        // 4. Gọi dispatch kết hợp Action Creator kèm payload song
        dispatch(addSong(song));
    };

    return (
        <div className="p-4 border rounded shadow bg-white my-4">
            <button
                onClick={() => handleSongAdd(createRandomSong())}
                className="bg-blue-500 text-white px-3 py-1.5 rounded"
            >
                + Add Song to Playlist
            </button>
        </div>
    );
}

export default SongPlaylist;
```

---

### 📖 Lesson 312: Accessing State in a Component (Đọc State bằng `useSelector`)

> 🛠️ **Code CHÍNH THỨC trong dự án**: Cập nhật `src/components/SongPlaylist.jsx` (Luồng Đọc dữ liệu).

#### 💡 Tư duy & Cú pháp:
* `useSelector`: Hook giúp Component truy cập vào Redux Store để lấy dữ liệu.
* **Selector Function `(state) => state.songs`**:
  * Tham số `state` ở đây chính là **Object State TỔNG** của Store (`{ songs: [...], movies: [...] }`).
  * Trả về `state.songs` để Component chỉ lấy đúng mảng bài hát mà nó cần (giúp tối ưu re-render).

```javascript
// src/components/SongPlaylist.jsx
import { useDispatch, useSelector } from 'react-redux'; // 1. Import useSelector
import { addSong } from '../store';

function SongPlaylist() {
    const dispatch = useDispatch();
    
    // 2. Đọc dữ liệu mảng songs từ Redux Store tổng
    const songPlaylist = useSelector((state) => {
        return state.songs; // state đại diện cho TOÀN BỘ Store
    });

    const renderedSongs = songPlaylist.map((song) => {
        return <li key={song}>{song}</li>;
    });

    return (
        <div>
            <ul>{renderedSongs}</ul>
        </div>
    );
}

export default SongPlaylist;
```

---

### 📖 Lesson 313: Removing Content (Hoàn thiện tính năng Xóa bài hát)

> 🛠️ **Code CHÍNH THỨC trong dự án**: Viết reducer `removeSong` và xử lý click nút X.

#### 💡 Cú pháp & Thao tác xóa mảng với Immer:
* Trong reducer `removeSong`: Dùng `state.indexOf(action.payload)` để tìm vị trí và `state.splice(index, 1)` để xóa.

```javascript
// 1. TRONG FILE src/store/index.js
const songsSlice = createSlice({
    name: 'song',
    initialState: [],
    reducers: {
        addSong(state, action) {
            state.push(action.payload);
        },
        // Xử lý xóa bài hát
        removeSong(state, action) {
            // action.payload chính là tên bài hát cần xóa (chuỗi string)
            const index = state.indexOf(action.payload);
            state.splice(index, 1); // Xóa 1 phần tử tại vị trí index
        }
    }
});

export const { addSong, removeSong } = songsSlice.actions;
```

```javascript
// 2. TRONG FILE src/components/SongPlaylist.jsx
import { useDispatch, useSelector } from 'react-redux';
import { addSong, removeSong } from '../store'; // Import thêm removeSong

function SongPlaylist() {
    const dispatch = useDispatch();
    const songPlaylist = useSelector((state) => state.songs);

    const handleSongRemove = (song) => {
        // Dispatch action xóa bài hát
        dispatch(removeSong(song));
    };

    const renderedSongs = songPlaylist.map((song) => {
        return (
            <li key={song} className="flex justify-between py-2">
                <span>{song}</span>
                <button 
                    onClick={() => handleSongRemove(song)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                >
                    X
                </button>
            </li>
        );
    });

    return <ul>{renderedSongs}</ul>;
}
```

---

### 📖 Lesson 314: Practice Updating State! (Thực hành tạo `moviesSlice` & Component `MoviePlaylist`)

> 🛠️ **Code CHÍNH THỨC trong dự án**: Mở rộng thêm Slice quản lý Phim.

#### 💡 Tư duy:
Quy trình tạo một Slice mới hoàn toàn tương tự như `songsSlice`: Tạo Slice -> Đăng ký vào `configureStore` -> Export Action Creators -> Sử dụng trong Component.

```javascript
// 1. TRONG FILE src/store/index.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Tạo Slice cho Movies
const moviesSlice = createSlice({
    name: 'movie',
    initialState: [],
    reducers: {
        addMovie(state, action) {
            state.push(action.payload);
        },
        removeMovie(state, action) {
            const index = state.indexOf(action.payload);
            state.splice(index, 1);
        }
    }
});

// Đăng ký cả 2 slice vào Store
const store = configureStore({
    reducer: {
        songs: songsSlice.reducer,
        movies: moviesSlice.reducer // Thêm key 'movies' vào Store tổng
    }
});

export { store };
export const { addSong, removeSong } = songsSlice.actions;
export const { addMovie, removeMovie } = moviesSlice.actions; // Export actions của movie
```

```javascript
// 2. TRONG FILE src/components/MoviePlaylist.jsx
import { useDispatch, useSelector } from 'react-redux';
import { addMovie, removeMovie } from '../store';
import { createRandomMovie } from '../data';

function MoviePlaylist() {
    const dispatch = useDispatch();
    // Đọc mảng movies từ State tổng của Store
    const moviePlaylist = useSelector((state) => state.movies);

    const handleMovieAdd = (movie) => {
        dispatch(addMovie(movie));
    };

    const handleMovieRemove = (movie) => {
        dispatch(removeMovie(movie));
    };

    const renderedMovies = moviePlaylist.map((movie) => {
        return (
            <li key={movie} className="flex justify-between py-2">
                <span>{movie}</span>
                <button
                    onClick={() => handleMovieRemove(movie)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                >
                    X
                </button>
            </li>
        );
    });

    return (
        <div className="p-4 border rounded shadow bg-white my-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Movie Playlist</h3>
                <button
                    onClick={() => handleMovieAdd(createRandomMovie())}
                    className="bg-blue-500 text-white px-3 py-1.5 rounded"
                >
                    + Add Movie to Playlist
                </button>
            </div>
            <ul>{renderedMovies}</ul>
        </div>
    );
}

export default MoviePlaylist;
```

---

## 🎯 TỔNG KẾT TƯ TƯỞNG & CÚ PHÁP CỐT LÕI SECTION 19

| Khái niệm | Vị trí / Cú pháp | Vai trò / Tư duy |
| :--- | :--- | :--- |
| **`createSlice`** | `src/store/index.js` | Khai báo 1 lát cắt dữ liệu gồm `name`, `initialState`, `reducers`. |
| **`configureStore`** | `src/store/index.js` | Tạo Store tổng và gom các `slice.reducer` lại thành Object State lớn. |
| **`Provider`** | `src/main.jsx` | Bọc ứng dụng React để mọi Component truy cập được Redux Store. |
| **`useDispatch`** | Trong Component | Lấy hàm `dispatch()` để gửi lệnh `dispatch(actionCreator(payload))` sửa State. |
| **`useSelector`** | Trong Component | Lấy dữ liệu từ Store `useSelector((state) => state.keyName)`. |

---

## 📦 TOÀN BỘ CODE HOÀN CHÍNH CHO DỰ ÁN (BÀI 301 - 314)

Dưới đây là mã nguồn hoàn chỉnh của toàn bộ 5 file trong dự án sau khi tổng hợp xong từ Bài 301 đến Bài 314.

---

### 1. File `src/store/index.js` (Quản lý toàn bộ Redux Store & Slices)

```javascript
import { configureStore, createSlice } from '@reduxjs/toolkit';

// 1. Tạo Songs Slice (Quản lý danh sách bài hát)
const songsSlice = createSlice({
    name: 'song',
    initialState: [],
    reducers: {
        addSong(state, action) {
            state.push(action.payload);
        },
        removeSong(state, action) {
            const index = state.indexOf(action.payload);
            state.splice(index, 1);
        }
    }
});

// 2. Tạo Movies Slice (Quản lý danh sách bộ phim)
const moviesSlice = createSlice({
    name: 'movie',
    initialState: [],
    reducers: {
        addMovie(state, action) {
            state.push(action.payload);
        },
        removeMovie(state, action) {
            const index = state.indexOf(action.payload);
            state.splice(index, 1);
        }
    }
});

// 3. Tạo Redux Store tổng hợp tất cả các reducers
const store = configureStore({
    reducer: {
        songs: songsSlice.reducer,
        movies: moviesSlice.reducer
    }
});

// 4. Export Store và tất cả Action Creators
export { store };
export const { addSong, removeSong } = songsSlice.actions;
export const { addMovie, removeMovie } = moviesSlice.actions;
```

---

### 2. File `src/main.jsx` (Khởi chạy ứng dụng & Bọc Provider)

```javascript
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
);
```

---

### 3. File `src/components/SongPlaylist.jsx` (Component danh sách Bài hát)

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { addSong, removeSong } from '../store';
import { createRandomSong } from '../data';

function SongPlaylist() {
    const dispatch = useDispatch();
    const songPlaylist = useSelector((state) => state.songs);

    const handleSongAdd = (song) => {
        dispatch(addSong(song));
    };

    const handleSongRemove = (song) => {
        dispatch(removeSong(song));
    };

    const renderedSongs = songPlaylist.map((song) => {
        return (
            <li key={song} className="flex justify-between items-center py-2 border-b">
                <span>{song}</span>
                <button
                    onClick={() => handleSongRemove(song)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                    X
                </button>
            </li>
        );
    });

    return (
        <div className="p-4 border rounded shadow bg-white my-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Song Playlist</h3>
                <button
                    onClick={() => handleSongAdd(createRandomSong())}
                    className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600"
                >
                    + Add Song to Playlist
                </button>
            </div>
            <ul>{renderedSongs}</ul>
        </div>
    );
}

export default SongPlaylist;
```

---

### 4. File `src/components/MoviePlaylist.jsx` (Component danh sách Bộ phim)

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { addMovie, removeMovie } from '../store';
import { createRandomMovie } from '../data';

function MoviePlaylist() {
    const dispatch = useDispatch();
    const moviePlaylist = useSelector((state) => state.movies);

    const handleMovieAdd = (movie) => {
        dispatch(addMovie(movie));
    };

    const handleMovieRemove = (movie) => {
        dispatch(removeMovie(movie));
    };

    const renderedMovies = moviePlaylist.map((movie) => {
        return (
            <li key={movie} className="flex justify-between items-center py-2 border-b">
                <span>{movie}</span>
                <button
                    onClick={() => handleMovieRemove(movie)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                    X
                </button>
            </li>
        );
    });

    return (
        <div className="p-4 border rounded shadow bg-white my-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Movie Playlist</h3>
                <button
                    onClick={() => handleMovieAdd(createRandomMovie())}
                    className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600"
                >
                    + Add Movie to Playlist
                </button>
            </div>
            <ul>{renderedMovies}</ul>
        </div>
    );
}

export default MoviePlaylist;
```

---

### 5. File `src/App.jsx` (Component tổng của ứng dụng)

```javascript
import SongPlaylist from './components/SongPlaylist';
import MoviePlaylist from './components/MoviePlaylist';

function App() {
    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            <h1 className="text-2xl font-bold mb-4">Playlist Management App</h1>
            <MoviePlaylist />
            <hr className="my-6" />
            <SongPlaylist />
        </div>
    );
}

export default App;
```
