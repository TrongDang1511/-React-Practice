import { useState } from 'react';
import { GoChevronDown, GoChevronLeft } from 'react-icons/go';

function Accordion({ items }) {
    // 1. Đổi giá trị mặc định thành -1 để đóng tất cả khi mới load trang
    const [expandedIndex, setExpandedIndex] = useState(-1);

    const handleClick = (nextIndex) => {
        // 2. Logic kiểm tra: Nếu click vào thẻ đang mở thì đóng nó lại (gán -1)
        if (expandedIndex === nextIndex) {
            setExpandedIndex(-1);
        } else {
            // Nếu click vào thẻ khác, thì mở thẻ đó ra
            setExpandedIndex(nextIndex);
        }
    };

    const renderedItems = items.map((item, index) => {
        const isExpanded = index === expandedIndex;

        const icon = <span className="text-2xl">{isExpanded ? <GoChevronDown /> : <GoChevronLeft />}</span>;

        return (
            <div key={item.id} className="border-x border-t rounded">
                <div
                    className="flex justify-between p-3 bg-gray-50 border-b items-center cursor-pointer"
                    onClick={() => handleClick(index)}
                >
                    {item.label}
                    {icon}
                </div>
                {isExpanded && <div className="border-b p-5">{item.content}</div>}
            </div>
        );
    });

    return (
        <div>
            {renderedItems}
        </div>
    );
}

export default Accordion;