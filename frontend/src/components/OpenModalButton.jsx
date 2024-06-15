// frontend/src/components/OpenModalButton/OpenModalButton.jsx
////////////////////////////////////////////////////////
import { useModal } from '../context/Modal';

function OpenModalButton({
    modalComponent, // component to render inside the modal
    buttonText, // text of the button that opens the modal
    onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
    onModalClose, // optional: callback function that will be called once the modal is closed
    deleteButton
}) {
    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (typeof onButtonClick === "function") onButtonClick();
    };

    return <button onClick={onClick}>{deleteButton ? "Delete Review" : buttonText}</button>; //added
    // return <button onClick={onClick}>{buttonText}</button>;
}
console.log("HHHEEELOOOOOO", OpenModalButton)

export default OpenModalButton;
