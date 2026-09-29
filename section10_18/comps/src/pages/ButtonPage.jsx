import { GoBell, GoCloudDownload, GoDatabase } from 'react-icons/go';
import Button from '../components/Button.jsx'; // Đường dẫn đã cập nhật

function ButtonPage() {
    return (
        <div className="p-10 flex flex-col gap-4">
            <div className="flex gap-4">
                <Button className="mb-5" rounded>
                    <GoBell />
                    Mặc định (Bo góc)
                </Button>
            </div>

            <div className="flex gap-4">
                <Button primary outline>
                    <GoCloudDownload />
                    Tải xuống ngay
                </Button>
            </div>

            <div className="flex gap-4">
                <Button success>
                    <GoDatabase />
                    Lưu dữ liệu
                </Button>
            </div>
        </div>
    );
}

export default ButtonPage;