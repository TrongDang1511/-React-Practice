import { useState } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';

function ModalPage() {
    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };
    const actionBar = (
        <div>
            <Button primary onClick={handleClose}>
                I Accept
            </Button>
        </div>
    );

    const modalContent = (
        <p>
            Here is an important agreement for you to accept! Please read carefully.
        </p>
    );

    return (
        <div>
            <Button primary onClick={handleClick}>
                Open Modal
            </Button>
            {showModal && (
                <Modal onClose={handleClose} actionBar={actionBar}>
                    {modalContent}
                </Modal>
            )}
        </div>
    );
}

export default ModalPage;